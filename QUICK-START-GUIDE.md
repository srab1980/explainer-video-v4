# Quick Start Guide: Transparent Backgrounds & Illustration Animations

## Overview
This guide shows you how to use the new transparent background and illustration animation features in StoryVid.

## Feature 1: Transparent Backgrounds for AI Illustrations

### When to Use
- Remove distracting backgrounds from AI-generated images
- Create clean, professional-looking illustrations
- Layer illustrations over different scene backgrounds
- Export illustrations for use in other applications

### How to Enable

**Step 1: Generate or Select an AI Illustration**
1. Click "Generate AI Illustration" button
2. Enter a prompt and select a style
3. Wait for the image to generate
4. Click on the generated illustration to select it

**Step 2: Open Animation Panel**
- The "Illustration Animations & Effects" panel appears automatically when you select an AI illustration
- Located below the basic illustration editor

**Step 3: Configure Transparent Background**
1. Click the "Transparent Background" tab
2. Toggle "Enable Transparent Background" to ON
3. Choose a removal method:
   - **AI-Based** (Recommended): Best for complex backgrounds
   - **Color-Based**: Best for solid white or colored backgrounds
   - **Edge-Based**: Best for simple images with clear edges

**Step 4: Fine-Tune Settings**

For **Color-Based Method**:
- **Target Color**: Pick the background color to remove (default: white)
- **Tolerance**: Adjust how closely pixels must match (0-100)
  - Lower = strict matching
  - Higher = more pixels removed

For **Edge-Based Method**:
- **Edge Threshold**: Sensitivity of edge detection (0-100)

For **AI-Based Method**:
- **AI Model**: Standard (fast) or High Quality (accurate)
- **Preserve Details**: Keep fine details like hair, shadows

**Step 5: Post-Processing (Optional)**
- Enable "Smooth Edges" for cleaner edges
- Adjust "Feather Amount" (0-20 pixels) for softer transitions

### Tips
- Start with AI-Based method for best results
- Use Color-Based for simple white backgrounds (fastest)
- Increase tolerance if too much background remains
- Enable edge smoothing for professional results
- The transparent image is automatically saved and used in videos

## Feature 2: Illustration-Specific Animations

### When to Use
- Draw attention to specific illustrations
- Create engaging, dynamic scenes
- Add personality to your storyboard
- Make illustrations feel alive

### How to Add Animations

**Step 1: Select an AI Illustration**
- Click on any AI-generated illustration in your scene
- The Animation panel appears automatically

**Step 2: Add Your First Animation**
1. Click the "Animations" tab (default)
2. Click "Add Animation" button
3. Choose an animation type:

**Scale Animations**
- **Grow**: Expand from small to full size
- **Shrink**: Reduce in size
- **Pulse**: Rhythmic size changes
- **Breathe**: Gentle pulsing

**Rotation Animations**
- **Spin**: Full 360° rotation
- **Wobble**: Side-to-side rotation
- **Tilt**: Slight angular movement
- **Flip**: 180° flip

**Opacity Animations**
- **Fade In**: Gradually appear
- **Fade Out**: Gradually disappear
- **Shimmer**: Sparkling effect
- **Ghost**: Ethereal fading

**Transform Animations**
- **Slide In**: Enter from screen edge
- **Slide Out**: Exit off screen
- **Bounce**: Bouncing movement
- **Elastic**: Spring-like motion

**Continuous Animations** (Loop automatically)
- **Float**: Gentle floating motion
- **Rotate**: Continuous spinning
- **Pulse**: Ongoing pulsing

**Effect Animations**
- **Glow**: Add luminous effect
- **Shadow**: Manipulate shadows
- **Blur**: Blur transitions
- **Sharpen**: Sharpness changes

**Step 3: Configure Animation Parameters**

- **Duration**: How long the animation takes (0.1 - 10 seconds)
  - 0.5s: Quick, snappy
  - 1-2s: Normal, smooth
  - 3-5s: Slow, dramatic

- **Delay**: When to start (0 - 10 seconds)
  - 0s: Starts immediately
  - 1-2s: Staggered effect
  - Match scene timing

- **Easing**: How the animation accelerates
  - **Linear**: Constant speed
  - **Ease In**: Starts slow, ends fast
  - **Ease Out**: Starts fast, slows down
  - **Ease In-Out**: Smooth start and end
  - **Spring**: Bouncy, energetic
  - **Bounce**: Bouncing effect
  - **Elastic**: Spring-like overshoot

- **Repeat**: Animation behavior
  - **None**: Plays once
  - **Loop**: Repeats continuously
  - **Ping-Pong**: Alternates direction

- **Trigger**: When to start
  - **Auto**: Starts with scene
  - **Hover**: On mouse hover (interactive)
  - **Click**: On click (interactive)
  - **Timeline**: Based on timeline position

**Step 4: Add Animation**
- Click "Add Animation" to save
- The animation appears in the list
- Preview with the play button

### Managing Multiple Animations

**Add More Animations**
- Click "Add Animation" again
- Each illustration can have multiple animations
- Animations run simultaneously or sequentially (based on delay)

**Edit Existing Animation**
- Currently: Remove and re-add with new settings
- Coming soon: Direct editing

**Remove Animation**
- Click the trash icon next to any animation
- Confirms immediately

**Preview Animations**
- Click the play button to preview
- See the animation in the preview canvas
- Adjust parameters based on preview

### Animation Recipes (Popular Combinations)

**Attention Grabber**
```
1. Scale: Pulse (1s duration, loop, auto)
2. Effects: Glow (2s duration, loop, auto)
```

**Smooth Entrance**
```
1. Opacity: Fade In (1s duration, none, auto)
2. Transform: Slide In (1.5s duration, ease-out, auto)
```

**Playful Float**
```
1. Continuous: Float (3s duration, ping-pong, auto)
2. Rotation: Wobble (2s duration, loop, auto)
```

**Dramatic Reveal**
```
1. Scale: Grow (2s duration, elastic, auto)
2. Opacity: Fade In (1.5s duration, ease-in, auto delay: 0.5s)
```

**Persistent Attention**
```
1. Continuous: Rotate (4s duration, loop, auto)
2. Scale: Breathe (2s duration, ping-pong, auto)
```

## Tips & Best Practices

### Transparent Backgrounds
- Test different methods to find the best result
- Use higher tolerance for complex backgrounds
- Enable edge smoothing for professional quality
- Process takes 1-5 seconds depending on image size
- Transparent images work in both preview and video export

### Animations
- Less is more: 1-2 animations per illustration
- Match animation speed to scene mood
- Use continuous animations sparingly
- Stagger delays for multiple illustrations
- Preview before finalizing
- Adjust easing for natural movement

### Combining Both Features
- Remove background first, then add animations
- Transparent illustrations look better with effects
- Glow and shadow animations enhance transparency
- Test in fullscreen preview mode

## Keyboard Shortcuts

While in Animation Panel:
- **Tab**: Switch between tabs
- **Enter**: Add animation (when form is filled)
- **Esc**: Cancel/close form

## Troubleshooting

### Background Not Removing
- Try different method (AI-based usually works best)
- Increase tolerance slider
- Ensure illustration is AI-generated (not icon)
- Check image loaded correctly

### Animation Not Showing
- Verify animation was added to list
- Check duration is not too short
- Preview in fullscreen mode
- Ensure illustration is selected

### Performance Issues
- Limit to 2-3 animations per illustration
- Use shorter durations for multiple animations
- Avoid very long loop animations
- Reduce number of continuous animations

## Next Steps

1. Experiment with different animation types
2. Try combining multiple animations
3. Test transparent backgrounds with various images
4. Export your video to see the final result
5. Share your creations with the team

## Need Help?

- Check the full documentation: TRANSPARENT-ANIMATION-ENHANCEMENT.md
- Review implementation details: IMPLEMENTATION-SUMMARY.md
- Report issues or request features

---

**Have fun creating dynamic, professional storyboards with transparent backgrounds and engaging animations!**
