## Your goal is to create a Next.js application using modern technologies to build a reliable and scalable platform for transcribing audio files using AI.

# Technologies Used:

- Next.js 15 as the framework
- TypeScript for type safety
- Tailwind CSS for styling
- Clerk for authentication
- Supabase as database
- OpenAI Whisper API for audio transcription
- Sonner for toast notifications

# Core Functionality

## 1. Database

- Supabase database
- SQL schemas
- Table relationships
- Row Level Security (RLS)
- Tables for users, transcriptions

## 2. Authentication

- Full Clerk integration
- Webhooks for user.created, user.deleted, user.updated
- Supabase integration for user data storage
- User authentication and session management
- Protected routes and middleware

## 3. File Upload System

- Audio file upload interface
- File type validation (MP3, WAV, M4A, MP4)
- File size validation (max 25MB)
- Drag and drop support
- Upload progress tracking

## 4. Audio Transcription

- OpenAI Whisper API integration
- Automatic language detection
- Duration calculation
- Word count analysis
- Real-time status updates
- Error handling and retry logic

## 5. Results Display

- Clean presentation of transcription results
- Display metadata (language, duration, word count)
- Formatted text display
- Download functionality
- Transcription history

## 6. Deploy

- Create GitHub repository and push the project
- Deploy to Vercel
- Add environment variables

# Pages

## Home Page

- Audio file upload interface
- Language selection dropdown
- Transcription results display
- Recent transcriptions history

## Library

- My transcriptions
- Search and filter functionality
- Download transcripts

## Profile Page

- User information
- Transcription statistics
- Account settings

# Documentation

## 1. Clerk Documentation

import { clerkMiddleware } from '@clerk/nextjs/server'
export default clerkMiddleware()
export const config = {
  matcher: [
    '/((?!_next|[^?]_\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest))._)',
    '/(api|trpc)(.*)',
  ],
}
## 2. OpenAI Whisper API Integration

- Example of transcribing audio:

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function transcribeAudio(audioFile: File) {
  const transcription = await openai.createTranscription(
    audioFile,
    "whisper-1",
    undefined,
    undefined,
    undefined,
    "en"
  );
  return transcription.data.text;
}
# Important Implementation Notes

## 0. Logging

- Adding server-side logging for error tracking

## 1. Project Setup

- Components in /components
- Pages in /app
- Using Next.js 14 app router
- Server components for data fetching
- Client components with 'use client'

## 2. Server API Calls

- All external API calls through server routes
- Creating API routes in app/api
- Client components work through these APIs
- Request validation

## 3. Environment Variables

- Storing sensitive information in environment variables
- Using .env for development
- Configuring variables on deployment platform
- Access only in server code

## 4. Error Handling

- Comprehensive handling on client and server
- Server logging
- Clear user messages
- Operation status tracking

## 5. Type Safety

- TypeScript interfaces for all data structures
- Avoiding any type
- Precise variable type definitions
- Input data validation

## 6. API Client Initialization

- Initialization only in server code
- Initialization validation
- Connection error handling
- Connection reuse

## 7. Data Fetching in Components

- Using React hooks
- Loading state management
- Error handling