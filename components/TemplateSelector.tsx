'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { IndustryTemplate, TemplatePreset } from '@/lib/types';
import { Sparkles, Check, Building2, Rocket, GraduationCap, Briefcase, TrendingUp, Users, Video, Zap } from 'lucide-react';

// Industry template presets
const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: 'saas-product-demo',
    name: 'SaaS Product Demo',
    industry: 'saas-product-demo',
    description: 'Perfect for showcasing software features and benefits',
    thumbnail: '/templates/saas-demo.png',
    defaultColors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#06B6D4',
      background: '#F8FAFC',
      text: '#1E293B',
    },
    defaultAnimations: ['slide', 'fade', 'zoom'],
    defaultLayout: 'side-by-side',
    defaultDuration: 5,
    includesIntro: true,
    includesOutro: true,
    textStyle: {
      titleFont: 'Inter',
      bodyFont: 'Inter',
      titleSize: 48,
      bodySize: 20,
    },
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    industry: 'product-launch',
    description: 'Eye-catching template for announcing new products',
    thumbnail: '/templates/product-launch.png',
    defaultColors: {
      primary: '#EF4444',
      secondary: '#F59E0B',
      accent: '#10B981',
      background: '#FFFFFF',
      text: '#111827',
    },
    defaultAnimations: ['zoom', 'bounce', 'slide'],
    defaultLayout: 'centered-large',
    defaultDuration: 6,
    includesIntro: true,
    includesOutro: true,
    textStyle: {
      titleFont: 'Poppins',
      bodyFont: 'Open Sans',
      titleSize: 56,
      bodySize: 22,
    },
  },
  {
    id: 'educational-tutorial',
    name: 'Educational Tutorial',
    industry: 'educational-tutorial',
    description: 'Clear and structured template for teaching concepts',
    thumbnail: '/templates/educational.png',
    defaultColors: {
      primary: '#14B8A6',
      secondary: '#06B6D4',
      accent: '#8B5CF6',
      background: '#F0FDFA',
      text: '#134E4A',
    },
    defaultAnimations: ['fade', 'slide', 'morph'],
    defaultLayout: 'rule-of-thirds',
    defaultDuration: 7,
    includesIntro: true,
    includesOutro: false,
    textStyle: {
      titleFont: 'Roboto',
      bodyFont: 'Roboto',
      titleSize: 44,
      bodySize: 18,
    },
  },
  {
    id: 'service-explanation',
    name: 'Service Explanation',
    industry: 'service-explanation',
    description: 'Professional template for explaining services clearly',
    thumbnail: '/templates/service.png',
    defaultColors: {
      primary: '#0F172A',
      secondary: '#475569',
      accent: '#3B82F6',
      background: '#F1F5F9',
      text: '#0F172A',
    },
    defaultAnimations: ['slide', 'fade', 'zoom'],
    defaultLayout: 'side-by-side',
    defaultDuration: 6,
    includesIntro: true,
    includesOutro: true,
    textStyle: {
      titleFont: 'Montserrat',
      bodyFont: 'Lato',
      titleSize: 46,
      bodySize: 20,
    },
  },
  {
    id: 'startup-pitch',
    name: 'Startup Pitch',
    industry: 'startup-pitch',
    description: 'Dynamic template for pitching your startup vision',
    thumbnail: '/templates/startup.png',
    defaultColors: {
      primary: '#7C3AED',
      secondary: '#DB2777',
      accent: '#F59E0B',
      background: '#FAF5FF',
      text: '#581C87',
    },
    defaultAnimations: ['bounce', 'zoom', 'slide'],
    defaultLayout: 'centered-large',
    defaultDuration: 5,
    includesIntro: true,
    includesOutro: true,
    textStyle: {
      titleFont: 'Poppins',
      bodyFont: 'Inter',
      titleSize: 52,
      bodySize: 22,
    },
  },
  {
    id: 'company-culture',
    name: 'Company Culture',
    industry: 'company-culture',
    description: 'Warm and engaging template for showcasing team culture',
    thumbnail: '/templates/culture.png',
    defaultColors: {
      primary: '#EC4899',
      secondary: '#F472B6',
      accent: '#FBBF24',
      background: '#FEF3F2',
      text: '#9F1239',
    },
    defaultAnimations: ['fade', 'slide', 'morph'],
    defaultLayout: 'grid-3x3',
    defaultDuration: 6,
    includesIntro: false,
    includesOutro: true,
    textStyle: {
      titleFont: 'Raleway',
      bodyFont: 'Open Sans',
      titleSize: 48,
      bodySize: 20,
    },
  },
];

// Icons mapping
const TEMPLATE_ICONS: Record<IndustryTemplate, React.ReactNode> = {
  'saas-product-demo': <Building2 className="h-6 w-6" />,
  'product-launch': <Rocket className="h-6 w-6" />,
  'educational-tutorial': <GraduationCap className="h-6 w-6" />,
  'service-explanation': <Briefcase className="h-6 w-6" />,
  'startup-pitch': <TrendingUp className="h-6 w-6" />,
  'company-culture': <Users className="h-6 w-6" />,
  'testimonial': <Video className="h-6 w-6" />,
  'how-it-works': <Zap className="h-6 w-6" />,
  'feature-highlight': <Sparkles className="h-6 w-6" />,
  'custom': <Video className="h-6 w-6" />,
};

export default function TemplateSelector() {
  const { currentProject, selectedTemplate, setTemplate } = useStore();
  const [selectedPreview, setSelectedPreview] = useState<TemplatePreset | null>(null);

  if (!currentProject) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Video className="mx-auto mb-3 h-12 w-12 text-gray-400" />
        <p>Create a project first to select a template</p>
      </div>
    );
  }

  const handleSelectTemplate = (template: TemplatePreset) => {
    setTemplate(template.industry);
    setSelectedPreview(template);
    
    // Apply template colors to project
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        colorPalette: Object.values(template.defaultColors),
      };
      // Store would update this in a real implementation
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Industry Templates</h2>
            <p className="mt-1 text-sm text-gray-600">Choose a professional template to get started</p>
          </div>
          {selectedTemplate && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 text-sm text-green-700">
              <Check className="h-4 w-4" />
              Template Selected
            </div>
          )}
        </div>
      </div>

      {/* Template Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {TEMPLATE_PRESETS.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className={`group relative overflow-hidden rounded-lg border-2 text-left transition-all ${
                selectedTemplate === template.industry
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }`}
            >
              {/* Color Preview Bar */}
              <div className="flex h-2">
                <div className="w-1/5" style={{ backgroundColor: template.defaultColors.primary }} />
                <div className="w-1/5" style={{ backgroundColor: template.defaultColors.secondary }} />
                <div className="w-1/5" style={{ backgroundColor: template.defaultColors.accent }} />
                <div className="w-1/5" style={{ backgroundColor: template.defaultColors.background }} />
                <div className="w-1/5" style={{ backgroundColor: template.defaultColors.text }} />
              </div>

              {/* Template Content */}
              <div className="p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${selectedTemplate === template.industry ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                      {TEMPLATE_ICONS[template.industry]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-xs text-gray-600">{template.description}</p>
                    </div>
                  </div>
                  {selectedTemplate === template.industry && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </div>

                {/* Template Details */}
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-200 pt-3 text-xs">
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">{template.defaultDuration}s/scene</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Layout</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {template.defaultLayout.replace('-', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Animations</p>
                    <p className="font-medium text-gray-900">{template.defaultAnimations.length} types</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Intro/Outro</p>
                    <p className="font-medium text-gray-900">
                      {template.includesIntro ? '✓' : '✗'} / {template.includesOutro ? '✓' : '✗'}
                    </p>
                  </div>
                </div>

                {/* Font Preview */}
                <div className="mt-3 rounded border border-gray-200 bg-gray-50 p-2 text-xs">
                  <p className="text-gray-600">Fonts</p>
                  <p className="font-medium text-gray-900">
                    {template.textStyle.titleFont} / {template.textStyle.bodyFont}
                  </p>
                </div>
              </div>

              {/* Selected Indicator */}
              {selectedTemplate === template.industry && (
                <div className="absolute right-0 top-0 h-full w-1 bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        {/* Template Preview */}
        {selectedPreview && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-900">Template Preview</h3>
            </div>
            
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-8 text-center">
              <div 
                className="mx-auto mb-4 rounded-lg p-6" 
                style={{ backgroundColor: selectedPreview.defaultColors.background }}
              >
                <h4 
                  className="mb-2 text-3xl font-bold"
                  style={{ 
                    color: selectedPreview.defaultColors.primary,
                    fontFamily: selectedPreview.textStyle.titleFont,
                  }}
                >
                  Your Headline Here
                </h4>
                <p 
                  className="text-lg"
                  style={{ 
                    color: selectedPreview.defaultColors.text,
                    fontFamily: selectedPreview.textStyle.bodyFont,
                  }}
                >
                  Supporting text with {selectedPreview.name} styling
                </p>
              </div>
              <p className="text-sm text-gray-500">
                This template will be applied to all scenes in your video
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {selectedTemplate && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Check className="h-4 w-4 text-green-600" />
              <span>Template will be applied when exporting video</span>
            </div>
            <button
              onClick={() => setTemplate(null as any)}
              className="text-gray-600 hover:text-gray-900"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
