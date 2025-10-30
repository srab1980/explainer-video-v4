# StoryVid Enhanced AI Suite - Manual Testing Guide

## Pre-Test Setup
**Application Status**: ✅ Production build running on http://localhost:3001
**Build Status**: ✅ Successfully compiled
**API Routes**: ✅ All 7 routes functional
**Components**: ✅ All components with error handling

## Comprehensive Manual Testing Checklist

### PART 1: Initial Load & Core Features (5 minutes)
**Objective**: Verify basic application functionality

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1.1 | Open http://localhost:3001 | Page loads, "StoryVid" header visible | ⬜ |
| 1.2 | Check page title | "StoryVid - AI-Powered Storyboard Creator" | ⬜ |
| 1.3 | Verify main heading | "Transform Your Script into a Visual Storyboard" | ⬜ |
| 1.4 | Check input tabs | "Text Input" and "Voice Input" tabs visible | ⬜ |
| 1.5 | Verify placeholder | Text area shows example script | ⬜ |
| 1.6 | Check character count | Shows "0 characters" initially | ⬜ |

### PART 2: Script Input - Text Mode (10 minutes)
**Objective**: Test script generation without AI images

**Test Script**: 
```
Welcome to TaskMaster! Managing your daily tasks has never been easier. Create lists, add tasks, and track your progress effortlessly. Our AI suggests optimal scheduling based on your habits. Set reminders and never miss a deadline. Share lists with your team for better collaboration. Get started today and boost your productivity by 50%!
```

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 2.1 | Paste test script | Text appears in text area | ⬜ |
| 2.2 | Check character count | Updates to show count | ⬜ |
| 2.3 | Click "Show Advanced Options" | AI Images options appear | ⬜ |
| 2.4 | Leave AI Images unchecked | Default icon-based illustrations | ⬜ |
| 2.5 | Click "Generate Storyboard" | Loading overlay appears | ⬜ |
| 2.6 | Wait for generation (10-15s) | 5-7 scenes generated | ⬜ |
| 2.7 | Check timeline | Scenes appear in left sidebar | ⬜ |
| 2.8 | Check preview canvas | First scene displays with animations | ⬜ |
| 2.9 | Verify auto-save indicator | Shows "Saved" or timestamp | ⬜ |

**⚠ If generation fails**: Check browser console (F12) for errors. Verify OpenAI API key is valid.

### PART 3: Scene Navigation & Editor (10 minutes)
**Objective**: Test scene management and editing

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 3.1 | Click Scene 2 in timeline | Preview updates to Scene 2 | ⬜ |
| 3.2 | Click Scene 3 in timeline | Preview updates to Scene 3 | ⬜ |
| 3.3 | Click on Scene 1 card | Scene Editor modal opens | ⬜ |
| 3.4 | Check modal tabs | 4 tabs: Content, Layout, Animation, Illustration | ⬜ |
| 3.5 | Click "Content" tab | Scene title, description, voiceover shown | ⬜ |
| 3.6 | Click "Layout" tab | 10 layout options displayed | ⬜ |
| 3.7 | Click "Animation" tab | 8 animation types with previews | ⬜ |
| 3.8 | Click "Illustration" tab | Icon search or AI generator shown | ⬜ |
| 3.9 | Click X to close | Modal closes, returns to main view | ⬜ |

### PART 4: Enhanced AI - Story Optimization (15 minutes)
**Objective**: Test GPT-4 powered story analysis

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 4.1 | Click "Enhanced AI" button (header) | Right sidebar opens | ⬜ |
| 4.2 | Verify 4 tabs visible | Story, Transitions, Suggestions, Language | ⬜ |
| 4.3 | Click "Story" tab | Story Optimization panel loads | ⬜ |
| 4.4 | Click "Analyze Story" button | Button shows "Analyzing..." | ⬜ |
| 4.5 | Wait for analysis (15-20s) | Analysis completes | ⬜ |
| 4.6 | Check Pacing Score | Score 0-100 with visual bar | ⬜ |
| 4.7 | Check Flow Optimization | List of suggestions displayed | ⬜ |
| 4.8 | Check Suggestions section | Actionable recommendations shown | ⬜ |
| 4.9 | Check Industry Benchmark | Genre, avg pacing, ideal scene count | ⬜ |

**⚠ If fails**: Error message should appear in red box. Common issues: API timeout, invalid API key.

### PART 5: Enhanced AI - Smart Transitions (5 minutes)
**Objective**: Test AI transition optimization

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 5.1 | Click "Transitions" tab | Smart Transitions panel loads | ⬜ |
| 5.2 | View current transitions | List shows current animation per scene | ⬜ |
| 5.3 | Click "Optimize Transitions" | Button shows "Optimizing..." | ⬜ |
| 5.4 | Wait for optimization (10-15s) | Completes with success message | ⬜ |
| 5.5 | Check updated transitions | Scene list updates with new animations | ⬜ |
| 5.6 | Click back to main view | Verify scenes reflect new transitions | ⬜ |

### PART 6: Enhanced AI - Suggestions (10 minutes)
**Objective**: Test per-scene AI recommendations

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 6.1 | Click "Suggestions" tab | AI Suggestions panel loads | ⬜ |
| 6.2 | Click a scene in timeline | Scene details shown in panel | ⬜ |
| 6.3 | Click "Generate Suggestions" | Button shows "Generating..." | ⬜ |
| 6.4 | Wait for generation (15-20s) | 5-7 suggestion cards appear | ⬜ |
| 6.5 | Check suggestion types | Creative, Visual, Accessibility, Template | ⬜ |
| 6.6 | Check impact levels | Low, Medium, or High badges | ⬜ |
| 6.7 | Check confidence scores | Percentage shown for each | ⬜ |
| 6.8 | Click another scene | New suggestions can be generated | ⬜ |

### PART 7: Enhanced AI - Multi-Language (5 minutes)
**Objective**: Test translation system (visual check only)

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 7.1 | Click "Language" tab | Language Selector panel loads | ⬜ |
| 7.2 | Count language options | 9 languages with flags visible | ⬜ |
| 7.3 | Check current language | English has checkmark | ⬜ |
| 7.4 | Note: DON'T click other languages | Would translate entire project | ⬜ |
| 7.5 | Read the note at bottom | Translation warning displayed | ⬜ |

**⚠ Translation Test (Optional)**: If you want to test translation, create a simple test project first. Translation takes 20-30 seconds.

### PART 8: Voice Input (Browser Dependent - 10 minutes)
**Objective**: Test voice transcription (requires microphone)

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 8.1 | Go back to script input | Click "Voice Input" tab | ⬜ |
| 8.2 | Select language | Dropdown shows 9 languages | ⬜ |
| 8.3 | Click "Start Recording" | Browser asks for mic permission | ⬜ |
| 8.4 | Grant permission | Button changes to "Stop Recording" | ⬜ |
| 8.5 | Speak test script | (5-10 seconds of speech) | ⬜ |
| 8.6 | Click "Stop Recording" | Audio player appears | ⬜ |
| 8.7 | Play back audio | Verify recording worked | ⬜ |
| 8.8 | Click "Transcribe Audio" | Button shows "Transcribing..." | ⬜ |
| 8.9 | Wait for transcription (5-10s) | Text appears in green box | ⬜ |
| 8.10 | Check transcription quality | Should be 90%+ accurate | ⬜ |

**⚠ If microphone fails**: Browser may block mic access. Check browser settings or try incognito mode.

### PART 9: Error Handling Tests (10 minutes)
**Objective**: Verify graceful error handling

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 9.1 | Try empty script generation | Error: "Please enter a script first" | ⬜ |
| 9.2 | Try script < 50 characters | Error: "Script is too short" | ⬜ |
| 9.3 | Open AI panel with no scenes | Shows "Add scenes..." message | ⬜ |
| 9.4 | Try transitions with 1 scene | Shows "Add at least 2 scenes" | ⬜ |
| 9.5 | Try suggestions with no scene | Shows "Select a scene..." message | ⬜ |
| 9.6 | Close and reopen browser | Auto-save restores project | ⬜ |

### PART 10: Responsive Design (5 minutes)
**Objective**: Test mobile/tablet layouts

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 10.1 | Resize browser to 768px | Layout adapts (tablet) | ⬜ |
| 10.2 | Resize to 375px | Mobile layout active | ⬜ |
| 10.3 | Check timeline visibility | Accessible on mobile | ⬜ |
| 10.4 | Check AI panel | Adapts or scrolls | ⬜ |
| 10.5 | Return to desktop size | Layout restores | ⬜ |

## Success Criteria
- ✅ All 10 parts complete without critical errors
- ✅ AI features generate responses successfully
- ✅ Error messages display clearly for invalid inputs
- ✅ UI responds smoothly without freezing
- ✅ Auto-save works after browser refresh

## Known Limitations
1. **Voice Input**: Requires browser microphone support (Chrome/Edge recommended)
2. **AI Generation**: Depends on OpenAI API availability and quota
3. **Translation**: May take 20-30 seconds for large projects
4. **Offline Mode**: Not supported (requires API access)

## Debugging Tips
- **F12**: Open browser developer tools
- **Console Tab**: View JavaScript errors
- **Network Tab**: Check API request/response
- **Application Tab**: View localStorage (auto-save data)

## Performance Benchmarks
- Script Generation: 10-15 seconds (5-7 scenes)
- Story Analysis: 15-20 seconds
- Smart Transitions: 10-15 seconds
- AI Suggestions: 15-20 seconds per scene
- Translation: 20-30 seconds (full project)

## Test Completion
**Date**: ______________
**Tester**: ______________
**Overall Result**: ⬜ Pass | ⬜ Fail
**Issues Found**: ______________
**Notes**: ______________
