'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { BarChart3, TrendingUp, Eye, Users, Globe, Monitor, Smartphone, Tablet } from 'lucide-react';

export default function AnalyticsDashboard() {
  const { currentProject, analyticsDashboard, fetchAnalytics } = useStore();

  useEffect(() => {
    if (currentProject) {
      fetchAnalytics();
    }
  }, [currentProject]);

  if (!currentProject) {
    return (
      <div className="p-6 text-center text-gray-500">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p>No project selected</p>
      </div>
    );
  }

  if (!analyticsDashboard) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-blue-600 opacity-30" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const { overview, platformMetrics, geography, devices, trafficSources } = analyticsDashboard;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <button
            onClick={() => fetchAnalytics()}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Last updated: {new Date(analyticsDashboard.lastUpdated).toLocaleString()}
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Total Views</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{overview.totalViews.toLocaleString()}</p>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Unique Viewers</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{overview.uniqueViewers.toLocaleString()}</p>
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Avg Watch Time</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{Math.floor(overview.avgWatchTime / 60)}m {overview.avgWatchTime % 60}s</p>
        </div>

        <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-gray-600">Completion Rate</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{overview.completionRate.toFixed(1)}%</p>
        </div>

        <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-pink-600" />
            <p className="text-sm text-gray-600">Engagement</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{overview.engagementRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Platform Performance */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Performance</h3>
        <div className="space-y-3">
          {platformMetrics.map((platform) => {
            const maxViews = Math.max(...platformMetrics.map(p => p.views));
            const percentage = (platform.views / maxViews) * 100;
            return (
              <div key={platform.platform} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 capitalize">{platform.platform}</h4>
                    <p className="text-sm text-gray-600">{platform.views.toLocaleString()} views</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Engagement: {platform.engagement}</p>
                    <p className="text-sm text-gray-600">Conversions: {platform.conversions}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Geography & Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Geography */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Top Locations</h3>
          </div>
          <div className="space-y-3">
            {geography.map((location) => (
              <div key={location.country} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{location.country}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${location.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    {location.views} ({location.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Devices */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Devices</h3>
          <div className="space-y-4">
            {devices.map((device) => {
              const Icon =
                device.type === 'desktop'
                  ? Monitor
                  : device.type === 'mobile'
                  ? Smartphone
                  : Tablet;
              return (
                <div key={device.type} className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <Icon className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {device.type}
                      </span>
                      <span className="text-sm text-gray-600">
                        {device.views} ({device.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Traffic Sources */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Traffic Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trafficSources.map((source) => (
            <div key={source.source} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">{source.source}</h4>
              <p className="text-2xl font-bold text-gray-900 mb-1">{source.views}</p>
              <p className="text-sm text-gray-600">{source.percentage.toFixed(1)}% of total</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${source.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-3">Key Insights</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>
              Your completion rate of {overview.completionRate.toFixed(1)}% is{' '}
              {overview.completionRate > 70 ? 'excellent' : 'good'} - keep engaging your audience!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Users className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>
              {geography[0]?.country} is your top market with {geography[0]?.percentage.toFixed(1)}% of
              total views
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Monitor className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <span>
              Most viewers watch on {devices[0]?.type} ({devices[0]?.percentage}%) - optimize for this
              platform
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
