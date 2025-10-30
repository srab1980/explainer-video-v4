'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Zap, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function SmartTransitionsPanel() {
  const { currentProject, applySmartTransitions } = useStore();
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    setIsApplying(true);
    setApplied(false);
    setError(null);
    try {
      await applySmartTransitions();
      setApplied(true);
      setTimeout(() => setApplied(false), 3000);
    } catch (error: any) {
      console.error('Failed to apply transitions:', error);
      setError(error.message || 'Failed to optimize transitions. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  if (!currentProject || currentProject.scenes.length < 2) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Add at least 2 scenes to optimize transitions</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Smart Transitions
        </h3>
        <button
          onClick={handleApply}
          disabled={isApplying}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            applied
              ? 'bg-green-600 text-white'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isApplying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Optimizing...
            </>
          ) : applied ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Applied!
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Optimize Transitions
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Optimization Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <p className="text-sm text-gray-700 mb-3">
          AI will analyze your scenes and apply optimal transitions based on:
        </p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">✓</span>
            <span>Mood alignment between scenes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">✓</span>
            <span>Visual continuity and flow</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">✓</span>
            <span>Content complexity</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">✓</span>
            <span>Narrative pacing</span>
          </li>
        </ul>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold mb-2">Current Transitions</h4>
        <div className="space-y-2">
          {currentProject.scenes.map((scene, idx) => (
            <div key={scene.id} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Scene {idx + 1}: {scene.title}</span>
              <span className="px-2 py-1 bg-white rounded text-purple-600 font-medium">
                {scene.animation}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
