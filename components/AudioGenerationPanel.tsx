'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Mic, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface AudioGenerationPanelProps {
  className?: string;
}

export default function AudioGenerationPanel({ className = '' }: AudioGenerationPanelProps) {
  const { generateVoiceover, currentProject } = useStore();
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Please enter text to generate voiceover');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(false);
    setAudioUrl(null);

    try {
      const result = await generateVoiceover(text, 'alloy', 'en');
      setAudioUrl(result);
      setSuccess(true);
      setText('');
    } catch (err: any) {
      console.error('Audio generation error:', err);
      setError(err.message || 'Failed to generate voiceover');
    } finally {
      setIsGenerating(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(false);
  };

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Mic className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI Voiceover Generation</h3>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
          <button
            onClick={clearMessages}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
          <span className="text-green-700 text-sm">Voiceover generated successfully!</span>
          <button
            onClick={clearMessages}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Audio Player */}
      {audioUrl && (
        <div className="mb-4">
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* Input Area */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text to Convert to Speech
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to convert to speech..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            maxLength={4000}
            disabled={isGenerating}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {text.length}/4000 characters
            </span>
            <span className="text-xs text-gray-500">
              {Math.ceil(text.length / 150)}s estimated duration
            </span>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !text.trim()}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Generate Voiceover
            </>
          )}
        </button>
      </div>
    </div>
  );
}