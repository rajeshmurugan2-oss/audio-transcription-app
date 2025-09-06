export function downloadTextFile(text: string, filename: string) {
  // Create a blob with the text content
  const blob = new Blob([text], { type: 'text/plain' })
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob)
  
  // Create a temporary anchor element
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  
  // Append to body, click, and remove
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  
  // Clean up the URL
  URL.revokeObjectURL(url)
}

export function generateFilename(originalName?: string, timestamp?: string): string {
  const now = timestamp ? new Date(timestamp) : new Date()
  const dateStr = now.toISOString().split('T')[0] // YYYY-MM-DD
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-') // HH-MM-SS
  
  if (originalName) {
    // Remove extension and add timestamp
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
    return `${nameWithoutExt}_transcript_${dateStr}_${timeStr}.txt`
  }
  
  return `transcript_${dateStr}_${timeStr}.txt`
}

export function formatTranscriptionForDownload(
  text: string,
  metadata: {
    fileName?: string
    duration?: number
    wordCount?: number
    language?: string
    timestamp?: string
  }
): string {
  const { fileName, duration, wordCount, language, timestamp } = metadata
  
  let content = ''
  
  // Add header with metadata
  content += '='.repeat(50) + '\n'
  content += 'AUDIO TRANSCRIPTION\n'
  content += '='.repeat(50) + '\n\n'
  
  if (fileName) {
    content += `File: ${fileName}\n`
  }
  
  if (duration) {
    const mins = Math.floor(duration / 60)
    const secs = Math.floor(duration % 60)
    content += `Duration: ${mins}:${secs.toString().padStart(2, '0')}\n`
  }
  
  if (wordCount) {
    content += `Word Count: ${wordCount.toLocaleString()}\n`
  }
  
  if (language) {
    content += `Language: ${language.toUpperCase()}\n`
  }
  
  if (timestamp) {
    content += `Transcribed: ${new Date(timestamp).toLocaleString()}\n`
  }
  
  content += '\n' + '='.repeat(50) + '\n'
  content += 'TRANSCRIPTION\n'
  content += '='.repeat(50) + '\n\n'
  
  // Add the actual transcription text
  content += text
  
  content += '\n\n' + '='.repeat(50) + '\n'
  content += 'End of Transcription\n'
  content += '='.repeat(50) + '\n'
  
  return content
}
