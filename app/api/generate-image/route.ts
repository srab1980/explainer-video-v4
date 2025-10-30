import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Style-specific prompt modifiers
const STYLE_MODIFIERS = {
  'modern-flat': 'in a modern flat design style, minimalist, clean geometric shapes, bold colors, simple forms, vector art style, 2D, no gradients, professional',
  'hand-drawn': 'in a hand-drawn sketch style, artistic, organic lines, pen and ink illustration, slightly rough edges, creative, whimsical, artisanal feel',
  'corporate': 'in a professional corporate style, polished, business-appropriate, clean and sophisticated, premium quality, trustworthy aesthetic, modern business illustration',
  'custom': '', // Will be replaced with custom description
};

export async function POST(request: NextRequest) {
  try {
    const { prompt, style, customStyleDescription, size = '1024x1024', quality = 'standard' } = await request.json();

    if (!prompt || !style) {
      return NextResponse.json(
        { error: 'Prompt and style are required' },
        { status: 400 }
      );
    }

    // Construct the full prompt with style modifier
    let styleModifier = STYLE_MODIFIERS[style as keyof typeof STYLE_MODIFIERS] || '';
    
    if (style === 'custom' && customStyleDescription) {
      styleModifier = customStyleDescription;
    }

    const fullPrompt = `${prompt}, ${styleModifier}. High quality, detailed, centered composition, clean background, suitable for storyboard illustration.`;

    console.log('Generating DALL-E image with prompt:', fullPrompt);

    // Generate image with DALL-E
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: fullPrompt,
      n: 1,
      size: size as '1024x1024' | '1792x1024' | '1024x1792',
      quality: quality as 'standard' | 'hd',
      response_format: 'url',
    });

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error('No image URL in response');
    }

    console.log('Image generated successfully:', imageUrl);

    return NextResponse.json({
      imageUrl,
      prompt: fullPrompt,
      originalPrompt: prompt,
      style,
    });
  } catch (error: any) {
    console.error('Error generating image:', error);
    
    // Handle specific OpenAI errors
    if (error.code === 'content_policy_violation') {
      return NextResponse.json(
        { error: 'Content policy violation. Please try a different prompt.' },
        { status: 400 }
      );
    }
    
    if (error.code === 'rate_limit_exceeded') {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
