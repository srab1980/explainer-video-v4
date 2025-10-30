'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Lightbulb, Loader2, TrendingUp, Palette, Eye, Grid, Users } from 'lucide-react';

const ICON_MAP = {
  creative: Palette,
  visual: Eye,
  accessibility: Eye,
  template: Grid,
  character: Users,
};

const IMPACT_COLORS = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-purple-100 text-purple-700',
};

export default function AISuggestionsPanel() {
  const { selectedSceneId, currentProject, aiSuggestions, generateAISuggestions } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedScene = currentProject?.scenes.find(s => s.id === selectedSceneId);
  const suggestions = selectedSceneId ? aiSuggestions.get(selectedSceneId) : undefined;

  const handleGenerate = async () => {
    if (!selectedSceneId) return;
    setIsGenerating(true);
    try {
      await generateAISuggestions(selectedSceneId);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!selectedScene) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Select a scene to get AI-powered suggestions</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          AI Suggestions
        </h3>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4" />
              Generate Suggestions
            </>
          )}
        </button>
      </div>

      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
        <p className="text-sm font-medium">Scene: {selectedScene.title}</p>
        <p className="text-xs text-gray-600 mt-1">{selectedScene.description}</p>
      </div>

      {suggestions && suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion) => {
            const Icon = ICON_MAP[suggestion.type] || Lightbulb;
            const impactColor = IMPACT_COLORS[suggestion.impact];

            return (
              <div
                key={suggestion.id}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold">{suggestion.title}</h4>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${impactColor}`}>
                    {suggestion.impact} impact
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{suggestion.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="capitalize">{suggestion.type} suggestion</span>
                  <span>Confidence: {Math.round(suggestion.confidence * 100)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!suggestions && !isGenerating && (
        <div className="p-6 text-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
          <p>Click "Generate Suggestions" to get AI-powered recommendations</p>
        </div>
      )}
    </div>
  );
}
