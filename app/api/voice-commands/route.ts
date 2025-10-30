import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { transcription } = await request.json();

    if (!transcription) {
      return NextResponse.json(
        { error: 'Transcription is required' },
        { status: 400 }
      );
    }

    const text = transcription.toLowerCase().trim();
    let command: string | null = null;

    // Voice command detection
    if (text.includes('next scene') || text.includes('next slide')) {
      command = 'next_scene';
    } else if (text.includes('previous scene') || text.includes('previous slide') || text.includes('go back')) {
      command = 'previous_scene';
    } else if (text.includes('add scene') || text.includes('new scene') || text.includes('create scene')) {
      command = 'add_scene';
    } else if (text.includes('delete scene') || text.includes('remove scene')) {
      command = 'delete_scene';
    } else if (text.includes('play') || text.includes('start')) {
      command = 'play';
    } else if (text.includes('pause') || text.includes('stop')) {
      command = 'pause';
    }

    return NextResponse.json({
      command,
      timestamp: Date.now(),
      executed: false,
    });
  } catch (error: any) {
    console.error('Voice command error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process voice command' },
      { status: 500 }
    );
  }
}
