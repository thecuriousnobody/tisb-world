# Setting up OpenAI Whisper Transcription

## Step 1: Get OpenAI API Key

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the API key (starts with `sk-...`)

## Step 2: Add to Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

## Step 3: Deploy with Environment Variables

### For Vercel:
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add `OPENAI_API_KEY` with your API key value
5. Redeploy your project

### For Local Testing:
```bash
npm run dev
```
The app will automatically use your `.env.local` file.

## How it Works

- **With API Key**: Real Whisper transcription (costs ~$0.006 per minute)
- **Without API Key**: Falls back to mock responses for testing
- **API Error**: Gracefully falls back to mock responses

## Cost Estimation

- OpenAI Whisper: $0.006 per minute of audio
- For 5 questions × 1 minute each = ~$0.03 per user
- 100 beta users = ~$3.00 total

## Viewing Transcription Source

Check the browser console after recording:
- ✅ "Real Whisper transcription received" = Using OpenAI
- ⚠️ "Fallback transcription used" = Using mock data

## Email Setup (Optional)

To receive feedback via email, also add:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
TO_EMAIL=rajeev@theideasandbox.com
```

For Gmail, you'll need to:
1. Enable 2FA on your Google account
2. Generate an "App Password" in Google Account settings
3. Use the app password (not your regular password)
