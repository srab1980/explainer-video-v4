'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Globe, Loader2, CheckCircle, XCircle } from 'lucide-react';
import type { SupportedLanguage } from '@/lib/types';

const LANGUAGES: { code: SupportedLanguage; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
];

export default function LanguageSelector() {
  const { currentLanguage, setLanguage, translateProject } = useStore();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translated, setTranslated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = async (language: SupportedLanguage) => {
    if (language === currentLanguage) return;

    setIsTranslating(true);
    setTranslated(false);
    setError(null);
    try {
      await translateProject(language);
      setTranslated(true);
      setTimeout(() => setTranslated(false), 3000);
    } catch (error: any) {
      console.error('Translation failed:', error);
      setError(error.message || 'Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold">Language & Translation</h3>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            disabled={isTranslating}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
              currentLanguage === lang.code
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            } ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-2xl">{lang.flag}</span>
            <span className="text-xs font-medium">{lang.name}</span>
            {currentLanguage === lang.code && (
              <CheckCircle className="w-4 h-4 text-purple-600" />
            )}
          </button>
        ))}
      </div>

      {isTranslating && (
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
          <span className="text-sm font-medium">Translating project...</span>
        </div>
      )}

      {translated && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium">Translation complete!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Translation Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> Translating will update all text in your project including the script, scene titles, and descriptions. Cultural adaptations may be suggested for better localization.
        </p>
      </div>
    </div>
  );
}
