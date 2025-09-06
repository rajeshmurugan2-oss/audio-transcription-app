import TranscriptionInterface from '../components/transcription-interface'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Audio Transcription App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Demo Mode
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Audio Transcription App
          </h2>
          <p className="text-lg text-gray-600">
            Transcribe your audio files with AI-powered accuracy
          </p>
        </div>

        {/* Audio Transcription Interface */}
        <TranscriptionInterface />
      </main>
    </div>
  )
}
