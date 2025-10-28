'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Sparkles, Download } from 'lucide-react';
import ScriptInput from '@/components/ScriptInput';
import SceneTimeline from '@/components/SceneTimeline';
import PreviewCanvas from '@/components/PreviewCanvas';
import SceneEditor from '@/components/SceneEditor';
import AutoSaveIndicator from '@/components/AutoSaveIndicator';

export default function Home() {
  const {
    currentProject,
    createProject,
    loadFromLocalStorage,
    selectedSceneId,
    isGenerating,
  } = useStore();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadFromLocalStorage();
    if (!currentProject) {
      createProject('My Storyboard');
    }
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse">
          <Sparkles className="w-12 h-12 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">
                  StoryVid
                </h1>
              </div>
              {currentProject && (
                <span className="text-sm text-gray-500 ml-4">
                  {currentProject.name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <AutoSaveIndicator />
              {currentProject && currentProject.scenes.length > 0 && (
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-all"
                  onClick={() => {
                    alert('Export feature coming soon!');
                  }}
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {!currentProject?.scenes.length ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Transform Your Script into a Visual Storyboard
              </h2>
              <p className="text-lg text-gray-600">
                Paste your script below and let AI create a professional storyboard in seconds
              </p>
            </div>
            <ScriptInput />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Timeline */}
            <div className="lg:col-span-3">
              <div className="sticky top-24">
                <SceneTimeline />
              </div>
            </div>

            {/* Center - Preview */}
            <div className="lg:col-span-9">
              <PreviewCanvas />
              
              {/* Add New Scene Button */}
              <div className="mt-6 text-center">
                <button
                  className="text-primary hover:text-accent transition-colors text-sm font-medium"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  + Add more scenes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scene Editor Modal */}
      {selectedSceneId && <SceneEditor />}

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md text-center">
            <Sparkles className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              Creating Your Storyboard
            </h3>
            <p className="text-gray-600">
              AI is analyzing your script and generating scenes...
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
