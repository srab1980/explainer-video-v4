'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import type { IllustrationStyle } from '@/lib/types';
import { Sparkles, AlertCircle, Wand2, Image, FileText, Mic } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';

const ILLUSTRATION_STYLES: Array<{ value: IllustrationStyle; label: string; description: string }> = [
  { value: 'modern-flat', label: 'Modern Flat', description: 'Clean, minimalist, geometric' },
  { value: 'hand-drawn', label: 'Hand-Drawn', description: 'Sketch-like, artistic' },
  { value: 'corporate', label: 'Corporate', description: 'Professional, polished' },
];

type InputTab = 'text' | 'voice';

export default function ScriptInput() {
  const { currentProject, updateScript, generateScenes, isGenerating } = useStore();
  const [localScript, setLocalScript] = useState(currentProject?.script || '');
  const [error, setError] = useState('');
  const [useAIImages, setUseAIImages] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<IllustrationStyle>('modern-flat');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [activeTab, setActiveTab] = useState<InputTab>('text');

  const handleGenerate = async () => {
    if (!localScript.trim()) {
      setError('Please enter a script first');
      return;
    }

    if (localScript.trim().length < 50) {
      setError('Script is too short. Please provide at least 50 characters.');
      return;
    }

    setError('');
    updateScript(localScript);
    
    try {
      await generateScenes(localScript, {
        useAIImages,
        style: selectedStyle,
      });
    } catch (err) {
      setError('Failed to generate scenes. Please try again.');
    }
  };

  const handleVoiceTranscription = (transcription: string) => {
    setLocalScript(prev => prev ? `${prev}\n${transcription}` : transcription);
    setError('');
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-lg border border-border overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'text'
                ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-5 h-5" />
            Text Input
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'voice'
                ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Mic className="w-5 h-5" />
            Voice Input
          </button>
        </div>

        <div className="p-6">
          {/* Text Input Tab */}
          {activeTab === 'text' && (
            <>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Script
              </label>
              <textarea
                className="w-full h-64 px-4 py-3 text-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Paste your explainer video script here... 

Example:
Welcome to our revolutionary new app! Have you ever struggled with organizing your daily tasks? Our app makes it simple. Just tap, drag, and done! With smart AI suggestions, you'll never miss a deadline again. Try it free for 30 days. Your productivity journey starts now."
                value={localScript}
                onChange={(e) => {
                  setLocalScript(e.target.value);
                  setError('');
                }}
                disabled={isGenerating}
              />
            </>
          )}

          {/* Voice Input Tab */}
          {activeTab === 'voice' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-4">
                Record or Upload Audio
              </label>
              <VoiceRecorder onTranscription={handleVoiceTranscription} />
              
              {localScript && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Script
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{localScript}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {error && (
            <div className="mt-3 flex items-start gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Advanced Options Toggle */}
          <div className="mt-4">
            <button
              className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            >
              <Wand2 className="w-4 h-4" />
              {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
            </button>
          </div>

          {/* Advanced Options Panel */}
          {showAdvancedOptions && (
            <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg space-y-4">
              {/* AI Images Toggle */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="use-ai-images"
                  checked={useAIImages}
                  onChange={(e) => setUseAIImages(e.target.checked)}
                  className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <label htmlFor="use-ai-images" className="font-medium text-gray-900 cursor-pointer flex items-center gap-2">
                    <Image className="w-4 h-4 text-purple-600" />
                    Generate AI Custom Illustrations
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Use DALL-E 3 to create unique, custom illustrations for each scene instead of icons. This will take longer and use your OpenAI credits.
                  </p>
                </div>
              </div>

              {/* Style Selection (only shown when AI images enabled) */}
              {useAIImages && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Illustration Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ILLUSTRATION_STYLES.map((style) => (
                      <button
                        key={style.value}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          selectedStyle === style.value
                            ? 'border-purple-500 bg-purple-100'
                            : 'border-gray-300 hover:border-purple-300 bg-white'
                        }`}
                        onClick={() => setSelectedStyle(style.value)}
                      >
                        <div className="font-medium text-sm text-gray-900">{style.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{style.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Warning about costs */}
              {useAIImages && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-yellow-900">
                    <p className="font-medium">Note about costs:</p>
                    <p className="mt-1">
                      AI image generation uses DALL-E 3 which costs approximately $0.04 per image (1024x1024). 
                      A typical storyboard with 5-10 scenes will cost $0.20-$0.40. You can always add or regenerate 
                      individual AI illustrations later.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {localScript.length} characters
            </span>
            <button
              className={`flex items-center gap-2 px-6 py-3 rounded-lg hover:opacity-90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                useAIImages
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-purple-600 text-white'
              }`}
              onClick={handleGenerate}
              disabled={isGenerating || !localScript.trim()}
            >
              {useAIImages ? <Wand2 className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              {isGenerating 
                ? (useAIImages ? 'Generating with AI...' : 'Generating...') 
                : (useAIImages ? 'Generate with AI Images' : 'Generate Storyboard')}
            </button>
          </div>
        </div>

        <div className="bg-muted px-6 py-4 border-t border-border">
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-1">How it works:</p>
              <p>
                Our AI will analyze your script and automatically break it down into 3-20 visual scenes. 
                {useAIImages ? (
                  <span className="text-purple-700 font-medium">
                    {' '}With AI illustrations enabled, DALL-E 3 will create custom, unique images for each scene 
                    in your selected style. This provides professional-quality visuals tailored to your content.
                  </span>
                ) : (
                  <span>
                    {' '}Each scene will include suggested icons, layouts, and animations that you can customize. 
                    You can also generate custom AI illustrations for individual scenes later.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
