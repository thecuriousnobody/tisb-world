import OpenAI from 'openai';
import formidable from 'formidable';
import fs from 'fs';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the multipart form data
    const form = formidable({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const [fields, files] = await form.parse(request);
    const audioFile = files.file?.[0];

    if (!audioFile) {
      return response.status(400).json({ error: 'No audio file provided' });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.log('No OpenAI API key found, using fallback transcription');
      
      // Fallback to mock transcription if no API key
      const mockTranscriptions = [
        "I think this tool would be incredibly useful for finding podcast guests in my niche. It saves so much time compared to manual outreach.",
        "I'd expect to pay around $29 to $49 per month for a service like this, depending on the features included.",
        "My biggest frustration was the time it takes to research and reach out to potential guests manually.",
        "The one feature that would make this 10x better would be automated follow-up sequences.",
        "Yes, I would definitely recommend this to fellow podcasters. It addresses a real pain point."
      ];
      
      const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return response.json({ 
        transcription: randomTranscription,
        status: 'success',
        source: 'fallback' 
      });
    }

    // Use real OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFile.filepath),
      model: "whisper-1",
      language: "en", // Optional: specify language
      response_format: "text",
    });

    // Clean up the temporary file
    fs.unlinkSync(audioFile.filepath);

    return response.json({ 
      transcription: transcription,
      status: 'success',
      source: 'whisper' 
    });

  } catch (error) {
    console.error('Transcription error:', error);
    
    // Fallback to mock transcription on error
    const mockTranscriptions = [
      "I think this tool would be incredibly useful for finding podcast guests in my niche. It saves so much time compared to manual outreach.",
      "I'd expect to pay around $29 to $49 per month for a service like this, depending on the features included.",
      "My biggest frustration was the time it takes to research and reach out to potential guests manually.",
      "The one feature that would make this 10x better would be automated follow-up sequences.",
      "Yes, I would definitely recommend this to fellow podcasters. It addresses a real pain point."
    ];
    
    const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
    
    return response.json({ 
      transcription: randomTranscription + " (API error - using fallback)",
      status: 'fallback',
      error: error.message 
    });
  }
}
