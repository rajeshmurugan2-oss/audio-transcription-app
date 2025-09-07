import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'API is working - debugging version',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })
}

export async function POST() {
  return NextResponse.json({
    message: 'POST endpoint is working',
    timestamp: new Date().toISOString()
  })
}
