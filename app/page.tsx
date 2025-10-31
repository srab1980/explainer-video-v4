'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Sparkles, Download, Bot, X, MousePointer, Users, BarChart3 } from 'lucide-react';
import ScriptInput from '@/components/ScriptInput';
import SceneTimeline from '@/components/SceneTimeline';
import PreviewCanvas from '@/components/PreviewCanvas';
import SceneEditor from '@/components/SceneEditor';
import AutoSaveIndicator from '@/components/AutoSaveIndicator';
import StoryOptimizationPanel from '@/components/StoryOptimizationPanel';
import SmartTransitionsPanel from '@/components/SmartTransitionsPanel';
import AISuggestionsPanel from '@/components/AISuggestionsPanel';
import LanguageSelector from '@/components/LanguageSelector';
import VideoExportPanel from '@/components/VideoExportPanel';
import AudioProductionPanel from '@/components/AudioProductionPanel';
import TemplateSelector from '@/components/TemplateSelector';
import BrandManager from '@/components/BrandManager';
import InteractiveElementsEditor from '@/components/InteractiveElementsEditor';
import ABTestingDashboard from '@/components/ABTestingDashboard';
import CollaborationPanel from '@/components/CollaborationPanel';
import DistributionManager from '@/components/DistributionManager';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

type AITab = 'optimization' | 'transitions' | 'suggestions' | 'language';
type VideoTab = 'export' | 'audio' | 'templates' | 'brand';
type InteractiveTab = 'elements' | 'abtesting';
type CollabTab = 'team' | 'comments' | 'approvals';
type DistributionTab = 'publish' | 'analytics';

export default function Home() {
  const {
    currentProject,
    createProject,
    loadFromLocalStorage,
    selectedSceneId,
    isGenerating,
  } = useStore();

  const [isClient, setIsClient] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [activeAITab, setActiveAITab] = useState<AITab>('optimization');
  const [showVideoPanel, setShowVideoPanel] = useState(false);
  const [activeVideoTab, setActiveVideoTab] = useState<VideoTab>('export');
  const [showInteractivePanel, setShowInteractivePanel] = useState(false);
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<InteractiveTab>('elements');
  const [showCollabPanel, setShowCollabPanel] = useState(false);
  const [showDistributionPanel, setShowDistributionPanel] = useState(false);
  const [activeDistributionTab, setActiveDistributionTab] = useState<DistributionTab>('publish');

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
                <>
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-all"
                    onClick={() => {
                      setShowAIPanel(!showAIPanel);
                      setShowVideoPanel(false);
                      setShowInteractivePanel(false);
                      setShowCollabPanel(false);
                      setShowDistributionPanel(false);
                    }}
                  >
                    <Bot className="w-4 h-4" />
                    Enhanced AI
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:opacity-90 transition-all"
                    onClick={() => {
                      setShowVideoPanel(!showVideoPanel);
                      setShowAIPanel(false);
                      setShowInteractivePanel(false);
                      setShowCollabPanel(false);
                      setShowDistributionPanel(false);
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Video Production
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-all"
                    onClick={() => {
                      setShowInteractivePanel(!showInteractivePanel);
                      setShowAIPanel(false);
                      setShowVideoPanel(false);
                      setShowCollabPanel(false);
                      setShowDistributionPanel(false);
                    }}
                  >
                    <MousePointer className="w-4 h-4" />
                    Interactive
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:opacity-90 transition-all"
                    onClick={() => {
                      setShowCollabPanel(!showCollabPanel);
                      setShowAIPanel(false);
                      setShowVideoPanel(false);
                      setShowInteractivePanel(false);
                      setShowDistributionPanel(false);
                    }}
                  >
                    <Users className="w-4 h-4" />
                    Collaboration
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all"
                    onClick={() => {
                      setShowDistributionPanel(!showDistributionPanel);
                      setShowAIPanel(false);
                      setShowVideoPanel(false);
                      setShowInteractivePanel(false);
                      setShowCollabPanel(false);
                    }}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Distribution
                  </button>
                </>
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
                Paste your script below or use voice input to create a professional storyboard in seconds
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

      {/* Video Production Panel */}
      {showVideoPanel && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-40 overflow-hidden flex flex-col border-l border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Download className="w-6 h-6 text-blue-600" />
              Video Production
            </h2>
            <button
              onClick={() => setShowVideoPanel(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Tab Navigation */}
          <div className="grid grid-cols-4 border-b border-gray-200">
            <button
              onClick={() => setActiveVideoTab('export')}
              className={`px-2 py-3 text-xs font-medium transition-colors ${
                activeVideoTab === 'export'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Export
            </button>
            <button
              onClick={() => setActiveVideoTab('audio')}
              className={`px-2 py-3 text-xs font-medium transition-colors ${
                activeVideoTab === 'audio'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Audio
            </button>
            <button
              onClick={() => setActiveVideoTab('templates')}
              className={`px-2 py-3 text-xs font-medium transition-colors ${
                activeVideoTab === 'templates'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveVideoTab('brand')}
              className={`px-2 py-3 text-xs font-medium transition-colors ${
                activeVideoTab === 'brand'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Brand
            </button>
          </div>

          {/* Video Panel Content */}
          <div className="flex-1 overflow-hidden">
            {activeVideoTab === 'export' && <VideoExportPanel />}
            {activeVideoTab === 'audio' && <AudioProductionPanel />}
            {activeVideoTab === 'templates' && <TemplateSelector />}
            {activeVideoTab === 'brand' && <BrandManager />}
          </div>
        </div>
      )}

      {/* Enhanced AI Control Panel */}
      {showAIPanel && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-40 overflow-hidden flex flex-col border-l border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Bot className="w-6 h-6 text-purple-600" />
              Enhanced AI Suite
            </h2>
            <button
              onClick={() => setShowAIPanel(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Tab Navigation */}
          <div className="grid grid-cols-4 border-b border-gray-200">
            <button
              onClick={() => setActiveAITab('optimization')}
              className={`px-2 py-3 text-xs font-medium transition-colors ${
                activeAITab === 'optimization'
                  ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Story
            </button>
            <button
              onClick={() => setActiveAITab('transitions')}
              className={`px-2 py-3 text-xs font-medium transition-colors ${
                activeAITab === 'transitions'
                  ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Transitions
            </button>
            <button
              onClick={() => setActiveAITab('suggestions')}
              className={`px-2 py-3 text-xs font-medium transition-colors ${
                activeAITab === 'suggestions'
                  ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Suggestions
            </button>
            <button
              onClick={() => setActiveAITab('language')}
              className={`px-2 py-3 text-xs font-medium transition-colors ${
                activeAITab === 'language'
                  ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Language
            </button>
          </div>

          {/* AI Panel Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeAITab === 'optimization' && <StoryOptimizationPanel />}
            {activeAITab === 'transitions' && <SmartTransitionsPanel />}
            {activeAITab === 'suggestions' && <AISuggestionsPanel />}
            {activeAITab === 'language' && <LanguageSelector />}
          </div>
        </div>
      )}

      {/* Interactive Elements Panel */}
      {showInteractivePanel && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-40 overflow-hidden flex flex-col border-l border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-pink-50">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <MousePointer className="w-6 h-6 text-orange-600" />
              Interactive Elements
            </h2>
            <button
              onClick={() => setShowInteractivePanel(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Tab Navigation */}
          <div className="grid grid-cols-2 border-b border-gray-200">
            <button
              onClick={() => setActiveInteractiveTab('elements')}
              className={`px-2 py-3 text-xs font-medium transition-colors ${
                activeInteractiveTab === 'elements'
                  ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Hotspots & CTAs
            </button>
            <button
              onClick={() => setActiveInteractiveTab('abtesting')}
              className={`px-2 py-3 text-xs font-medium transition-colors ${
                activeInteractiveTab === 'abtesting'
                  ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              A/B Testing
            </button>
          </div>

          {/* Interactive Panel Content */}
          <div className="flex-1 overflow-hidden">
            {activeInteractiveTab === 'elements' && <InteractiveElementsEditor />}
            {activeInteractiveTab === 'abtesting' && <ABTestingDashboard />}
          </div>
        </div>
      )}

      {/* Collaboration Panel */}
      {showCollabPanel && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-40 overflow-hidden flex flex-col border-l border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-teal-600" />
              Collaboration
            </h2>
            <button
              onClick={() => setShowCollabPanel(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Collaboration Panel Content */}
          <div className="flex-1 overflow-hidden">
            <CollaborationPanel />
          </div>
        </div>
      )}

      {/* Distribution & Analytics Panel */}
      {showDistributionPanel && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-40 overflow-hidden flex flex-col border-l border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              Distribution & Analytics
            </h2>
            <button
              onClick={() => setShowDistributionPanel(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Distribution Tab Navigation */}
          <div className="grid grid-cols-2 border-b border-gray-200">
            <button
              onClick={() => setActiveDistributionTab('publish')}
              className={`px-2 py-3 text-xs font-medium transition-colors ${
                activeDistributionTab === 'publish'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Publishing
            </button>
            <button
              onClick={() => setActiveDistributionTab('analytics')}
              className={`px-2 py-3 text-xs font-medium transition-colors ${
                activeDistributionTab === 'analytics'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Analytics
            </button>
          </div>

          {/* Distribution Panel Content */}
          <div className="flex-1 overflow-hidden">
            {activeDistributionTab === 'publish' && <DistributionManager />}
            {activeDistributionTab === 'analytics' && <AnalyticsDashboard />}
          </div>
        </div>
      )}

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
