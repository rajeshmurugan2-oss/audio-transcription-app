import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for our transcription app
export interface Transcription {
  id: string
  user_id?: string
  file_name: string
  file_size: number
  file_type: string
  duration: number
  word_count: number
  language: string
  transcription_text: string
  status: 'processing' | 'completed' | 'failed'
  error_message?: string
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      transcriptions: {
        Row: Transcription
        Insert: Omit<Transcription, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Transcription, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
