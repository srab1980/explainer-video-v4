'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { BarChart3, TrendingUp, Users, Eye, MousePointerClick, Trophy } from 'lucide-react';
import type { ABTest, VideoVariant } from '@/lib/types';

export default function ABTestingDashboard() {
  const {
    currentProject,
    currentABTest,
    createABTest,
    updateABTest,
    addTestVariant,
  } = useStore();

  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateTest = () => {
    if (!currentProject) return;

    const controlVariant: VideoVariant = {
      id: '',
      projectId: currentProject.id,
      name: 'Control (Original)',
      description: 'Original version of the video',
      changes: [],
      status: 'active',
      trafficAllocation: 50,
      metrics: {
        views: 0,
        completionRate: 0,
        avgWatchTime: 0,
        clickThroughRate: 0,
        conversions: 0,
        engagement: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    createABTest({
      projectId: currentProject.id,
      name: 'New A/B Test',
      description: 'Test different video variations to optimize performance',
      controlVariant,
      testVariants: [],
      status: 'draft',
      goal: {
        type: 'completion',
        target: 75,
      },
    });

    setShowCreateForm(false);
  };

  const calculateWinner = (test: ABTest) => {
    const allVariants = [test.controlVariant, ...test.testVariants];
    const sorted = [...allVariants].sort((a, b) => {
      if (test.goal.type === 'completion') {
        return b.metrics.completionRate - a.metrics.completionRate;
      } else if (test.goal.type === 'clicks') {
        return b.metrics.clickThroughRate - a.metrics.clickThroughRate;
      } else if (test.goal.type === 'engagement') {
        return b.metrics.engagement - a.metrics.engagement;
      }
      return b.metrics.views - a.metrics.views;
    });
    return sorted[0];
  };

  if (!currentProject) {
    return (
      <div className="p-6 text-center text-gray-500">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p>No project selected</p>
      </div>
    );
  }

  if (!currentABTest) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-blue-600 opacity-20" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">A/B Testing</h2>
        <p className="text-gray-600 mb-6">
          Test different variations of your video to find what works best
        </p>
        <button
          onClick={handleCreateTest}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all font-medium"
        >
          Create Your First A/B Test
        </button>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Optimize Performance</h3>
            <p className="text-sm text-gray-600">Test different elements to increase engagement</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Data-Driven Decisions</h3>
            <p className="text-sm text-gray-600">Make choices based on real viewer data</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Find Winners</h3>
            <p className="text-sm text-gray-600">Discover which version performs best</p>
          </div>
        </div>
      </div>
    );
  }

  const winner = currentABTest.status === 'completed' ? calculateWinner(currentABTest) : null;
  const allVariants = [currentABTest.controlVariant, ...currentABTest.testVariants];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentABTest.name}</h2>
            <p className="text-sm text-gray-600">{currentABTest.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentABTest.status === 'running'
                  ? 'bg-green-100 text-green-700'
                  : currentABTest.status === 'completed'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {currentABTest.status.charAt(0).toUpperCase() + currentABTest.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Goal */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Test Goal</p>
              <p className="font-semibold text-gray-900 capitalize">
                {currentABTest.goal.type.replace('-', ' ')}: {currentABTest.goal.target}%
              </p>
            </div>
            {currentABTest.status === 'running' && (
              <button
                onClick={() => updateABTest(currentABTest.id, { status: 'completed' })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Complete Test
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Winner Banner */}
      {winner && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-300 rounded-lg">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <div>
              <h3 className="font-bold text-gray-900">Winner: {winner.name}</h3>
              <p className="text-sm text-gray-700">
                This variant performed best with {winner.metrics.completionRate.toFixed(1)}% completion rate
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Variants Comparison */}
      <div className="space-y-4 mb-6">
        {allVariants.map((variant) => {
          const isWinner = winner && winner.id === variant.id;
          return (
            <div
              key={variant.id}
              className={`p-4 border-2 rounded-lg transition-all ${
                isWinner
                  ? 'border-yellow-400 bg-yellow-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{variant.name}</h3>
                    {isWinner && (
                      <Trophy className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{variant.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Traffic: {variant.trafficAllocation}%
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    variant.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {variant.status}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Eye className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Views</p>
                  <p className="text-lg font-bold text-gray-900">{variant.metrics.views}</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Completion</p>
                  <p className="text-lg font-bold text-gray-900">
                    {variant.metrics.completionRate.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <MousePointerClick className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">CTR</p>
                  <p className="text-lg font-bold text-gray-900">
                    {variant.metrics.clickThroughRate.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Engagement Score</span>
                  <span>{variant.metrics.engagement.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${variant.metrics.engagement}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            const newVariant: Omit<VideoVariant, 'id' | 'metrics' | 'createdAt' | 'updatedAt'> = {
              projectId: currentProject.id,
              name: `Variant ${currentABTest.testVariants.length + 1}`,
              description: 'New test variant',
              changes: [],
              status: 'draft',
              trafficAllocation: 25,
            };
            addTestVariant(currentABTest.id, newVariant);
          }}
          className="flex-1 px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all"
        >
          Add New Variant
        </button>
        {currentABTest.status === 'draft' && (
          <button
            onClick={() => updateABTest(currentABTest.id, { status: 'running', startDate: new Date() })}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all"
          >
            Start Test
          </button>
        )}
      </div>

      {/* Test Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-600 mb-1">Total Views</p>
          <p className="text-xl font-bold text-gray-900">
            {allVariants.reduce((sum, v) => sum + v.metrics.views, 0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Avg Completion</p>
          <p className="text-xl font-bold text-gray-900">
            {(
              allVariants.reduce((sum, v) => sum + v.metrics.completionRate, 0) /
              allVariants.length
            ).toFixed(1)}
            %
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Avg CTR</p>
          <p className="text-xl font-bold text-gray-900">
            {(
              allVariants.reduce((sum, v) => sum + v.metrics.clickThroughRate, 0) /
              allVariants.length
            ).toFixed(1)}
            %
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Total Conversions</p>
          <p className="text-xl font-bold text-gray-900">
            {allVariants.reduce((sum, v) => sum + v.metrics.conversions, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
