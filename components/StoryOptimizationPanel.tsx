'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { TrendingUp, AlertCircle, CheckCircle, Loader2, Sparkles, XCircle } from 'lucide-react';

export default function StoryOptimizationPanel() {
  const { storyAnalysis, isAnalyzing, analyzeStory, currentProject } = useStore();
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setError(null);
    try {
      await analyzeStory();
    } catch (error: any) {
      console.error('Analysis failed:', error);
      setError(error.message || 'Failed to analyze story. Please try again.');
    }
  };

  if (!currentProject || currentProject.scenes.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Add scenes to your project to analyze the story</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Story Optimization
        </h3>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Analyze Story
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Analysis Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {storyAnalysis && (
        <div className="space-y-4">
          {/* Pacing Score */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Pacing Score</span>
              <span className="text-2xl font-bold text-purple-600">{storyAnalysis.pacingScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${storyAnalysis.pacingScore}%` }}
              />
            </div>
          </div>

          {/* Flow Optimization */}
          {storyAnalysis.flowOptimization.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                Flow Optimization
              </h4>
              <ul className="space-y-2">
                {storyAnalysis.flowOptimization.map((suggestion, idx) => (
                  <li key={idx} className="text-sm text-gray-700 pl-4 border-l-2 border-blue-400">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {storyAnalysis.suggestions.length > 0 && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold mb-2">Suggestions</h4>
              <ul className="space-y-2">
                {storyAnalysis.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Industry Benchmark */}
          {storyAnalysis.industryBenchmark && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-2">Industry Benchmark</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Genre:</span>
                  <span className="ml-2 font-medium">{storyAnalysis.industryBenchmark.genre}</span>
                </div>
                <div>
                  <span className="text-gray-600">Avg Pacing:</span>
                  <span className="ml-2 font-medium">{storyAnalysis.industryBenchmark.averagePacing}s/scene</span>
                </div>
                <div>
                  <span className="text-gray-600">Ideal Scenes:</span>
                  <span className="ml-2 font-medium">
                    {storyAnalysis.industryBenchmark.idealSceneCount.min}-{storyAnalysis.industryBenchmark.idealSceneCount.max}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Your Scenes:</span>
                  <span className="ml-2 font-medium">{currentProject.scenes.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* Dead Time Detection */}
          {storyAnalysis.deadTimeDetection && storyAnalysis.deadTimeDetection.length > 0 && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Dead Time Detection
              </h4>
              <ul className="space-y-2">
                {storyAnalysis.deadTimeDetection.map((issue, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    <strong>Scene {idx + 1}:</strong> {issue.reason} ({issue.duration}s)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
