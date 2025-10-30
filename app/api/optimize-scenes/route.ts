import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { scenes, targetDuration = 60 } = await request.json();

    if (!scenes || !Array.isArray(scenes)) {
      return NextResponse.json(
        { error: 'Scenes array is required' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert video editor. Optimize these storyboard scenes for better pacing and timing.

Current scenes:
${scenes.map((s: any, i: number) => `Scene ${i + 1}: "${s.title}" - ${s.duration}s - ${s.description}`).join('\n')}

Target total duration: ~${targetDuration}s

Provide optimized timing recommendations. Consider:
- Scenes that are too long or too short
- Natural pacing rhythm (vary durations)
- Story beats and emphasis
- Scenes that could be merged or split

Return JSON with:
{
  "changes": [
    {
      "sceneId": "scene_id",
      "type": "merge" | "split" | "adjust_timing",
      "reason": "explanation",
      "before": previous_duration,
      "after": new_duration
    }
  ]
}

Return ONLY valid JSON.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional video editor. Respond only with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    let result;

    try {
      result = JSON.parse(responseText);
    } catch (e) {
      result = { changes: [] };
    }

    // Apply the changes to create optimized scenes
    const optimizedScenes = scenes.map((scene: any) => {
      const change = result.changes?.find((c: any) => c.sceneId === scene.id);
      if (change && change.type === 'adjust_timing') {
        return { ...scene, duration: change.after };
      }
      return scene;
    });

    return NextResponse.json({
      optimizedScenes,
      changes: result.changes || [],
    });
  } catch (error: any) {
    console.error('Scene optimization error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to optimize scenes' },
      { status: 500 }
    );
  }
}
