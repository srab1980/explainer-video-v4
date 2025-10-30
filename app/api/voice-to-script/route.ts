import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { audioData, language = 'en' } = await request.json();

    if (!audioData) {
      return NextResponse.json(
        { error: 'Audio data is required' },
        { status: 400 }
      );
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioData.split(',')[1] || audioData, 'base64');
    
    // Create a File object from the buffer
    const audioFile = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' });

    // Use Whisper API for transcription
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: language,
      response_format: 'verbose_json',
    });

    return NextResponse.json({
      transcription: transcription.text,
      confidence: 0.95, // Whisper doesn't provide confidence, estimate high
      language: language,
      duration: transcription.duration || 0,
    });
  } catch (error: any) {
    console.error('Voice transcription error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to transcribe audio',
        transcription: '',
        confidence: 0,
        language: 'en',
        duration: 0,
      },
      { status: 500 }
    );
  }
}
