import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getLayoutConfig } from '@/lib/layout-utils';
import type { IllustrationStyle } from '@/lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const AVAILABLE_ICONS = [
  // Communication & Social
  'MessageCircle', 'Heart', 'ThumbsUp', 'Share2', 'Users', 'Mail', 'Phone', 'Video',
  // Business & Work
  'Briefcase', 'TrendingUp', 'Target', 'Award', 'DollarSign', 'PieChart', 'BarChart',
  // Technology
  'Smartphone', 'Monitor', 'Laptop', 'Globe', 'Wifi', 'Database', 'Cloud', 'Cpu',
  // Actions & Navigation
  'Play', 'Pause', 'Check', 'X', 'Plus', 'Minus', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  // Objects & Items
  'Book', 'Camera', 'Music', 'Image', 'File', 'Folder', 'Package', 'ShoppingCart',
  // Nature & Science
  'Sun', 'Moon', 'Star', 'Zap', 'Lightbulb', 'Rocket', 'Atom', 'Leaf',
  // Emotions & States
  'Smile', 'Frown', 'AlertCircle', 'Info', 'HelpCircle', 'Eye', 'Lock', 'Unlock',
];

const LAYOUTS = [
  'horizontal-row',
  'vertical-stack',
  'grid-2x2',
  'centered-large',
  'side-by-side',
  'scattered',
  'editorial',
] as const;

const ANIMATIONS = ['fade', 'slide', 'zoom', 'bounce'] as const;

const COLORS = [
  '#8B5CF6', // Purple
  '#14B8A6', // Teal
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#10B981', // Green
  '#EC4899', // Pink
  '#F97316', // Orange
];

// Style-specific prompt modifiers for DALL-E
const STYLE_MODIFIERS = {
  'modern-flat': 'in a modern flat design style, minimalist, clean geometric shapes, bold colors, simple forms, vector art style, 2D, no gradients, professional',
  'hand-drawn': 'in a hand-drawn sketch style, artistic, organic lines, pen and ink illustration, slightly rough edges, creative, whimsical, artisanal feel',
  'corporate': 'in a professional corporate style, polished, business-appropriate, clean and sophisticated, premium quality, trustworthy aesthetic, modern business illustration',
  'custom': '',
};

export async function POST(request: NextRequest) {
  try {
    const { script, useAIImages = false, illustrationStyle = 'modern-flat' } = await request.json();

    if (!script || script.trim().length === 0) {
      return NextResponse.json(
        { error: 'Script is required' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert storyboard creator. Analyze the following script and break it down into 3-20 visual scenes for an explainer video.

For each scene, provide:
1. A clear, concise title (max 6 words)
2. A brief description of what's happening (1-2 sentences)
3. The voiceover text (what will be said during this scene)
4. 2-3 keywords that represent the scene's main concepts
5. Suggested duration in seconds (3-10 seconds per scene)
${useAIImages ? '6. A detailed visual description for AI image generation (what should be illustrated in this scene, 1-2 sentences)' : '6. 2-4 icon suggestions from this list: ' + AVAILABLE_ICONS.join(', ')}

Script:
${script}

Respond with a JSON array of scenes. Each scene should have this structure:
{
  "title": "Scene Title",
  "description": "Brief description",
  "voiceover": "Text to be spoken",
  "keywords": ["keyword1", "keyword2"],
  "duration": 5,
  ${useAIImages ? '"visualDescription": "Detailed description of what to illustrate"' : '"suggestedIcons": ["IconName1", "IconName2"]'}
}

Important:
- Create between 3 and 20 scenes based on script length and complexity
- Each scene should be a distinct moment or concept
- Keep voiceover natural and conversational
${useAIImages ? '- Visual descriptions should be specific and detailed for image generation' : '- Choose icons that visually represent the scene\'s concepts'}
- Total duration should be appropriate for the content (aim for 30-120 seconds total)

Respond with ONLY the JSON array, no other text.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional storyboard creator who generates clear, visual scene breakdowns. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    let scenesData;
    try {
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      scenesData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid JSON response from AI');
    }

    // Transform scenes into our format
    const scenes = await Promise.all(
      scenesData.map(async (scene: any, index: number) => {
        const layout = LAYOUTS[index % LAYOUTS.length];
        const animation = ANIMATIONS[index % ANIMATIONS.length];
        const bgColor = COLORS[index % COLORS.length];

        let illustrations = [];

        if (useAIImages && scene.visualDescription) {
          // Generate AI image for this scene
          try {
            const styleModifier = STYLE_MODIFIERS[illustrationStyle as keyof typeof STYLE_MODIFIERS] || '';
            const fullPrompt = `${scene.visualDescription}, ${styleModifier}. High quality, detailed, centered composition, clean background, suitable for storyboard illustration.`;
            
            const imageResponse = await openai.images.generate({
              model: 'dall-e-3',
              prompt: fullPrompt,
              n: 1,
              size: '1024x1024',
              quality: 'standard',
              response_format: 'url',
            });

            const imageUrl = imageResponse.data?.[0]?.url;

            if (imageUrl) {
              illustrations = [{
                type: 'ai-generated',
                imageUrl,
                imagePrompt: fullPrompt,
                style: illustrationStyle,
                position: { x: 50, y: 50 },
                size: 400,
                color: bgColor,
                rotation: 0,
                layer: {
                  zIndex: 0,
                  locked: false,
                  visible: true,
                  opacity: 100,
                },
              }];
            }
          } catch (imageError) {
            console.error('Failed to generate image for scene:', imageError);
            // Fall back to icon-based illustration
            illustrations = createIconIllustrations(scene, index, layout);
          }
        } else {
          // Use icon-based illustrations
          illustrations = createIconIllustrations(scene, index, layout);
        }

        return {
          title: scene.title || `Scene ${index + 1}`,
          description: scene.description || '',
          duration: scene.duration || 5,
          voiceover: scene.voiceover || scene.description || '',
          keywords: scene.keywords || [],
          layout,
          animation,
          illustrations,
          backgroundColor: bgColor,
          textColor: '#FFFFFF',
          defaultIllustrationStyle: illustrationStyle,
        };
      })
    );

    return NextResponse.json({ scenes });
  } catch (error: any) {
    console.error('Error generating scenes:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate scenes' },
      { status: 500 }
    );
  }
}

// Helper function to create icon-based illustrations
function createIconIllustrations(scene: any, sceneIndex: number, layout: any) {
  const iconCount = Math.min(scene.suggestedIcons?.length || 2, 4);
  const layoutConfig = getLayoutConfig(layout, iconCount);

  return (scene.suggestedIcons || [])
    .slice(0, iconCount)
    .map((iconName: string, iconIndex: number) => {
      const layoutPos = layoutConfig.positions[iconIndex] || { x: 50, y: 50, size: 80 };
      return {
        type: 'icon',
        iconName,
        iconLibrary: 'lucide' as const,
        position: { x: layoutPos.x, y: layoutPos.y },
        size: layoutPos.size,
        color: COLORS[(sceneIndex + iconIndex) % COLORS.length],
        rotation: 0,
        layer: {
          zIndex: iconIndex,
          locked: false,
          visible: true,
          opacity: 100,
        },
      };
    });
}
