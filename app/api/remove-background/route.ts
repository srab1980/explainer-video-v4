import { NextResponse } from 'next/server';
import { RemoveBackgroundRequest, RemoveBackgroundResponse, BackgroundRemovalMethod } from '@/lib/types';
import sharp from 'sharp';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const body: RemoveBackgroundRequest = await req.json();
    const { imageUrl, method, config } = body;

    if (!imageUrl || !method) {
      return NextResponse.json(
        { error: 'Missing required fields: imageUrl and method' },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    let transparentImageBuffer: Buffer;

    // Download the original image
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data);

    // Process based on method
    switch (method) {
      case 'color-based':
        transparentImageBuffer = await removeColorBackground(imageBuffer, config);
        break;
      
      case 'edge-based':
        transparentImageBuffer = await removeEdgeBasedBackground(imageBuffer, config);
        break;
      
      case 'ai-based':
        transparentImageBuffer = await removeAIBackground(imageBuffer, config);
        break;
      
      case 'manual':
        transparentImageBuffer = await applyManualMask(imageBuffer, config);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Unsupported background removal method' },
          { status: 400 }
        );
    }

    // Apply post-processing if needed
    if (config?.smoothEdges || config?.featherAmount) {
      transparentImageBuffer = await applyEdgeProcessing(
        transparentImageBuffer, 
        config.featherAmount || 0
      );
    }

    // Convert to data URI
    const transparentImageUrl = `data:image/png;base64,${transparentImageBuffer.toString('base64')}`;
    const processingTime = Date.now() - startTime;

    const response: RemoveBackgroundResponse = {
      transparentImageUrl,
      originalImageUrl: imageUrl,
      method,
      processingTime
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error removing background:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to remove background' },
      { status: 500 }
    );
  }
}

// Color-based background removal
async function removeColorBackground(
  imageBuffer: Buffer, 
  config?: Partial<any>
): Promise<Buffer> {
  const targetColor = config?.targetColor || '#FFFFFF';
  const tolerance = config?.tolerance || 30;

  // Convert hex to RGB
  const rgb = hexToRgb(targetColor);
  if (!rgb) {
    throw new Error('Invalid target color');
  }

  // Use sharp to process the image
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  
  // Get raw pixel data
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Process pixels
  const pixelArray = new Uint8ClampedArray(data);
  const channels = info.channels;

  for (let i = 0; i < pixelArray.length; i += channels) {
    const r = pixelArray[i];
    const g = pixelArray[i + 1];
    const b = pixelArray[i + 2];

    // Calculate color difference
    const diff = Math.sqrt(
      Math.pow(r - rgb.r, 2) +
      Math.pow(g - rgb.g, 2) +
      Math.pow(b - rgb.b, 2)
    );

    // If color is close to target, make it transparent
    if (diff < tolerance) {
      pixelArray[i + 3] = 0; // Set alpha to 0
    }
  }

  // Convert back to PNG
  return sharp(Buffer.from(pixelArray), {
    raw: {
      width: info.width,
      height: info.height,
      channels: channels
    }
  })
    .png()
    .toBuffer();
}

// Edge-based background removal (simplified implementation)
async function removeEdgeBasedBackground(
  imageBuffer: Buffer,
  config?: Partial<any>
): Promise<Buffer> {
  const threshold = config?.edgeThreshold || 50;

  // Use sharp's threshold and edge detection
  return sharp(imageBuffer)
    .ensureAlpha()
    .threshold(threshold)
    .png()
    .toBuffer();
}

// AI-based background removal (using vision model approach)
async function removeAIBackground(
  imageBuffer: Buffer,
  config?: Partial<any>
): Promise<Buffer> {
  // For production, this would use a dedicated background removal API
  // like Remove.bg, ClipDrop, or a custom ML model
  // For now, we'll use an advanced color-based approach with edge detection
  
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  
  // Get raw pixel data
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelArray = new Uint8ClampedArray(data);
  const channels = info.channels;
  const width = info.width;
  const height = info.height;

  // Simple AI-like approach: detect edges and preserve foreground
  // This is a simplified version - production would use actual ML models
  
  // Calculate average brightness at edges (likely background)
  const edgeColors = [];
  const edgeWidth = Math.floor(width * 0.1); // 10% edge
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < edgeWidth; x++) {
      const i = (y * width + x) * channels;
      edgeColors.push({ r: pixelArray[i], g: pixelArray[i + 1], b: pixelArray[i + 2] });
    }
    for (let x = width - edgeWidth; x < width; x++) {
      const i = (y * width + x) * channels;
      edgeColors.push({ r: pixelArray[i], g: pixelArray[i + 1], b: pixelArray[i + 2] });
    }
  }

  // Calculate average edge color (likely background)
  const avgColor = {
    r: edgeColors.reduce((sum, c) => sum + c.r, 0) / edgeColors.length,
    g: edgeColors.reduce((sum, c) => sum + c.g, 0) / edgeColors.length,
    b: edgeColors.reduce((sum, c) => sum + c.b, 0) / edgeColors.length
  };

  // Remove pixels similar to edge colors
  const tolerance = 40;
  for (let i = 0; i < pixelArray.length; i += channels) {
    const r = pixelArray[i];
    const g = pixelArray[i + 1];
    const b = pixelArray[i + 2];

    const diff = Math.sqrt(
      Math.pow(r - avgColor.r, 2) +
      Math.pow(g - avgColor.g, 2) +
      Math.pow(b - avgColor.b, 2)
    );

    if (diff < tolerance) {
      pixelArray[i + 3] = 0;
    }
  }

  return sharp(Buffer.from(pixelArray), {
    raw: {
      width: width,
      height: height,
      channels: channels
    }
  })
    .png()
    .toBuffer();
}

// Apply manual mask
async function applyManualMask(
  imageBuffer: Buffer,
  config?: Partial<any>
): Promise<Buffer> {
  if (!config?.maskPath) {
    throw new Error('Manual mask requires maskPath');
  }

  // This would apply a user-provided mask
  // For now, return the original image with alpha channel
  return sharp(imageBuffer)
    .ensureAlpha()
    .png()
    .toBuffer();
}

// Apply edge smoothing and feathering
async function applyEdgeProcessing(
  imageBuffer: Buffer,
  featherAmount: number
): Promise<Buffer> {
  if (featherAmount === 0) {
    return imageBuffer;
  }

  // Apply slight blur to soften edges
  return sharp(imageBuffer)
    .blur(Math.max(0.3, Math.min(featherAmount / 10, 2)))
    .png()
    .toBuffer();
}

// Helper: Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
