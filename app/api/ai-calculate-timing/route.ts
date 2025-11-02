import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { Scene } from '@/lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { scenes }: { scenes: Scene[] } = await request.json();

    if (!scenes || scenes.length === 0) {
      return NextResponse.json({ error: 'Scenes data is required' }, { status: 400 });
    }

    // Analyze content density and calculate optimal timing
    const scenesAnalysis = scenes.map((scene, index) => ({
      index,
      id: scene.id,
      title: scene.title,
      description: scene.description,
      voiceover: scene.voiceover,
      currentDuration: scene.duration || 5,
      wordCount: (scene.voiceover || '').split(' ').length,
      illustrationCount: scene.illustrations?.length || 0,
    }));

    const prompt = `Analyze these storyboard scenes and calculate optimal duration for each based on content density, voiceover length, and visual complexity:

${scenesAnalysis.map((s) => `
Scene ${s.index + 1}:
- Title: ${s.title}
- Voiceover words: ${s.wordCount}
- Illustrations: ${s.illustrationCount}
- Current duration: ${s.currentDuration}s
`).join('\n')}

Provide timing analysis in JSON format:
{
  "totalRecommendedDuration": <number>,
  "scenes": [
    {
      "sceneId": "id",
      "currentDuration": <number>,
      "recommendedDuration": <number>,
      "reason": "explanation for this duration",
      "readingSpeed": <words per minute>,
      "visualComplexity": "low|medium|high",
      "pacing": "fast|normal|slow"
    }
  ],
  "pacingRecommendations": {
    "intro": "pacing advice for intro scenes",
    "body": "pacing advice for body scenes",
    "conclusion": "pacing advice for conclusion scenes"
  },
  "overallPacing": "description of overall video pacing"
}

Guidelines:
- Average reading speed: 150-160 words per minute for voiceover
- Add time for visual comprehension: 1-2s per illustration
- Transitions need 0.5-1s
- Complex scenes need more time`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert video editor and timing specialist. Calculate optimal scene durations based on content density, visual complexity, and viewer comprehension needs.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    const timingAnalysis = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json({
      success: true,
      timingAnalysis,
      originalDuration: scenes.reduce((sum, s) => sum + (s.duration || 5), 0),
    });
  } catch (error) {
    console.error('Smart timing calculation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to calculate timing',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
