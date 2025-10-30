import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { scenes, musicBpm } = await request.json();

    if (!scenes || !Array.isArray(scenes)) {
      return NextResponse.json(
        { error: 'Scenes array is required' },
        { status: 400 }
      );
    }

    const prompt = `You are a motion graphics expert. Suggest optimal transitions between these storyboard scenes.

Scenes:
${scenes.map((s: any, i: number) => `Scene ${i + 1}: "${s.title}" - Mood: ${s.description.slice(0, 100)} - Current animation: ${s.animation}`).join('\n')}

${musicBpm ? `Music BPM: ${musicBpm}` : ''}

For each scene transition, recommend:
- Transition type (fade, slide, zoom, bounce, morph, particle, path, physics)
- Duration (in seconds)
- Reasoning for the choice
- Music sync if applicable
- Continuity score (0-100)
- Mood alignment score (0-100)

Return JSON array with transition suggestions:
[
  {
    "sceneId": "scene_id",
    "transition": {
      "type": "animation_type",
      "duration": 0.5,
      "reasoning": "explanation",
      "musicSync": true/false,
      "continuityScore": 85,
      "moodAlignment": 90
    }
  }
]

Return ONLY valid JSON array.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a motion graphics expert. Respond only with valid JSON array.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || '[]';
    let suggestions;

    try {
      suggestions = JSON.parse(responseText);
    } catch (e) {
      // Fallback: create basic suggestions
      suggestions = scenes.map((scene: any) => ({
        sceneId: scene.id,
        transition: {
          type: 'fade',
          duration: 0.5,
          reasoning: 'Smooth transition between scenes',
          musicSync: false,
          continuityScore: 75,
          moodAlignment: 75,
        },
      }));
    }

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error('Smart transitions error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate transition suggestions' },
      { status: 500 }
    );
  }
}
