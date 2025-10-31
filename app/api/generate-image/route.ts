import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import sharp from 'sharp';
import axios from 'axios';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
  console.error('OpenAI API key not configured');
  throw new Error('OpenAI API key is required for image generation');
}

// Style-specific prompt modifiers with transparent background optimization
const STYLE_MODIFIERS = {
  'modern-flat': 'in a modern flat design style, minimalist, clean geometric shapes, bold colors, simple forms, vector art style, 2D, no gradients, professional, isolated subject on white background',
  'hand-drawn': 'in a hand-drawn sketch style, artistic, organic lines, pen and ink illustration, slightly rough edges, creative, whimsical, artisanal feel, isolated subject on white background',
  'corporate': 'in a professional corporate style, polished, business-appropriate, clean and sophisticated, premium quality, trustworthy aesthetic, modern business illustration, isolated subject on white background',
  'custom': '', // Will be replaced with custom description
};

// Helper function to remove background automatically
async function removeBackgroundAuto(imageUrl: string): Promise<string | null> {
  try {
    // Download the image
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data);

    // Use sharp to process - color-based removal for white backgrounds
    const image = sharp(imageBuffer);
    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixelArray = new Uint8ClampedArray(data);
    const channels = info.channels;

    // Remove white/light backgrounds (tolerance for near-white pixels)
    const tolerance = 40;
    const targetWhite = { r: 255, g: 255, b: 255 };

    for (let i = 0; i < pixelArray.length; i += channels) {
      const r = pixelArray[i];
      const g = pixelArray[i + 1];
      const b = pixelArray[i + 2];

      // Calculate difference from white
      const diff = Math.sqrt(
        Math.pow(r - targetWhite.r, 2) +
        Math.pow(g - targetWhite.g, 2) +
        Math.pow(b - targetWhite.b, 2)
      );

      // If pixel is close to white, make it transparent
      if (diff < tolerance) {
        pixelArray[i + 3] = 0; // Set alpha to 0
      }
    }

    // Convert back to PNG with alpha
    const transparentBuffer = await sharp(Buffer.from(pixelArray), {
      raw: {
        width: info.width,
        height: info.height,
        channels: channels
      }
    })
      .png()
      .toBuffer();

    // Return as base64 data URI
    const base64 = transparentBuffer.toString('base64');
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error('Error removing background:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, style, customStyleDescription, size = '1024x1024', quality = 'standard', autoTransparent = true } = await request.json();

    if (!prompt || !style) {
      return NextResponse.json(
        { error: 'Prompt and style are required' },
        { status: 400 }
      );
    }

    // Construct the full prompt with style modifier
    let styleModifier = STYLE_MODIFIERS[style as keyof typeof STYLE_MODIFIERS] || '';
    
    if (style === 'custom' && customStyleDescription) {
      styleModifier = `${customStyleDescription}, isolated subject on white background`;
    }

    const fullPrompt = `${prompt}, ${styleModifier}. High quality, detailed, centered composition, clean white background for easy removal.`;

    console.log('Generating DALL-E image with prompt');

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

    // Image generated successfully

    // Automatically generate transparent version if requested
    let transparentImageUrl = null;
    if (autoTransparent) {
      // Automatically removing background
      transparentImageUrl = await removeBackgroundAuto(imageUrl);
      if (transparentImageUrl) {
        // Transparent version created successfully
      } else {
        // Background removal failed, using original
      }
    }

    return NextResponse.json({
      imageUrl,
      transparentImageUrl, // Include transparent version
      prompt: fullPrompt,
      originalPrompt: prompt,
      style,
      hasTransparent: !!transparentImageUrl,
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
