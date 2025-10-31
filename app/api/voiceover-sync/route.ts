import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Scene } from '@/lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

interface VoiceoverSyncRequest {
  scenes: Scene[];
  voice: string;
  speed: number;
  language?: string;
}

interface SceneVoiceover {
  sceneId: string;
  audioUrl: string;
  duration: number;
  text: string;
}

export async function POST(request: NextRequest) {
  try {
    const { scenes, voice, speed, language }: VoiceoverSyncRequest = await request.json();

    if (!scenes || scenes.length === 0) {
      return NextResponse.json(
        { error: 'Scenes array is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Generate voiceover data

    // Generate voiceover for each scene
    const voiceovers: SceneVoiceover[] = [];
    const errors: Array<{ sceneId: string; error: string }> = [];

    for (const scene of scenes) {
      try {
        // Skip if no voiceover text
        if (!scene.voiceover || scene.voiceover.trim().length === 0) {
          // Skip scenes without voiceover text
          continue;
        }

        // Generate voiceover for scene

        // Generate voiceover using OpenAI TTS
        const response = await openai.audio.speech.create({
          model: 'tts-1-hd', // Use HD model for better quality
          voice: (voice as any) || 'alloy',
          input: scene.voiceover,
          speed: speed || 1.0,
        });

        // Convert response to buffer
        const buffer = Buffer.from(await response.arrayBuffer());
        
        // Convert to base64 data URL
        const base64Audio = buffer.toString('base64');
        const audioUrl = `data:audio/mp3;base64,${base64Audio}`;

        // Calculate approximate duration
        // Note: This is a rough estimate. In production, you'd decode the MP3 to get exact duration
        const wordCount = scene.voiceover.split(' ').length;
        const estimatedDuration = (wordCount / 150) * 60 / (speed || 1.0);

        // Adjust scene duration if voiceover is longer
        const adjustedDuration = Math.max(scene.duration, estimatedDuration + 0.5); // Add 0.5s buffer

        voiceovers.push({
          sceneId: scene.id,
          audioUrl,
          duration: adjustedDuration,
          text: scene.voiceover,
        });

        // Voiceover generated successfully

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 50));

      } catch (error: any) {
        // Error generating voiceover - continue with next scene
        errors.push({
          sceneId: scene.id,
          error: error.message || 'Failed to generate voiceover',
        });
      }
    }

    // Return results
    return NextResponse.json({
      voiceovers,
      errors: errors.length > 0 ? errors : undefined,
      totalScenes: scenes.length,
      successCount: voiceovers.length,
      failureCount: errors.length,
      totalDuration: voiceovers.reduce((sum, v) => sum + v.duration, 0),
    });

  } catch (error: any) {
    // Voiceover sync error occurred
    
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
        error: error.message || 'Failed to generate voiceovers',
      },
      { status: 500 }
    );
  }
}
