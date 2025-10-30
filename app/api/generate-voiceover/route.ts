import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { text, voice, speed, language } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required for voiceover generation' },
        { status: 400 }
      );
    }

    // Generate voiceover using OpenAI TTS API
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice || 'alloy',
      input: text,
      speed: speed || 1.0,
    });

    // Convert response to buffer
    const buffer = Buffer.from(await response.arrayBuffer());
    
    // In production, you would upload this to a storage service
    // For now, we'll return it as a base64 data URL
    const base64Audio = buffer.toString('base64');
    const audioUrl = `data:audio/mp3;base64,${base64Audio}`;

    // Calculate approximate duration (very rough estimate: ~150 words per minute at 1.0x speed)
    const wordCount = text.split(' ').length;
    const duration = (wordCount / 150) * 60 / (speed || 1.0);

    return NextResponse.json({
      audioUrl,
      duration,
    });
  } catch (error: any) {
    console.error('Voiceover generation error:', error);
    
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key' },
        { status: 401 }
      );
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: error.message || 'Failed to generate voiceover',
      },
      { status: 500 }
    );
  }
}
