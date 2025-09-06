'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import AudioRecorder from './audio-recorder'
import AudioUpload from './audio-upload'
import WebSpeechRecorder from './web-speech-recorder'
import TranscriptionResults from './transcription-results'
import { downloadTextFile, generateFilename, formatTranscriptionForDownload } from '../lib/download-utils'

interface TranscriptionResult {
  text: string
  language: string
  duration: number
  wordCount: number
  fileName: string
  fileSize: number
  timestamp: string
}

export default function TranscriptionInterface() {
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [result, setResult] = useState<TranscriptionResult | null>(null)
  const [inputMethod, setInputMethod] = useState<'record' | 'upload' | 'free'>('free')

  const transcribeAudio = async (audioBlob: Blob, fileName: string = 'recording.webm') => {
    setIsTranscribing(true)
    setResult(null)

    try {
      toast.loading('Transcribing audio...', {
        description: 'This may take a few moments depending on the audio length.'
      })

      // Create FormData for the API request
      const formData = new FormData()
      const audioFile = new File([audioBlob], fileName, { type: audioBlob.type })
      formData.append('audio', audioFile)

      // Call the transcription API
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to transcribe audio')
      }

      const transcriptionResult = await response.json()
      setResult(transcriptionResult)

      toast.success('Transcription completed!', {
        description: `${transcriptionResult.wordCount} words transcribed and displayed below`
      })

    } catch (error) {
      console.error('Transcription error:', error)
      toast.error('Transcription failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      })
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleRecordingComplete = (audioBlob: Blob) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `recording_${timestamp}.webm`
    transcribeAudio(audioBlob, fileName)
  }

  const handleFileSelect = (file: File) => {
    transcribeAudio(file, file.name)
  }

  const handleFreeTranscription = (text: string, confidence: number) => {
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length
    const result: TranscriptionResult = {
      text,
      language: 'en',
      duration: 0, // Web Speech API doesn't provide duration
      wordCount,
      fileName: 'voice_recording',
      fileSize: 0,
      timestamp: new Date().toISOString()
    }
    
    setResult(result)
    toast.success('Transcription completed!', {
      description: `${wordCount} words transcribed and displayed below (${Math.round(confidence * 100)}% confidence)`
    })
  }

  const handleDownload = () => {
    if (!result) return

    const formattedContent = formatTranscriptionForDownload(result.text, {
      fileName: result.fileName,
      duration: result.duration,
      wordCount: result.wordCount,
      language: result.language,
      timestamp: result.timestamp
    })

    const filename = generateFilename(result.fileName, result.timestamp)
    downloadTextFile(formattedContent, filename)

    toast.success('File downloaded!', {
      description: `Saved as ${filename}`
    })
  }

  const handleNewTranscription = () => {
    setResult(null)
    toast.info('Ready for new transcription')
  }

  const handleInputMethodChange = (method: 'free' | 'record' | 'upload') => {
    setInputMethod(method)
    // Automatically reset result when switching tabs
    if (result) {
      setResult(null)
      toast.info(`Switched to ${method === 'free' ? 'Free Voice' : method === 'record' ? 'Record Audio' : 'Upload File'}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Input Method Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => handleInputMethodChange('free')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              inputMethod === 'free'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🆓 Free Voice
          </button>
          <button
            onClick={() => handleInputMethodChange('record')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              inputMethod === 'record'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🎤 Record Audio
          </button>
          <button
            onClick={() => handleInputMethodChange('upload')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              inputMethod === 'upload'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📁 Upload File
          </button>
        </div>
      </div>

      {/* Input Interface */}
      {!result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {inputMethod === 'free' ? (
            <WebSpeechRecorder 
              onTranscriptionComplete={handleFreeTranscription}
              isLoading={isTranscribing}
            />
          ) : inputMethod === 'record' ? (
            <AudioRecorder 
              onRecordingComplete={handleRecordingComplete}
              disabled={isTranscribing}
            />
          ) : (
            <AudioUpload 
              onFileSelect={handleFileSelect}
              disabled={isTranscribing}
            />
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4">
              {inputMethod === 'free' ? 'Free Voice Recognition' : 
               inputMethod === 'record' ? 'Voice Recording' : 'File Upload'}
            </h3>
            
            {inputMethod === 'free' ? (
              <div className="space-y-3 text-sm text-blue-800">
                <p>• <strong>100% FREE</strong> - Uses your browser's built-in speech recognition</p>
                <p>• Click "Start Recording" and speak clearly</p>
                <p>• Real-time transcription appears as you speak</p>
                <p>• Click "Stop Recording" when finished</p>
                <p>• Works best in Chrome, Edge, and Safari</p>
                <p>• Requires microphone permission</p>
              </div>
            ) : inputMethod === 'record' ? (
              <div className="space-y-3 text-sm text-blue-800">
                <p>• Click "Start Recording" to begin capturing your voice</p>
                <p>• Speak clearly and at a normal pace</p>
                <p>• Click "Stop Recording" when finished</p>
                <p>• The audio will be automatically transcribed</p>
                <p>• Only English is supported at this time</p>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-blue-800">
                <p>• Supported formats: MP3, WAV, M4A, MP4, WebM, OGG</p>
                <p>• Maximum file size: 25MB</p>
                <p>• Drag and drop or click to select a file</p>
                <p>• The audio will be automatically transcribed</p>
                <p>• Only English is supported at this time</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isTranscribing && (
        <div className="bg-white border border-gray-300 rounded-lg p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Transcribing Audio</h3>
            <p className="text-gray-600">Please wait while we process your audio file...</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Success Header */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  ✅ Transcription Complete!
                </h3>
                <div className="mt-1 text-sm text-green-700">
                  <p>Your transcribed text is displayed below. You can copy it or download it as a file.</p>
                </div>
              </div>
            </div>
          </div>

          <TranscriptionResults
            result={result}
            onDownload={handleDownload}
            onNewTranscription={handleNewTranscription}
          />
        </div>
      )}
    </div>
  )
}
