import { supabase } from './supabase'
import { Transcription } from './supabase'

export class TranscriptionService {
  // Create a new transcription record
  static async create(transcription: Omit<Transcription, 'id' | 'created_at' | 'updated_at'>): Promise<Transcription | null> {
    try {
      const { data, error } = await supabase
        .from('transcriptions')
        .insert(transcription)
        .select()
        .single()

      if (error) {
        console.error('Error creating transcription:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error creating transcription:', error)
      return null
    }
  }

  // Get transcription by ID
  static async getById(id: string): Promise<Transcription | null> {
    try {
      const { data, error } = await supabase
        .from('transcriptions')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching transcription:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching transcription:', error)
      return null
    }
  }

  // Get all transcriptions for a user
  static async getByUserId(userId: string): Promise<Transcription[]> {
    try {
      const { data, error } = await supabase
        .from('transcriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user transcriptions:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching user transcriptions:', error)
      return []
    }
  }

  // Update transcription status
  static async updateStatus(id: string, status: Transcription['status'], errorMessage?: string): Promise<boolean> {
    try {
      const updateData: Partial<Transcription> = { status }
      if (errorMessage) {
        updateData.error_message = errorMessage
      }

      const { error } = await supabase
        .from('transcriptions')
        .update(updateData)
        .eq('id', id)

      if (error) {
        console.error('Error updating transcription status:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error updating transcription status:', error)
      return false
    }
  }

  // Update transcription with completed data
  static async updateCompleted(
    id: string, 
    transcriptionText: string, 
    language: string, 
    duration: number, 
    wordCount: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('transcriptions')
        .update({
          transcription_text: transcriptionText,
          language,
          duration,
          word_count: wordCount,
          status: 'completed'
        })
        .eq('id', id)

      if (error) {
        console.error('Error updating completed transcription:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error updating completed transcription:', error)
      return false
    }
  }

  // Delete transcription
  static async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('transcriptions')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting transcription:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting transcription:', error)
      return false
    }
  }

  // Get transcription statistics for a user
  static async getUserStats(userId: string): Promise<{
    total: number
    completed: number
    failed: number
    totalDuration: number
    totalWords: number
  }> {
    try {
      const { data, error } = await supabase
        .from('transcriptions')
        .select('status, duration, word_count')
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching user stats:', error)
        return { total: 0, completed: 0, failed: 0, totalDuration: 0, totalWords: 0 }
      }

      const stats = {
        total: data.length,
        completed: data.filter(t => t.status === 'completed').length,
        failed: data.filter(t => t.status === 'failed').length,
        totalDuration: data.reduce((sum, t) => sum + (t.duration || 0), 0),
        totalWords: data.reduce((sum, t) => sum + (t.word_count || 0), 0)
      }

      return stats
    } catch (error) {
      console.error('Error fetching user stats:', error)
      return { total: 0, completed: 0, failed: 0, totalDuration: 0, totalWords: 0 }
    }
  }
}
