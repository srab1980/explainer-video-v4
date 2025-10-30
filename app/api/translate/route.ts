import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  it: 'Italian',
  pt: 'Portuguese',
};

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLanguage, targetLanguage, context = 'script' } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    const sourceLang = LANGUAGE_NAMES[sourceLanguage] || 'English';
    const targetLang = LANGUAGE_NAMES[targetLanguage] || targetLanguage;

    const prompt = `Translate this ${context} from ${sourceLang} to ${targetLang}. 
Maintain the tone, style, and meaning. Consider cultural context and provide natural, idiomatic translation.

Text to translate:
${text}

Also suggest any cultural adaptations needed (idioms, references, etc).

Return JSON:
{
  "translatedText": "translation here",
  "confidence": 0.95,
  "culturalAdaptations": ["adaptation 1", "adaptation 2"]
}

Return ONLY valid JSON.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional translator. Respond only with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    let result;

    try {
      result = JSON.parse(responseText);
    } catch (e) {
      result = {
        translatedText: text,
        confidence: 0.5,
        culturalAdaptations: [],
      };
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to translate text' },
      { status: 500 }
    );
  }
}
