# StoryVid Storyboard Creator

A professional browser-based AI-powered storyboard application that transforms text scripts into visual scene timelines with customizable illustrations, layouts, and animations.

## Features

- **AI Scene Generation**: Automatically break down scripts into 3-20 visual scenes using OpenAI GPT-4o-mini
- **Drag-and-Drop Timeline**: Smooth scene reordering with intuitive drag-and-drop
- **8 Layout Styles**: Choose from horizontal-row, vertical-stack, grid-2x2, grid-3x3, centered-large, side-by-side, scattered, and editorial layouts
- **4 Animation Types**: Fade, slide, zoom, and bounce animations with 60fps performance
- **2000+ Searchable Icons**: Lucide icons with fuzzy search functionality
- **Real-Time Preview**: 16:9 animated canvas with scene navigation
- **Complete Scene Editor**: 4-tab editor (Content, Layout, Animation, Illustration)
- **Auto-Save**: Automatic localStorage persistence with visual feedback
- **Mobile Responsive**: Works seamlessly on all device sizes

## Tech Stack

- **Framework**: Next.js 14+ with TypeScript and App Router
- **UI**: React 18+, Tailwind CSS with OKLCH colors
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide Icons
- **Drag & Drop**: @dnd-kit
- **Search**: Fuse.js
- **AI**: OpenAI GPT-4o-mini via Vercel AI SDK

## Getting Started

### Prerequisites

- Node.js 20.9.0 or higher
- pnpm package manager

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your OPENAI_API_KEY to .env.local

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Environment Variables

```
OPENAI_API_KEY=your_openai_api_key_here
```

## Usage

1. **Create a Script**: Paste your explainer video script in the text area
2. **Generate Scenes**: Click "Generate Storyboard" to let AI create scenes
3. **Customize**: Edit each scene using the timeline and scene editor
4. **Preview**: Watch your storyboard with animations in real-time
5. **Export**: Export your completed storyboard (coming soon)

### Example Script

```
Welcome to our revolutionary new app! Have you ever struggled with organizing your daily tasks? Our app makes it simple. Just tap, drag, and done! With smart AI suggestions, you'll never miss a deadline again. Try it free for 30 days. Your productivity journey starts now.
```

## Project Structure

```
storyvid-storyboard/
├── app/
│   ├── api/
│   │   └── generate-scenes/     # AI scene generation endpoint
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main app page
│   └── globals.css               # Global styles
├── components/
│   ├── editor-tabs/              # Scene editor tab components
│   │   ├── ContentTab.tsx
│   │   ├── LayoutTab.tsx
│   │   ├── AnimationTab.tsx
│   │   └── IllustrationTab.tsx
│   ├── AutoSaveIndicator.tsx     # Save status indicator
│   ├── PreviewCanvas.tsx         # Animated preview
│   ├── SceneCard.tsx             # Timeline scene card
│   ├── SceneEditor.tsx           # Full scene editor modal
│   ├── SceneTimeline.tsx         # Drag-and-drop timeline
│   └── ScriptInput.tsx           # Script input form
├── lib/
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── layout-utils.ts           # Layout calculations
│   └── store.ts                  # Zustand state management
└── public/                       # Static assets
```

## Key Features Details

### AI Scene Generation

- Analyzes script structure and content
- Extracts 2-3 keywords per scene
- Suggests appropriate icons from library
- Recommends layouts and animations
- Calculates optimal scene duration

### Scene Editor

- **Content Tab**: Edit title, description, voiceover, duration, and colors
- **Layout Tab**: Choose from 8 predefined layout styles
- **Animation Tab**: Select transition animations
- **Illustration Tab**: Add, edit, and position icons

### Auto-Save System

- Automatic saving to localStorage
- Visual feedback with "Saving..." / "Saved" indicator
- Preserves all project data across sessions

## Performance

- AI generation: < 10 seconds
- Preview updates: < 100ms
- Smooth 60fps animations
- Optimized icon rendering

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT

## Acknowledgments

- OpenAI for GPT-4o-mini
- Lucide for the icon library
- Vercel for Next.js framework
