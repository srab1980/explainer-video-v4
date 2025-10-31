# Transparent Background & Illustration Animation Enhancement

## Overview
This enhancement adds two major capabilities to the StoryVid Illustration System:
1. **Transparent Background Support** - Generate PNG images with transparent backgrounds for AI-generated illustrations
2. **Illustration-Specific Animations** - Add dedicated animations to individual illustrations beyond scene-level animations

## Implementation Summary

### New Type Definitions (lib/types/index.ts)

#### Illustration Animation Types
- 33 new animation types across 6 categories:
  - **Scale**: grow, shrink, pulse, breathe
  - **Rotation**: spin, wobble, tilt, flip
  - **Opacity**: fade-in, fade-out, shimmer, ghost
  - **Transform**: slide-in, slide-out, bounce, elastic
  - **Continuous**: float, rotate, pulse
  - **Effects**: glow, shadow, blur, sharpen

#### Background Removal Methods
- **ai-based**: Use AI model to detect and remove background
- **color-based**: Remove solid color backgrounds (configurable tolerance)
- **edge-based**: Use edge detection
- **manual**: User-controlled masking

#### New Interfaces
```typescript
interface IllustrationAnimation {
  id: string;
  type: IllustrationAnimationType;
  duration: number;
  delay: number;
  easing: EasingFunction;
  repeat: RepeatMode;
  trigger: AnimationTrigger;
  // Animation-specific parameters
  scaleParams, rotationParams, opacityParams, transformParams, effectsParams
}

interface TransparentBackgroundConfig {
  enabled: boolean;
  method: BackgroundRemovalMethod;
  targetColor?: string;
  tolerance?: number;
  aiModel?: 'standard' | 'high-quality';
  smoothEdges?: boolean;
  featherAmount?: number;
}
```

### API Endpoint (/app/api/remove-background/route.ts)

**POST /api/remove-background**

Features:
- 3 background removal methods (color-based, edge-based, AI-based)
- Edge smoothing and feathering
- Configurable tolerance and thresholds
- Returns base64-encoded PNG with transparency

Example Request:
```json
{
  "imageUrl": "https://...",
  "method": "color-based",
  "config": {
    "targetColor": "#FFFFFF",
    "tolerance": 30,
    "smoothEdges": true,
    "featherAmount": 2
  }
}
```

Example Response:
```json
{
  "transparentImageUrl": "data:image/png;base64,...",
  "originalImageUrl": "https://...",
  "method": "color-based",
  "processingTime": 145
}
```

### UI Components

#### IllustrationAnimationPanel Component (components/IllustrationAnimationPanel.tsx)
- 531 lines of production-ready code
- Two-tab interface:
  - **Animations Tab**: Add, edit, and preview illustration animations
  - **Transparent Background Tab**: Configure and process transparent backgrounds

**Features:**
- Add multiple animations per illustration
- Configure duration, delay, easing, repeat mode, and trigger
- Preview animations
- Toggle transparent background on/off
- Select removal method with method-specific settings
- Post-processing controls (edge smoothing, feathering)

#### Integration in IllustrationTab
- Panel only appears for AI-generated illustrations
- Located after the Effects Panel, before Icon Library
- Seamless integration with existing illustration editor

### Store Actions (lib/store.ts)

New actions added:
```typescript
// Illustration Animation
addIllustrationAnimation(sceneId, illustrationId, animation)
updateIllustrationAnimation(sceneId, illustrationId, animationId, updates)
removeIllustrationAnimation(sceneId, illustrationId, animationId)

// Transparent Background
updateTransparentBackground(sceneId, illustrationId, config)
```

### Preview Canvas Integration (components/PreviewCanvas.tsx)

**Transparent Background Display:**
- Automatically uses transparent PNG when enabled
- Shows "PNG" badge on hover
- Maintains all existing functionality

**Updates:**
- Image source selection: `transparentImageUrl` if enabled, otherwise `imageUrl`
- Support in both normal and fullscreen views
- Badge indicators for transparent backgrounds

### Video Renderer Integration (lib/video-renderer.ts)

**Transparent PNG Support:**
- Uses transparent image URL when available
- Proper alpha channel handling
- Rotation and opacity support maintained
- Frame-by-frame rendering with transparency

**Enhanced Illustration Rendering:**
- Apply rotation transformations
- Handle layer opacity correctly
- Support for transparent PNG images
- Proper positioning and sizing

## Usage Guide

### For Users

#### 1. Enabling Transparent Backgrounds

1. Select an AI-generated illustration in the scene
2. Navigate to "Illustration Animations & Effects" panel
3. Click "Transparent Background" tab
4. Toggle "Enable Transparent Background" to ON
5. Select a removal method:
   - **AI-based**: Best for complex backgrounds (standard or high-quality)
   - **Color-based**: Best for solid color backgrounds (adjust tolerance)
   - **Edge-based**: Uses edge detection (adjust threshold)
6. Configure post-processing:
   - Enable "Smooth Edges" for anti-aliasing
   - Adjust "Feather Amount" for soft edges (0-20 pixels)

#### 2. Adding Illustration Animations

1. Select an AI-generated illustration
2. Click "Add Animation" button
3. Choose animation type from categories:
   - Scale, Rotation, Opacity, Transform, Continuous, or Effects
4. Configure parameters:
   - **Duration**: How long the animation runs (0.1-10 seconds)
   - **Delay**: When to start the animation (0-10 seconds)
   - **Easing**: Animation timing function
   - **Repeat**: none, loop, or ping-pong
   - **Trigger**: auto, hover, click, or timeline
5. Click "Add Animation"
6. Preview the animation with the play button

#### 3. Managing Multiple Animations

- Add multiple animations to a single illustration
- Each animation runs independently
- Combine different animation types for complex effects
- Remove animations individually with the trash icon

### For Developers

#### Adding New Animation Types

1. Add type to `IllustrationAnimationType` in `lib/types/index.ts`
2. Add to animation type list in `IllustrationAnimationPanel.tsx`
3. Implement animation logic in `PreviewCanvas.tsx` (if needed)
4. Add to video renderer if needed for export

#### Adding New Removal Methods

1. Create new function in `/app/api/remove-background/route.ts`
2. Add to switch statement in POST handler
3. Add method to `BackgroundRemovalMethod` type
4. Update UI in `IllustrationAnimationPanel.tsx`

## Technical Details

### Dependencies
- **sharp**: Image processing for background removal
- **axios**: HTTP client for downloading images

### Image Processing Pipeline

1. Download original image from URL
2. Convert to buffer
3. Process based on selected method:
   - Color-based: Pixel-by-pixel color matching
   - Edge-based: Threshold and edge detection
   - AI-based: Advanced algorithm detecting foreground
4. Apply post-processing (smoothing, feathering)
5. Convert to PNG with alpha channel
6. Return as base64 data URI

### Performance Considerations

- Background removal is CPU-intensive
- Processing time varies by image size and method
- AI-based method is slower but more accurate
- Results are cached (stored in `transparentImageUrl`)
- Only reprocessed when config changes

### Data Storage

**Illustration Object Extensions:**
```typescript
{
  // Existing fields...
  transparentBackground?: TransparentBackgroundConfig,
  transparentImageUrl?: string,
  illustrationAnimations?: IllustrationAnimation[],
  animationKeyframes?: AnimationKeyframe[]
}
```

## Testing Guide

### Manual Testing Checklist

1. **Transparent Background Generation**
   - [ ] Generate AI illustration
   - [ ] Enable transparent background with color-based method
   - [ ] Verify white background is removed
   - [ ] Try different tolerance values
   - [ ] Enable edge smoothing
   - [ ] Verify PNG badge appears in preview
   - [ ] Check transparent image displays correctly

2. **Illustration Animations**
   - [ ] Add scale-pulse animation
   - [ ] Verify animation parameters are saved
   - [ ] Add second animation (rotation)
   - [ ] Preview both animations
   - [ ] Remove one animation
   - [ ] Change animation parameters
   - [ ] Test different repeat modes
   - [ ] Test different triggers

3. **Video Export**
   - [ ] Create scene with transparent illustration
   - [ ] Add illustration animations
   - [ ] Export video
   - [ ] Verify transparent PNG is used in rendered video
   - [ ] Verify animations are rendered correctly

4. **Edge Cases**
   - [ ] Test with icon-based illustrations (panel should not appear)
   - [ ] Test with multiple AI illustrations
   - [ ] Test animation with very short duration
   - [ ] Test background removal with complex images
   - [ ] Test with invalid image URLs

## Future Enhancements

### Potential Improvements

1. **Advanced Background Removal**
   - Integration with Remove.bg API
   - Support for manual mask drawing
   - Batch processing multiple illustrations
   - Background replacement (not just removal)

2. **Animation Enhancements**
   - Visual timeline editor
   - Animation presets library
   - Export animations as CSS/JS
   - Synchronize animations across illustrations
   - Custom bezier curve editor for easing

3. **Performance Optimizations**
   - WebWorker for background processing
   - Progressive image loading
   - Animation caching
   - GPU acceleration for rendering

4. **UI Improvements**
   - Live preview while adjusting removal settings
   - Before/after comparison slider
   - Animation preview in preview canvas
   - Drag-and-drop keyframe editor

## Deployment Notes

### Environment Requirements
- Node.js with canvas support
- Sharp native dependencies
- FFmpeg for video rendering
- Sufficient memory for image processing

### Build Configuration
```bash
pnpm install sharp axios
pnpm build
```

### Production Considerations
- Consider using dedicated background removal service (Remove.bg, etc.)
- Implement rate limiting for API endpoint
- Add image size limits
- Cache processed images (CDN recommended)
- Monitor processing times and optimize as needed

## Support & Troubleshooting

### Common Issues

**Background removal not working:**
- Check image URL is accessible
- Verify sharp is properly installed
- Try different removal method
- Increase tolerance/threshold values

**Animations not showing:**
- Verify illustration is AI-generated type
- Check animation panel is visible
- Ensure animations are saved to store
- Check browser console for errors

**Video export issues with transparent images:**
- Verify transparent image URL exists
- Check FFmpeg supports PNG with alpha
- Ensure canvas properly handles alpha channel

### Debug Mode
Enable console logging in components:
```typescript
console.log('Animation added:', animation);
console.log('Transparent BG config:', config);
```

## License & Credits

This enhancement is part of the StoryVid Storyboard Creator project.

**Technologies Used:**
- Sharp (image processing)
- Framer Motion (animations)
- React (UI components)
- TypeScript (type safety)
- Canvas API (video rendering)
