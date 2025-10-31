'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Upload, Globe, CheckCircle, XCircle, Clock, Loader, Share2, Image, FileText } from 'lucide-react';
import type { DistributionPlatform, SupportedLanguage } from '@/lib/types';

export default function DistributionManager() {
  const {
    currentProject,
    platformConnections,
    distributionJobs,
    seoMetadata,
    connectPlatform,
    disconnectPlatform,
    distributeVideo,
    updateSEOMetadata,
    generateThumbnails,
    generateCaptions,
  } = useStore();

  const [selectedPlatforms, setSelectedPlatforms] = useState<DistributionPlatform[]>([]);
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'platforms' | 'seo' | 'jobs'>('platforms');

  const availablePlatforms: { platform: DistributionPlatform; name: string; color: string }[] = [
    { platform: 'youtube', name: 'YouTube', color: 'red' },
    { platform: 'vimeo', name: 'Vimeo', color: 'blue' },
    { platform: 'linkedin', name: 'LinkedIn', color: 'blue' },
    { platform: 'facebook', name: 'Facebook', color: 'blue' },
    { platform: 'instagram', name: 'Instagram', color: 'pink' },
    { platform: 'twitter', name: 'Twitter', color: 'blue' },
    { platform: 'tiktok', name: 'TikTok', color: 'gray' },
  ];

  const handleDistribute = async () => {
    if (selectedPlatforms.length === 0) return;
    
    const metadata = seoMetadata || {
      title: currentProject?.name || '',
      description: '',
      tags: [],
    };

    const jobId = await distributeVideo(selectedPlatforms, metadata);
    setSelectedPlatforms([]);
  };

  const [seoForm, setSeoForm] = useState({
    title: seoMetadata?.title || currentProject?.name || '',
    description: seoMetadata?.description || '',
    tags: seoMetadata?.tags?.join(', ') || '',
    keywords: seoMetadata?.keywords?.primary?.join(', ') || '',
  });

  const handleUpdateSEO = () => {
    updateSEOMetadata({
      title: seoForm.title,
      description: seoForm.description,
      tags: seoForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      keywords: {
        primary: seoForm.keywords.split(',').map(k => k.trim()).filter(Boolean),
        secondary: [],
      },
    });
  };

  const togglePlatform = (platform: DistributionPlatform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const isConnected = (platform: DistributionPlatform) => {
    return platformConnections.some(c => c.platform === platform && c.isConnected);
  };

  if (!currentProject) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Globe className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p>No project selected</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Distribution & Marketing</h2>
        <p className="text-sm text-gray-600">Publish your video across multiple platforms</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('platforms')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'platforms'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Platforms
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'seo'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          SEO & Metadata
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'jobs'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Distribution Jobs ({distributionJobs.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Platforms Tab */}
        {activeTab === 'platforms' && (
          <div className="space-y-6">
            {/* Platform Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Select Platforms to Publish</h3>
              <div className="grid grid-cols-2 gap-3">
                {availablePlatforms.map(({ platform, name, color }) => {
                  const connected = isConnected(platform);
                  const selected = selectedPlatforms.includes(platform);
                  return (
                    <button
                      key={platform}
                      onClick={() => connected && togglePlatform(platform)}
                      disabled={!connected}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        selected
                          ? 'border-blue-500 bg-blue-50'
                          : connected
                          ? 'border-gray-300 hover:border-gray-400'
                          : 'border-gray-200 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{name}</span>
                        {connected ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">
                        {connected ? 'Connected' : 'Not connected'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Distribute Button */}
            {selectedPlatforms.length > 0 && (
              <button
                onClick={handleDistribute}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Distribute to {selectedPlatforms.length} Platform{selectedPlatforms.length > 1 ? 's' : ''}
              </button>
            )}

            {/* Connected Platforms */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Connected Platforms</h3>
              {platformConnections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Globe className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="mb-4">No platforms connected yet</p>
                  <button
                    onClick={() => setShowConnectForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Connect Platform
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {platformConnections.map((connection) => (
                    <div
                      key={connection.id}
                      className="p-4 border border-gray-200 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900 capitalize">{connection.platform}</h4>
                        <p className="text-sm text-gray-600">{connection.accountName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Connected {new Date(connection.connectedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => disconnectPlatform(connection.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Disconnect
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">SEO Metadata</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={seoForm.title}
                    onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Engaging video title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={seoForm.description}
                    onChange={(e) => setSeoForm({ ...seoForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Describe your video..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={seoForm.tags}
                    onChange={(e) => setSeoForm({ ...seoForm, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={seoForm.keywords}
                    onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <button
                  onClick={handleUpdateSEO}
                  className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Update Metadata
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Thumbnails</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {seoMetadata?.thumbnails?.map((thumb) => (
                  <div
                    key={thumb.id}
                    className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-300"
                  >
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                ))}
              </div>
              <button
                onClick={() => generateThumbnails(4)}
                className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Generate Thumbnails
              </button>
            </div>

            {/* Captions */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Captions & Subtitles</h3>
              {seoMetadata?.captions && seoMetadata.captions.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {seoMetadata.captions.map((caption, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{caption.language.toUpperCase()}</span>
                        {caption.isAutoGenerated && (
                          <span className="text-xs text-gray-500">(Auto-generated)</span>
                        )}
                      </div>
                      <a
                        href={caption.url}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                        download
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-4">No captions generated yet</p>
              )}
              <button
                onClick={() => generateCaptions('en')}
                className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Generate Captions (English)
              </button>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {distributionJobs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Upload className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No distribution jobs yet</p>
              </div>
            ) : (
              distributionJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Distribution Job</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(job.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.overallStatus === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : job.overallStatus === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {job.overallStatus}
                    </span>
                  </div>

                  {/* Platforms */}
                  <div className="space-y-2">
                    {job.platforms.map((platform, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {platform.platform}
                          </span>
                          {platform.status === 'uploading' && (
                            <Loader className="w-4 h-4 text-blue-500 animate-spin" />
                          )}
                          {platform.status === 'published' && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {platform.status === 'failed' && (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <span className="text-sm text-gray-600">{platform.progress}%</span>
                      </div>
                    ))}
                  </div>

                  {job.publishedAt && (
                    <p className="text-xs text-gray-500 mt-3">
                      Published {new Date(job.publishedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
