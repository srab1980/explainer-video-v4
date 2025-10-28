'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { X, Type, Layout, Sparkles, Image as ImageIcon } from 'lucide-react';
import ContentTab from './editor-tabs/ContentTab';
import LayoutTab from './editor-tabs/LayoutTab';
import AnimationTab from './editor-tabs/AnimationTab';
import IllustrationTab from './editor-tabs/IllustrationTab';

const tabs = [
  { id: 'content', label: 'Content', icon: Type },
  { id: 'layout', label: 'Layout', icon: Layout },
  { id: 'animation', label: 'Animation', icon: Sparkles },
  { id: 'illustration', label: 'Illustration', icon: ImageIcon },
];

export default function SceneEditor() {
  const { currentProject, selectedSceneId, selectScene } = useStore();
  const [activeTab, setActiveTab] = useState('content');

  const scene = currentProject?.scenes.find((s) => s.id === selectedSceneId);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        selectScene(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectScene]);

  if (!scene) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Edit Scene</h2>
            <p className="text-sm text-gray-600 mt-1">{scene.title}</p>
          </div>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => selectScene(null)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-gray-600 hover:text-foreground'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'content' && <ContentTab scene={scene} />}
          {activeTab === 'layout' && <LayoutTab scene={scene} />}
          {activeTab === 'animation' && <AnimationTab scene={scene} />}
          {activeTab === 'illustration' && <IllustrationTab scene={scene} />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <button
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => selectScene(null)}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all"
            onClick={() => selectScene(null)}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
