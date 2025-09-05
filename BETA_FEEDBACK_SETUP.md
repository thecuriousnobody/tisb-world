# Beta Feedback System - Complete Setup Guide

## Overview

The Beta Feedback system now includes:

1. **Voice + Text Input**: Users can record voice or type text responses
2. **Real Whisper API Integration**: Uses OpenAI's Whisper for transcription
3. **Feedback Storage**: Saves responses via API endpoint
4. **Admin Dashboard**: View all feedback responses
5. **Fallback System**: Works even if APIs fail

## URLs

- **Beta Feedback Form**: `https://yoursite.com/beta-feedback`
- **Admin Dashboard**: `https://yoursite.com/admin-feedback`

## How It Works

### 1. User Experience
1. User visits `/beta-feedback`
2. Chooses Voice or Text input mode
3. **Voice Mode**: Click record → speak → automatic transcription
4. **Text Mode**: Type response directly
5. Navigate through 5 questions
6. Submit all responses

### 2. Technical Flow
```
User Input → Frontend → API Endpoint → OpenAI Whisper → Database → Admin Dashboard
```

### 3. Voice Recording
- Asks for microphone permission
- Records up to 5 minutes per question
- Sends audio blob to `/api/transcribe`
- Falls back to sample responses if API fails

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in your project root:

```env
# OpenAI API Key (required for real transcription)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Admin password for viewing feedback
ADMIN_PASSWORD=your-secure-admin-password

# Email settings (optional - for email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
TO_EMAIL=rajeev@theideasandbox.com
FROM_EMAIL=noreply@yoursite.com
```

### 2. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create new API key
3. Add credit to your account ($5-10 minimum)
4. Copy key to `.env.local`

**Cost**: ~$0.006 per minute of audio (very cheap!)

### 3. Deploy to Vercel

```bash
# Install dependencies
npm install

# Deploy to Vercel
vercel

# Add environment variables in Vercel dashboard:
# Project Settings → Environment Variables
```

### 4. Test the System

1. Visit `/beta-feedback`
2. Try both voice and text modes
3. Complete all 5 questions
4. Check admin dashboard at `/admin-feedback`

## Accessing Feedback Data

### Option 1: Admin Dashboard
- Visit: `https://yoursite.com/admin-feedback`
- Enter admin password
- View all responses in a nice interface

### Option 2: API Endpoint
```bash
curl -H "Authorization: Bearer your-admin-password" \
  https://yoursite.com/api/admin-feedback
```

### Option 3: Database (Future)
For production, you might want to use:
- **Vercel KV** (Redis-like key-value store)
- **PlanetScale** (MySQL)
- **Supabase** (PostgreSQL)
- **Airtable** (No-code database)

## Troubleshooting

### Transcription Not Working
1. Check if `OPENAI_API_KEY` is set correctly
2. Verify OpenAI account has credit
3. Check browser console for errors
4. Fallback responses should still work

### Microphone Issues
1. Ensure HTTPS (required for microphone access)
2. Check browser permissions
3. Try different browsers (Chrome works best)

### Admin Dashboard
1. Default password is `admin123` if not set
2. Check network tab for API errors
3. Ensure `/api/admin-feedback` endpoint is deployed

## Current Features

✅ Voice recording with Whisper transcription
✅ Text input alternative  
✅ Progress tracking (5 questions)
✅ Response storage via API
✅ Admin dashboard for viewing feedback
✅ Fallback system if APIs fail
✅ Mobile-responsive design
✅ Better contrast (black text on grey)

## Future Enhancements

- Real database integration
- Email notifications when feedback is submitted
- Export feedback to CSV/Excel
- Analytics and insights
- User identification (optional)
- Follow-up question flows

## Support

If you need help setting this up:
1. Check the console for error messages
2. Verify all environment variables are set
3. Test with simple text input first
4. Contact for technical support if needed

---

**Note**: The system works with fallback responses even without OpenAI API key, but real transcription requires the API key and account credit.
