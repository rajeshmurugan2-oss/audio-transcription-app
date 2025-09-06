# Database Setup Instructions

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `video-gen-app` (or your preferred name)
   - Database Password: Create a strong password
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (usually 2-3 minutes)

## 2. Get Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - Project URL (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - Anon public key (starts with `eyJ...`)

## 3. Set Environment Variables

1. Create a `.env.local` file in your project root
2. Add the following variables:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## 4. Run Database Schema

1. In your Supabase dashboard, go to SQL Editor
2. Copy the contents of `schema.sql` file
3. Paste and run the SQL commands
4. This will create:
   - `transcriptions` table
   - Proper indexes
   - Row Level Security (RLS) policies
   - Automatic timestamp updates

## 5. Verify Setup

1. Go to Table Editor in Supabase
2. You should see the `transcriptions` table
3. Check that RLS is enabled
4. Verify the policies are in place

## 6. Test Database Connection

1. Start your Next.js development server
2. Check the browser console for any connection errors
3. The app should now be able to connect to Supabase

## Database Schema Overview

The `transcriptions` table stores:
- **Basic Info**: ID, user ID, file details
- **Audio Metadata**: Duration, word count, language
- **Transcription**: Full text and status
- **Timestamps**: Created and updated dates
- **Error Handling**: Error messages for failed transcriptions

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Authentication Required**: All operations require user authentication
- **Input Validation**: Database constraints ensure data integrity
- **Audit Trail**: Automatic timestamp updates for all changes

## Next Steps

After database setup is complete, you can:
1. Set up authentication (if needed)
2. Create the file upload components
3. Implement the OpenAI Whisper API integration
4. Build the transcription display interface
