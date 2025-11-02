'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import {
  Sparkles,
  Clock,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Download,
  Copy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Scene } from '@/lib/types';

interface SceneAnalysis {
  overallScore: number;
  visualScore: number;
  contentScore: number;
  timingScore: number;
  suggestions: Array<{
    category: string;
    priority: string;
    issue: string;
    suggestion: string;
    impact: string;
  }>;
  strengths: string[];
  improvementAreas: string[];
  recommendedDuration: number;
  recommendedLayout: string;
  recommendedAnimation: string;
}

interface TimingAnalysis {
  totalRecommendedDuration: number;
  scenes: Array<{
    sceneId: string;
    currentDuration: number;
    recommendedDuration: number;
    reason: string;
    readingSpeed: number;
    visualComplexity: string;
    pacing: string;
  }>;
  pacingRecommendations: {
    intro: string;
    body: string;
    conclusion: string;
  };
  overallPacing: string;
}

interface ScriptAnalysis {
  clarityScore: number;
  engagementScore: number;
  pacingScore: number;
  overallScore: number;
  improvements: Array<{
    type: string;
    original: string;
    improved: string;
    reason: string;
  }>;
  strengthAreas: string[];
  weakAreas: string[];
  toneAnalysis: {
    currentTone: string;
    consistency: number;
    recommendedTone: string;
  };
  structureAnalysis: {
    hasHook: boolean;
    hasClearMessage: boolean;
    hasCallToAction: boolean;
    flow: string;
  };
  improvedScript: string;
  keyChanges: string[];
}

export default function AIAssistantPanel() {
  const { currentProject, selectedSceneId, updateScene, updateScript } = useStore();
  const [activeTab, setActiveTab] = useState<'scene' | 'timing' | 'script'>('scene');
  const [sceneAnalysis, setSceneAnalysis] = useState<SceneAnalysis | null>(null);
  const [timingAnalysis, setTimingAnalysis] = useState<TimingAnalysis | null>(null);
  const [scriptAnalysis, setScriptAnalysis] = useState<ScriptAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSuggestions, setExpandedSuggestions] = useState<Set<number>>(new Set());

  const selectedScene = currentProject?.scenes?.find((s) => s.id === selectedSceneId);

  const analyzeScene = async () => {
    if (!selectedScene) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-optimize-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scene: selectedScene }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze scene');
      }

      const result = await response.json();
      setSceneAnalysis(result.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeScores = async () => {
    if (!currentProject?.scenes || currentProject.scenes.length === 0) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-calculate-timing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenes: currentProject.scenes }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate timing');
      }

      const result = await response.json();
      setTimingAnalysis(result.timingAnalysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Timing calculation failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeScript = async () => {
    if (!currentProject?.script) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-improve-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: currentProject.script }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze script');
      }

      const result = await response.json();
      setScriptAnalysis(result.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Script analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySceneRecommendations = () => {
    if (!selectedScene || !sceneAnalysis) return;

    updateScene(selectedScene.id, {
      duration: sceneAnalysis.recommendedDuration,
      layoutType: sceneAnalysis.recommendedLayout as any,
      animationType: sceneAnalysis.recommendedAnimation as any,
    });

    alert('Scene recommendations applied!');
  };

  const applyTimingRecommendations = () => {
    if (!timingAnalysis || !currentProject?.scenes) return;

    timingAnalysis.scenes.forEach((sceneAnalysis) => {
      updateScene(sceneAnalysis.sceneId, {
        duration: sceneAnalysis.recommendedDuration,
      });
    });

    alert('Timing recommendations applied to all scenes!');
  };

  const applyScriptImprovements = () => {
    if (!scriptAnalysis) return;

    updateScript(scriptAnalysis.improvedScript);
    alert('Improved script applied!');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const toggleSuggestion = (index: number) => {
    const newExpanded = new Set(expandedSuggestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSuggestions(newExpanded);
  };

  if (!currentProject) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Sparkles className="mx-auto mb-3 h-12 w-12 text-gray-400" />
        <p>Create a project first to use AI assistance</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Assistant</h2>
              <p className="text-sm text-gray-600">Smart suggestions and optimizations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('scene')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'scene'
              ? 'border-b-2 border-purple-600 bg-purple-50 text-purple-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <TrendingUp className="mx-auto mb-1 h-5 w-5" />
          Scene Optimizer
        </button>
        <button
          onClick={() => setActiveTab('timing')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'timing'
              ? 'border-b-2 border-purple-600 bg-purple-50 text-purple-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Clock className="mx-auto mb-1 h-5 w-5" />
          Smart Timing
        </button>
        <button
          onClick={() => setActiveTab('script')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'script'
              ? 'border-b-2 border-purple-600 bg-purple-50 text-purple-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FileText className="mx-auto mb-1 h-5 w-5" />
          Script Improver
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Scene Optimizer Tab */}
        {activeTab === 'scene' && (
          <div className="space-y-6">
            {!selectedScene ? (
              <div className="py-12 text-center text-gray-500">
                <AlertCircle className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                <p>Select a scene to analyze</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Analyzing: {selectedScene.title}</h3>
                    <p className="text-sm text-gray-500">Get AI-powered scene improvements</p>
                  </div>
                  <button
                    onClick={analyzeScene}
                    disabled={isAnalyzing}
                    className="flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        <span>Analyze Scene</span>
                      </>
                    )}
                  </button>
                </div>

                {sceneAnalysis && (
                  <>
                    {/* Score Cards */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="rounded-lg border border-gray-200 p-4 text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(sceneAnalysis.overallScore)}`}>
                          {sceneAnalysis.overallScore}
                        </div>
                        <div className="text-sm text-gray-600">Overall</div>
                      </div>
                      <div className="rounded-lg border border-gray-200 p-4 text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(sceneAnalysis.visualScore)}`}>
                          {sceneAnalysis.visualScore}
                        </div>
                        <div className="text-sm text-gray-600">Visual</div>
                      </div>
                      <div className="rounded-lg border border-gray-200 p-4 text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(sceneAnalysis.contentScore)}`}>
                          {sceneAnalysis.contentScore}
                        </div>
                        <div className="text-sm text-gray-600">Content</div>
                      </div>
                      <div className="rounded-lg border border-gray-200 p-4 text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(sceneAnalysis.timingScore)}`}>
                          {sceneAnalysis.timingScore}
                        </div>
                        <div className="text-sm text-gray-600">Timing</div>
                      </div>
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                        <h4 className="mb-2 flex items-center space-x-2 font-medium text-green-800">
                          <CheckCircle className="h-5 w-5" />
                          <span>Strengths</span>
                        </h4>
                        <ul className="space-y-1 text-sm text-green-700">
                          {sceneAnalysis.strengths.map((strength, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span>•</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                        <h4 className="mb-2 flex items-center space-x-2 font-medium text-yellow-800">
                          <AlertCircle className="h-5 w-5" />
                          <span>Improvement Areas</span>
                        </h4>
                        <ul className="space-y-1 text-sm text-yellow-700">
                          {sceneAnalysis.improvementAreas.map((area, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span>•</span>
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div>
                      <h4 className="mb-3 font-medium">Recommendations</h4>
                      <div className="space-y-3">
                        {sceneAnalysis.suggestions.map((suggestion, index) => (
                          <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
                            <div
                              className="flex cursor-pointer items-start justify-between"
                              onClick={() => toggleSuggestion(index)}
                            >
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <span
                                    className={`rounded px-2 py-1 text-xs font-medium ${getPriorityColor(
                                      suggestion.priority
                                    )}`}
                                  >
                                    {suggestion.priority}
                                  </span>
                                  <span className="text-xs uppercase text-gray-500">{suggestion.category}</span>
                                </div>
                                <h5 className="mt-2 font-medium">{suggestion.issue}</h5>
                              </div>
                              {expandedSuggestions.has(index) ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            {expandedSuggestions.has(index) && (
                              <div className="mt-3 space-y-2 border-t border-gray-200 pt-3">
                                <div>
                                  <span className="text-sm font-medium text-gray-700">Suggestion:</span>
                                  <p className="mt-1 text-sm text-gray-600">{suggestion.suggestion}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-700">Expected Impact:</span>
                                  <p className="mt-1 text-sm text-gray-600">{suggestion.impact}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                      <h4 className="mb-3 font-medium text-purple-900">Quick Apply Recommendations</h4>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-purple-700">
                          <div>Duration: {selectedScene.duration}s → {sceneAnalysis.recommendedDuration}s</div>
                          <div>Layout: {selectedScene.layoutType} → {sceneAnalysis.recommendedLayout}</div>
                          <div>Animation: {selectedScene.animationType} → {sceneAnalysis.recommendedAnimation}</div>
                        </div>
                        <button
                          onClick={applySceneRecommendations}
                          className="rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
                        >
                          Apply All
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* Smart Timing Tab */}
        {activeTab === 'timing' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Smart Timing Calculator</h3>
                <p className="text-sm text-gray-500">Optimize scene durations based on content density</p>
              </div>
              <button
                onClick={analyzeScores}
                disabled={isAnalyzing}
                className="flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-5 w-5" />
                    <span>Calculate Timing</span>
                  </>
                )}
              </button>
            </div>

            {timingAnalysis && (
              <>
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-purple-900">Total Duration</h4>
                      <p className="text-2xl font-bold text-purple-600">
                        {currentProject.scenes?.reduce((sum, s) => sum + (s.duration || 5), 0)}s →{' '}
                        {timingAnalysis.totalRecommendedDuration}s
                      </p>
                    </div>
                    <button
                      onClick={applyTimingRecommendations}
                      className="rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
                    >
                      Apply All Timings
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {timingAnalysis.scenes.map((scene, index) => (
                    <div key={scene.sceneId} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Scene {index + 1}</h5>
                        <div className="text-sm">
                          <span className="text-gray-600">{scene.currentDuration}s</span>
                          <span className="mx-2">→</span>
                          <span className="font-medium text-purple-600">{scene.recommendedDuration}s</span>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Reading Speed:</span>
                          <span className="ml-1 font-medium">{scene.readingSpeed} wpm</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Complexity:</span>
                          <span className="ml-1 font-medium capitalize">{scene.visualComplexity}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Pacing:</span>
                          <span className="ml-1 font-medium capitalize">{scene.pacing}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{scene.reason}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <h4 className="mb-3 font-medium">Pacing Recommendations</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Intro:</span>
                      <p className="text-gray-600">{timingAnalysis.pacingRecommendations.intro}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Body:</span>
                      <p className="text-gray-600">{timingAnalysis.pacingRecommendations.body}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Conclusion:</span>
                      <p className="text-gray-600">{timingAnalysis.pacingRecommendations.conclusion}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Script Improver Tab */}
        {activeTab === 'script' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Script Improver</h3>
                <p className="text-sm text-gray-500">Enhance clarity, engagement, and pacing</p>
              </div>
              <button
                onClick={analyzeScript}
                disabled={isAnalyzing}
                className="flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5" />
                    <span>Analyze Script</span>
                  </>
                )}
              </button>
            </div>

            {scriptAnalysis && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div className="rounded-lg border border-gray-200 p-4 text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(scriptAnalysis.overallScore)}`}>
                      {scriptAnalysis.overallScore}
                    </div>
                    <div className="text-sm text-gray-600">Overall</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(scriptAnalysis.clarityScore)}`}>
                      {scriptAnalysis.clarityScore}
                    </div>
                    <div className="text-sm text-gray-600">Clarity</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(scriptAnalysis.engagementScore)}`}>
                      {scriptAnalysis.engagementScore}
                    </div>
                    <div className="text-sm text-gray-600">Engagement</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(scriptAnalysis.pacingScore)}`}>
                      {scriptAnalysis.pacingScore}
                    </div>
                    <div className="text-sm text-gray-600">Pacing</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="mb-2 font-medium">Tone Analysis</h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-gray-600">Current:</span>{' '}
                        <span className="font-medium">{scriptAnalysis.toneAnalysis.currentTone}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Consistency:</span>{' '}
                        <span className={`font-medium ${getScoreColor(scriptAnalysis.toneAnalysis.consistency)}`}>
                          {scriptAnalysis.toneAnalysis.consistency}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Recommended:</span>{' '}
                        <span className="font-medium">{scriptAnalysis.toneAnalysis.recommendedTone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="mb-2 font-medium">Structure</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Hook:</span>
                        {scriptAnalysis.structureAnalysis.hasHook ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Clear Message:</span>
                        {scriptAnalysis.structureAnalysis.hasClearMessage ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Call to Action:</span>
                        {scriptAnalysis.structureAnalysis.hasCallToAction ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <h4 className="mb-3 font-medium">Key Changes</h4>
                  <ul className="space-y-2">
                    {scriptAnalysis.keyChanges.map((change, i) => (
                      <li key={i} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium">Improved Script</h4>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(scriptAnalysis.improvedScript);
                        alert('Copied to clipboard!');
                      }}
                      className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto rounded bg-gray-50 p-3 text-sm text-gray-700">
                    {scriptAnalysis.improvedScript}
                  </div>
                  <button
                    onClick={applyScriptImprovements}
                    className="mt-3 w-full rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
                  >
                    Apply Improved Script
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-start space-x-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
            <div>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
