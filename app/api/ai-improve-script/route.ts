import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { script }: { script: string } = await request.json();

    if (!script) {
      return NextResponse.json({ error: 'Script is required' }, { status: 400 });
    }

    const prompt = `Analyze this video script and provide comprehensive improvement suggestions:

Script:
${script}

Provide analysis in JSON format:
{
  "clarityScore": <0-100>,
  "engagementScore": <0-100>,
  "pacingScore": <0-100>,
  "overallScore": <0-100>,
  "improvements": [
    {
      "type": "clarity|engagement|pacing|tone|structure",
      "original": "original text",
      "improved": "improved text",
      "reason": "why this is better"
    }
  ],
  "strengthAreas": ["list of strong points"],
  "weakAreas": ["list of weak points"],
  "toneAnalysis": {
    "currentTone": "description",
    "consistency": <0-100>,
    "recommendedTone": "suggestion"
  },
  "structureAnalysis": {
    "hasHook": <boolean>,
    "hasClearMessage": <boolean>,
    "hasCallToAction": <boolean>,
    "flow": "description of narrative flow"
  },
  "improvedScript": "complete rewritten script with all improvements",
  "keyChanges": ["summary of major changes made"]
}

Focus on:
1. Clarity: Remove jargon, simplify complex ideas
2. Engagement: Add hooks, questions, compelling narratives
3. Pacing: Balance information density, vary sentence length
4. Tone: Ensure consistency and appropriateness for audience
5. Structure: Strong opening, clear message, compelling CTA`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert copywriter and video script consultant. Improve scripts for clarity, engagement, and impact.',
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
      originalLength: script.length,
      improvedLength: analysis.improvedScript?.length || 0,
    });
  } catch (error) {
    console.error('Script improvement error:', error);
    return NextResponse.json(
      {
        error: 'Failed to improve script',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
