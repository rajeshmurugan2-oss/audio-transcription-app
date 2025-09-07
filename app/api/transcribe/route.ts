import { NextRequest, NextResponse } from 'next/server'

// Debug environment variables
console.log('Environment check:')
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY)
console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0)
console.log('OPENAI_API_KEY starts with sk-:', process.env.OPENAI_API_KEY?.startsWith('sk-') || false)
console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('OPENAI')))

// Try multiple ways to get the API key
const apiKey = process.env.OPENAI_API_KEY || 
               process.env.NEXT_PUBLIC_OPENAI_API_KEY || 
               process.env.OPENAI_KEY

console.log('Final API key found:', !!apiKey)
console.log('API key length:', apiKey?.length || 0)

// Debug info for responses
const debugInfo = {
  hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  hasPublicKey: !!process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  hasOpenAIKeyAlt: !!process.env.OPENAI_KEY,
  allEnvVars: Object.keys(process.env).filter(key => key.includes('OPENAI'))
}

// Initialize OpenAI only if API key exists
let openai: any = null
try {
  if (apiKey) {
    const OpenAI = require('openai').default
    openai = new OpenAI({
      apiKey: apiKey,
    })
    console.log('OpenAI client initialized successfully')
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error)
}

export async function GET() {
  return NextResponse.json({
    message: 'Transcribe API is working',
    timestamp: new Date().toISOString(),
    config: debugInfo,
    openaiInitialized: !!openai,
    environment: process.env.NODE_ENV
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('Transcription request received')
    
    // Check if OpenAI API key is available first
    if (!apiKey) {
      console.error('OpenAI API key not configured')
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to environment variables.',
          details: 'This feature requires an OpenAI API key to work.',
          debug: debugInfo
        },
        { status: 500 }
      )
    }

    // Check if OpenAI client is initialized
    if (!openai) {
      console.error('OpenAI client not initialized')
      return NextResponse.json(
        { 
          error: 'OpenAI client initialization failed.',
          details: 'Failed to initialize OpenAI client. Check your API key.',
          debug: debugInfo
        },
        { status: 500 }
      )
    }

    // For demo mode, skip authentication check
    console.log('Processing transcription request in demo mode')

    // Get the form data
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    
    if (!audioFile) {
      console.log('No audio file provided')
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    console.log(`Audio file received: ${audioFile.name}, size: ${audioFile.size} bytes`)

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a', 'audio/webm', 'audio/ogg']
    if (!allowedTypes.includes(audioFile.type)) {
      console.log(`Invalid file type: ${audioFile.type}`)
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload MP3, WAV, M4A, MP4, WebM, or OGG files.' 
      }, { status: 400 })
    }

    // Validate file size (25MB limit)
    const maxSize = 25 * 1024 * 1024 // 25MB
    if (audioFile.size > maxSize) {
      console.log(`File too large: ${audioFile.size} bytes`)
      return NextResponse.json({ 
        error: 'File size must be less than 25MB' 
      }, { status: 400 })
    }

    console.log('Starting OpenAI transcription...')

    // Convert File to Buffer for OpenAI API
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create a File-like object for OpenAI
    const audioBlob = new File([buffer], audioFile.name, { type: audioFile.type })

    // Transcribe using OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: audioBlob,
      model: 'whisper-1',
      language: 'en', // English only for now
      response_format: 'verbose_json', // Get additional metadata
    })

    console.log('Transcription completed successfully')

    // Calculate word count
    const wordCount = transcription.text.split(/\s+/).filter(word => word.length > 0).length

    // Prepare response
    const result = {
      text: transcription.text,
      language: transcription.language || 'en',
      duration: transcription.duration || 0,
      wordCount: wordCount,
      fileName: audioFile.name,
      fileSize: audioFile.size,
      timestamp: new Date().toISOString()
    }

    console.log(`Transcription result: ${wordCount} words, ${result.duration}s duration`)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Transcription error:', error)
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('Invalid file format')) {
        return NextResponse.json({ 
          error: 'Invalid audio file format. Please try a different file.' 
        }, { status: 400 })
      }
      
      if (error.message.includes('File size')) {
        return NextResponse.json({ 
          error: 'File is too large. Please upload a file smaller than 25MB.' 
        }, { status: 400 })
      }

      if (error.message.includes('Rate limit')) {
        return NextResponse.json({ 
          error: 'Rate limit exceeded. Please try again later or use the free voice recognition feature.',
          details: 'OpenAI API rate limit reached. Consider using the "Free Voice" tab for unlimited usage.'
        }, { status: 429 })
      }
    }

    return NextResponse.json({ 
      error: 'Failed to transcribe audio. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
