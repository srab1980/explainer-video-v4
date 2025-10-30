import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { script, scenes, genre = 'general' } = await request.json();

    if (!script || !scenes) {
      return NextResponse.json(
        { error: 'Script and scenes are required' },
        { status: 400 }
      );
    }

    // Analyze story using GPT-4
    const prompt = `You are an expert story analyst and film director. Analyze this storyboard script and scenes.

Script: ${script}

Scenes: ${scenes.map((s: any, i: number) => `Scene ${i + 1}: "${s.title}" (${s.duration}s) - ${s.description}`).join('\n')}

Genre: ${genre}

Provide a comprehensive analysis in JSON format with:
1. pacingScore (0-100): Overall pacing quality
2. flowOptimization: Array of specific suggestions to improve story flow
3. characterConsistency: Array of character analysis with consistency scores
4. industryBenchmark: Standard metrics for this genre (averagePacing, averageDuration, idealSceneCount)
5. suggestions: Array of actionable improvements
6. deadTimeDetection: Scenes that are too slow or have dead time

Return ONLY valid JSON, no markdown formatting.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional story analyst. Respond only with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const analysisText = completion.choices[0]?.message?.content || '{}';
    let analysis;

    try {
      analysis = JSON.parse(analysisText);
    } catch (e) {
      // If parsing fails, create a basic analysis
      analysis = {
        pacingScore: 75,
        flowOptimization: ['Consider varying scene durations for better rhythm', 'Add transition cues between major story beats'],
        characterConsistency: [],
        industryBenchmark: {
          averagePacing: 3.5,
          averageDuration: 60,
          idealSceneCount: { min: 5, max: 15 },
          genre: genre,
        },
        suggestions: ['Review scene transitions', 'Ensure visual variety between scenes'],
        deadTimeDetection: [],
      };
    }

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error('Story analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze story' },
      { status: 500 }
    );
  }
}
