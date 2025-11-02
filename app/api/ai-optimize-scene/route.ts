import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { Scene } from '@/lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { scene }: { scene: Scene } = await request.json();

    if (!scene) {
      return NextResponse.json({ error: 'Scene data is required' }, { status: 400 });
    }

    // Analyze scene using GPT-4
    const prompt = `Analyze this storyboard scene and provide detailed improvement suggestions:

Title: ${scene.title}
Description: ${scene.description}
Voiceover: ${scene.voiceover}
Duration: ${scene.duration}s
Layout: ${scene.layoutType}
Animation: ${scene.animationType}
Illustrations: ${scene.illustrations?.length || 0} elements

Provide analysis in the following JSON format:
{
  "overallScore": <0-100>,
  "visualScore": <0-100>,
  "contentScore": <0-100>,
  "timingScore": <0-100>,
  "suggestions": [
    {
      "category": "visual|content|timing|animation",
      "priority": "high|medium|low",
      "issue": "description of the issue",
      "suggestion": "how to improve it",
      "impact": "expected improvement"
    }
  ],
  "strengths": ["list", "of", "strengths"],
  "improvementAreas": ["list", "of", "areas", "to", "improve"],
  "recommendedDuration": <number in seconds>,
  "recommendedLayout": "layout type",
  "recommendedAnimation": "animation type"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert storyboard and video production consultant. Analyze scenes and provide actionable improvements.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json({
      success: true,
      analysis,
      sceneId: scene.id,
    });
  } catch (error) {
    console.error('AI scene optimization error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze scene',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
