import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { scene, projectContext = {} } = await request.json();

    if (!scene) {
      return NextResponse.json(
        { error: 'Scene is required' },
        { status: 400 }
      );
    }

    const { genre = 'general', targetAudience = 'general', purpose = 'presentation' } = projectContext;

    const prompt = `You are a creative director and UX expert. Provide AI-powered suggestions to improve this storyboard scene.

Scene: "${scene.title}"
Description: ${scene.description}
Duration: ${scene.duration}s
Current Layout: ${scene.layout}
Current Animation: ${scene.animation}
Illustrations: ${scene.illustrations?.length || 0} elements

Context:
- Genre: ${genre}
- Target Audience: ${targetAudience}
- Purpose: ${purpose}

Provide 5-7 diverse suggestions across these categories:
1. Creative alternatives (different visual approaches)
2. Visual improvements (composition, colors, effects)
3. Accessibility enhancements (clarity, readability)
4. Industry-specific templates or patterns
5. Character development (if applicable)

Return JSON array:
[
  {
    "type": "creative" | "visual" | "accessibility" | "template" | "character",
    "title": "Brief title",
    "description": "Detailed explanation",
    "implementation": { /* specific changes to make */ },
    "confidence": 0.85,
    "impact": "low" | "medium" | "high"
  }
]

Return ONLY valid JSON array.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a creative director. Respond only with valid JSON array.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || '[]';
    let suggestions;

    try {
      suggestions = JSON.parse(responseText);
      // Add IDs to suggestions
      suggestions = suggestions.map((s: any) => ({
        ...s,
        id: uuidv4(),
      }));
    } catch (e) {
      // Fallback suggestions
      suggestions = [
        {
          id: uuidv4(),
          type: 'visual',
          title: 'Enhance Visual Hierarchy',
          description: 'Use size and color contrast to create clear focal points',
          implementation: { suggestion: 'Make primary elements 50% larger' },
          confidence: 0.8,
          impact: 'medium',
        },
        {
          id: uuidv4(),
          type: 'accessibility',
          title: 'Improve Text Contrast',
          description: 'Ensure text meets WCAG AA standards for readability',
          implementation: { suggestion: 'Use high contrast colors for text' },
          confidence: 0.9,
          impact: 'high',
        },
      ];
    }

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error('AI suggestions error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate AI suggestions' },
      { status: 500 }
    );
  }
}
