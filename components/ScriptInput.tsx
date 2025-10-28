'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Sparkles, AlertCircle } from 'lucide-react';

export default function ScriptInput() {
  const { currentProject, updateScript, generateScenes, isGenerating } = useStore();
  const [localScript, setLocalScript] = useState(currentProject?.script || '');
  const [error, setError] = useState('');

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
      await generateScenes(localScript);
    } catch (err) {
      setError('Failed to generate scenes. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-lg border border-border overflow-hidden">
        <div className="p-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Your Script
          </label>
          <textarea
            className="w-full h-64 px-4 py-3 text-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
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
          
          {error && (
            <div className="mt-3 flex items-start gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {localScript.length} characters
            </span>
            <button
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGenerate}
              disabled={isGenerating || !localScript.trim()}
            >
              <Sparkles className="w-5 h-5" />
              {isGenerating ? 'Generating...' : 'Generate Storyboard'}
            </button>
          </div>
        </div>

        <div className="bg-muted px-6 py-4 border-t border-border">
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-1">How it works:</p>
              <p>
                Our AI will analyze your script and automatically break it down into 3-20 visual scenes, 
                each with suggested icons, layouts, and animations. You can then customize every aspect 
                to match your vision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
