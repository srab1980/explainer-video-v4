'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { MousePointer, Plus, Trash2, Settings, Eye } from 'lucide-react';
import type { InteractiveHotspot, AnimatedCTA, HotspotType, HotspotAction, CTAStyle } from '@/lib/types';

export default function InteractiveElementsEditor() {
  const { 
    selectedSceneId, 
    hotspots, 
    ctas,
    addHotspot,
    updateHotspot,
    deleteHotspot,
    addCTA,
    updateCTA,
    deleteCTA,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'hotspots' | 'ctas'>('hotspots');
  const [showHotspotForm, setShowHotspotForm] = useState(false);
  const [showCTAForm, setShowCTAForm] = useState(false);
  
  const sceneHotspots = selectedSceneId ? (hotspots.get(selectedSceneId) || []) : [];
  const sceneCTAs = selectedSceneId ? (ctas.get(selectedSceneId) || []) : [];

  const [hotspotForm, setHotspotForm] = useState<Partial<InteractiveHotspot>>({
    type: 'button',
    action: 'open-url',
    position: { x: 50, y: 50 },
    size: { width: 120, height: 40 },
    shape: 'rectangle',
    backgroundColor: '#3B82F6',
    textColor: '#FFFFFF',
    opacity: 100,
    pulseAnimation: true,
    label: 'Click Me',
    actionData: {},
    appearTime: 0,
  });

  const [ctaForm, setCTAForm] = useState<Partial<AnimatedCTA>>({
    style: 'button',
    headline: 'Ready to Get Started?',
    buttonText: 'Sign Up Now',
    theme: {
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF',
      buttonColor: '#10B981',
      buttonTextColor: '#FFFFFF',
    },
    entranceAnimation: 'fade',
    exitAnimation: 'fade',
    timing: {
      appearTime: 2,
      duration: 5,
    },
    action: {
      type: 'url',
    },
  });

  const handleAddHotspot = () => {
    if (!selectedSceneId) return;
    
    addHotspot(selectedSceneId, hotspotForm as any);
    setShowHotspotForm(false);
    // Reset form
    setHotspotForm({
      type: 'button',
      action: 'open-url',
      position: { x: 50, y: 50 },
      size: { width: 120, height: 40 },
      shape: 'rectangle',
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF',
      opacity: 100,
      pulseAnimation: true,
      label: 'Click Me',
      actionData: {},
      appearTime: 0,
    });
  };

  const handleAddCTA = () => {
    if (!selectedSceneId) return;
    
    addCTA(selectedSceneId, ctaForm as any);
    setShowCTAForm(false);
  };

  if (!selectedSceneId) {
    return (
      <div className="p-6 text-center text-gray-500">
        <MousePointer className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p>Select a scene to add interactive elements</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Interactive Elements</h2>
        <p className="text-sm text-gray-600">Add clickable hotspots and CTAs to your video</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('hotspots')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'hotspots'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Hotspots ({sceneHotspots.length})
        </button>
        <button
          onClick={() => setActiveTab('ctas')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'ctas'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          CTAs ({sceneCTAs.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'hotspots' && (
          <div className="space-y-4">
            {!showHotspotForm && (
              <button
                onClick={() => setShowHotspotForm(true)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <Plus className="w-5 h-5" />
                Add Hotspot
              </button>
            )}

            {showHotspotForm && (
              <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                <h3 className="font-semibold mb-4 text-gray-900">New Hotspot</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={hotspotForm.type}
                      onChange={(e) => setHotspotForm({ ...hotspotForm, type: e.target.value as HotspotType })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="button">Button</option>
                      <option value="link">Link</option>
                      <option value="info">Info</option>
                      <option value="product">Product</option>
                      <option value="cta">CTA</option>
                      <option value="social">Social</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                    <input
                      type="text"
                      value={hotspotForm.label}
                      onChange={(e) => setHotspotForm({ ...hotspotForm, label: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                    <select
                      value={hotspotForm.action}
                      onChange={(e) => setHotspotForm({ ...hotspotForm, action: e.target.value as HotspotAction })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="open-url">Open URL</option>
                      <option value="show-info">Show Info</option>
                      <option value="pause-video">Pause Video</option>
                      <option value="skip-to-scene">Skip to Scene</option>
                      <option value="show-form">Show Form</option>
                      <option value="track-event">Track Event</option>
                    </select>
                  </div>

                  {hotspotForm.action === 'open-url' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                      <input
                        type="url"
                        value={hotspotForm.actionData?.url || ''}
                        onChange={(e) => setHotspotForm({ 
                          ...hotspotForm, 
                          actionData: { ...hotspotForm.actionData, url: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
                      <input
                        type="color"
                        value={hotspotForm.backgroundColor}
                        onChange={(e) => setHotspotForm({ ...hotspotForm, backgroundColor: e.target.value })}
                        className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                      <input
                        type="color"
                        value={hotspotForm.textColor}
                        onChange={(e) => setHotspotForm({ ...hotspotForm, textColor: e.target.value })}
                        className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appear Time (seconds from scene start)
                    </label>
                    <input
                      type="number"
                      value={hotspotForm.appearTime}
                      onChange={(e) => setHotspotForm({ ...hotspotForm, appearTime: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.5"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hotspotForm.pulseAnimation}
                      onChange={(e) => setHotspotForm({ ...hotspotForm, pulseAnimation: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-700">Pulse Animation</label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleAddHotspot}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Hotspot
                    </button>
                    <button
                      onClick={() => setShowHotspotForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Existing Hotspots */}
            {sceneHotspots.map((hotspot) => (
              <div key={hotspot.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{hotspot.label}</h4>
                    <p className="text-sm text-gray-500 capitalize">{hotspot.type} - {hotspot.action}</p>
                  </div>
                  <button
                    onClick={() => deleteHotspot(selectedSceneId, hotspot.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>Clicks: {hotspot.clicks}</div>
                  <div>Impressions: {hotspot.impressions}</div>
                  <div>Appears at: {hotspot.appearTime}s</div>
                  <div>
                    <span
                      className="inline-block w-4 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: hotspot.backgroundColor }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ctas' && (
          <div className="space-y-4">
            {!showCTAForm && (
              <button
                onClick={() => setShowCTAForm(true)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-green-600"
              >
                <Plus className="w-5 h-5" />
                Add Call-to-Action
              </button>
            )}

            {showCTAForm && (
              <div className="p-4 border-2 border-green-500 rounded-lg bg-green-50">
                <h3 className="font-semibold mb-4 text-gray-900">New CTA</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                    <select
                      value={ctaForm.style}
                      onChange={(e) => setCTAForm({ ...ctaForm, style: e.target.value as CTAStyle })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="button">Button</option>
                      <option value="banner">Banner</option>
                      <option value="overlay">Overlay</option>
                      <option value="floating">Floating</option>
                      <option value="end-screen">End Screen</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                    <input
                      type="text"
                      value={ctaForm.headline}
                      onChange={(e) => setCTAForm({ ...ctaForm, headline: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subheadline</label>
                    <input
                      type="text"
                      value={ctaForm.subheadline || ''}
                      onChange={(e) => setCTAForm({ ...ctaForm, subheadline: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={ctaForm.buttonText}
                      onChange={(e) => setCTAForm({ ...ctaForm, buttonText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Action URL</label>
                    <input
                      type="url"
                      value={ctaForm.action?.url || ''}
                      onChange={(e) => setCTAForm({ 
                        ...ctaForm, 
                        action: { ...ctaForm.action!, url: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Appear Time (s)</label>
                      <input
                        type="number"
                        value={ctaForm.timing?.appearTime}
                        onChange={(e) => setCTAForm({ 
                          ...ctaForm, 
                          timing: { ...ctaForm.timing!, appearTime: parseFloat(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        min="0"
                        step="0.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (s)</label>
                      <input
                        type="number"
                        value={ctaForm.timing?.duration}
                        onChange={(e) => setCTAForm({ 
                          ...ctaForm, 
                          timing: { ...ctaForm.timing!, duration: parseFloat(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        min="1"
                        step="0.5"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleAddCTA}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add CTA
                    </button>
                    <button
                      onClick={() => setShowCTAForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Existing CTAs */}
            {sceneCTAs.map((cta) => (
              <div key={cta.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{cta.headline}</h4>
                    <p className="text-sm text-gray-500 capitalize">{cta.style} CTA</p>
                  </div>
                  <button
                    onClick={() => deleteCTA(selectedSceneId, cta.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm mb-2 text-gray-700">{cta.buttonText}</div>
                <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                  <div>Views: {cta.views}</div>
                  <div>Clicks: {cta.clicks}</div>
                  <div>CTR: {cta.conversionRate.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
