# 🎤 Audio Transcription App

A modern, full-featured audio transcription application built with Next.js, featuring multiple input methods and AI-powered transcription.

## ✨ Features

- **🆓 Free Voice Recognition** - Uses browser's built-in Web Speech API
- **🎤 Audio Recording** - Record audio directly in the browser
- **📁 File Upload** - Upload audio files (MP3, WAV, M4A, etc.)
- **🤖 AI Transcription** - Powered by OpenAI Whisper API
- **📱 Responsive Design** - Works on desktop and mobile
- **💾 Download & Copy** - Save transcriptions as text files
- **🌐 Real-time Results** - See transcription as you speak

## 🚀 Live Demo

[Deploy your own instance](#deployment) or try the features locally.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI Whisper API
- **Database**: Supabase (optional)
- **Authentication**: Clerk (optional)
- **Notifications**: Sonner

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/audio-transcription-app.git
cd audio-transcription-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Add your API keys to `.env.local`**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add environment variables**
4. **Deploy!**

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🎯 Usage

### Free Voice Recognition
- Click "🆓 Free Voice" tab
- Allow microphone permission
- Click "Start Recording"
- Speak clearly
- Click "Stop Recording"
- View transcribed text

### Audio Recording
- Click "🎤 Record Audio" tab
- Record audio using MediaRecorder API
- Automatically transcribe with OpenAI

### File Upload
- Click "📁 Upload File" tab
- Drag & drop or select audio file
- Supports MP3, WAV, M4A, MP4, WebM, OGG
- Max file size: 25MB

## 🔧 Configuration

### OpenAI API Setup
1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to environment variables
3. Add credits to your account

### Supabase Setup (Optional)
1. Create project at [Supabase](https://supabase.com)
2. Run the SQL schema from `database/schema.sql`
3. Add credentials to environment variables

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Safari
- ⚠️ Firefox (limited Web Speech API support)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenAI for the Whisper API
- Next.js team for the amazing framework
- Tailwind CSS for the styling system
- Web Speech API for free voice recognition

---

**Built with ❤️ for easy audio transcription**