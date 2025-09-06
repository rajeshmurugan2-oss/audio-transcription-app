'use client'

import { useState } from 'react'

interface TranscriptionResult {
  text: string
  language: string
  duration: number
  wordCount: number
  fileName: string
  fileSize: number
  timestamp: string
}

interface TranscriptionResultsProps {
  result: TranscriptionResult | null
  onDownload: () => void
  onNewTranscription: () => void
}

export default function TranscriptionResults({ result, onDownload, onNewTranscription }: TranscriptionResultsProps) {
  const [copied, setCopied] = useState(false)

  if (!result) return null

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Transcription Results</h3>
        <button
          onClick={onNewTranscription}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          New Transcription
        </button>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">File Name</div>
          <div className="text-sm text-gray-900 truncate" title={result.fileName}>
            {result.fileName}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Duration</div>
          <div className="text-sm text-gray-900">
            {formatDuration(result.duration)}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Word Count</div>
          <div className="text-sm text-gray-900">
            {result.wordCount.toLocaleString()} words
          </div>
        </div>
      </div>

      {/* Additional metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">File Size</div>
          <div className="text-sm text-gray-900">
            {formatFileSize(result.fileSize)}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Language</div>
          <div className="text-sm text-gray-900 capitalize">
            {result.language}
          </div>
        </div>
      </div>

      {/* Transcription Text - Enhanced Display */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">📝 Transcribed Text</h4>
          <button
            onClick={copyToClipboard}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Text
              </>
            )}
          </button>
        </div>
        
        {/* Main Text Display Area */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="max-h-96 overflow-y-auto">
            <p className="text-gray-900 leading-relaxed whitespace-pre-wrap text-base">
              {result.text}
            </p>
          </div>
        </div>
        
        {/* Text Stats */}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <span>📊 {result.wordCount.toLocaleString()} words</span>
          <span>⏱️ {formatDuration(result.duration)}</span>
          <span>🌐 {result.language.toUpperCase()}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={copyToClipboard}
          className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          📋 Copy Text
        </button>
        
        <button
          onClick={onDownload}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          💾 Download File
        </button>
      </div>

      {/* Timestamp */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Transcribed on {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>
  )
}
