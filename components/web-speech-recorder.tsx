'use client'
import React, { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'

interface WebSpeechRecorderProps {
  onTranscriptionComplete: (text: string, confidence: number) => void
  isLoading: boolean
}

export default function WebSpeechRecorder({ onTranscriptionComplete, isLoading }: WebSpeechRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (SpeechRecognition) {
      setIsSupported(true)
      const recognition = new SpeechRecognition()
      
      // Configure recognition settings
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 1
      
      recognition.onstart = () => {
        console.log('Speech recognition started')
        setIsRecording(true)
        setTranscript('')
        toast.success('Listening... Speak now!')
      }
      
      recognition.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''
        let totalConfidence = 0
        let resultCount = 0
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const confidence = result[0]?.confidence || 0
          
          if (result.isFinal) {
            finalTranscript += result[0].transcript
            totalConfidence += confidence
            resultCount++
          } else {
            interimTranscript += result[0].transcript
          }
        }
        
        const currentTranscript = finalTranscript || interimTranscript
        setTranscript(currentTranscript)
        
        if (resultCount > 0) {
          setConfidence(totalConfidence / resultCount)
        }
      }
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
        
        switch (event.error) {
          case 'no-speech':
            toast.error('No speech detected. Please try again.')
            break
          case 'audio-capture':
            toast.error('Microphone not accessible. Please check permissions.')
            break
          case 'not-allowed':
            toast.error('Microphone permission denied. Please allow microphone access.')
            break
          case 'network':
            toast.error('Network error. Please check your connection.')
            break
          default:
            toast.error(`Speech recognition error: ${event.error}`)
        }
      }
      
      recognition.onend = () => {
        console.log('Speech recognition ended')
        setIsRecording(false)
        
        if (transcript.trim()) {
          onTranscriptionComplete(transcript.trim(), confidence)
          toast.success('Transcription completed!')
        }
      }
      
      recognitionRef.current = recognition
    } else {
      setIsSupported(false)
      toast.error('Speech recognition not supported in this browser')
    }
  }, [transcript, confidence, onTranscriptionComplete])

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error('Error starting speech recognition:', error)
        toast.error('Failed to start speech recognition')
      }
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop()
    }
  }

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Speech Recognition Not Supported
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari for the best experience.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Voice Recording (Free)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Uses your browser's built-in speech recognition - completely free!
        </p>
      </div>

      {/* Recording Controls */}
      <div className="flex justify-center space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isLoading}
            className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Stop Recording
          </button>
        )}
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
            Listening...
          </div>
        </div>
      )}

      {/* Live Transcript */}
      {transcript && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Live Transcript:</h4>
          <p className="text-gray-900">{transcript}</p>
          {confidence > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              Confidence: {Math.round(confidence * 100)}%
            </p>
          )}
        </div>
      )}

      {/* Browser Support Info */}
      <div className="text-xs text-gray-500 text-center">
        <p>Works best in Chrome, Edge, and Safari. Requires microphone permission.</p>
      </div>
    </div>
  )
}
