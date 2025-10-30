'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { BrandIdentity } from '@/lib/types';
import { Palette, Type, Image, Sparkles, Plus, Check, X, Save, Upload } from 'lucide-react';

export default function BrandManager() {
  const { currentProject, selectedBrand, setBrand } = useStore();
  
  const [localBrand, setLocalBrand] = useState<BrandIdentity>(selectedBrand || {
    id: 'default',
    name: 'My Brand',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#111827',
      custom: [],
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      fontSizes: {
        h1: 48,
        h2: 36,
        body: 18,
        caption: 14,
      },
    },
    logo: undefined,
    watermark: undefined,
  });

  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState('#000000');

  if (!currentProject) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Palette className="mx-auto mb-3 h-12 w-12 text-gray-400" />
        <p>Create a project first to manage brand</p>
      </div>
    );
  }

  const handleColorChange = (key: keyof BrandIdentity['colors'], value: string) => {
    setLocalBrand({
      ...localBrand,
      colors: {
        ...localBrand.colors,
        [key]: value,
      },
    });
  };

  const handleAddCustomColor = () => {
    setLocalBrand({
      ...localBrand,
      colors: {
        ...localBrand.colors,
        custom: [...localBrand.colors.custom, customColor],
      },
    });
    setCustomColor('#000000');
  };

  const handleRemoveCustomColor = (index: number) => {
    setLocalBrand({
      ...localBrand,
      colors: {
        ...localBrand.colors,
        custom: localBrand.colors.custom.filter((_, i) => i !== index),
      },
    });
  };

  const handleFontChange = (type: 'headingFont' | 'bodyFont', value: string) => {
    setLocalBrand({
      ...localBrand,
      typography: {
        ...localBrand.typography,
        [type]: value,
      },
    });
  };

  const handleFontSizeChange = (key: keyof BrandIdentity['typography']['fontSizes'], value: number) => {
    setLocalBrand({
      ...localBrand,
      typography: {
        ...localBrand.typography,
        fontSizes: {
          ...localBrand.typography.fontSizes,
          [key]: value,
        },
      },
    });
  };

  const handleSaveBrand = () => {
    setBrand(localBrand);
  };

  const FONT_OPTIONS = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Poppins',
    'Montserrat',
    'Lato',
    'Raleway',
    'Playfair Display',
    'Merriweather',
  ];

  const LOGO_POSITIONS = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'center', label: 'Center' },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Brand Manager</h2>
            <p className="mt-1 text-sm text-gray-600">Customize your brand identity</p>
          </div>
          <button
            onClick={handleSaveBrand}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            Save Brand
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Brand Name */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Brand Name
          </label>
          <input
            type="text"
            value={localBrand.name}
            onChange={(e) => setLocalBrand({ ...localBrand, name: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="My Awesome Brand"
          />
        </div>

        {/* Color Palette */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Color Palette</h3>
          </div>

          <div className="space-y-3">
            {/* Primary Colors */}
            {(['primary', 'secondary', 'accent'] as const).map((key) => (
              <div key={key} className="flex items-center gap-4">
                <label className="w-24 text-sm font-medium capitalize text-gray-700">
                  {key}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localBrand.colors[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="h-10 w-16 cursor-pointer rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={localBrand.colors[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-28 rounded border border-gray-300 px-3 py-2 text-sm font-mono"
                    placeholder="#000000"
                  />
                  <div
                    className="h-10 w-20 rounded border-2 border-gray-300"
                    style={{ backgroundColor: localBrand.colors[key] }}
                  />
                </div>
              </div>
            ))}

            {/* Background & Text */}
            {(['background', 'text'] as const).map((key) => (
              <div key={key} className="flex items-center gap-4">
                <label className="w-24 text-sm font-medium capitalize text-gray-700">
                  {key}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localBrand.colors[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="h-10 w-16 cursor-pointer rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={localBrand.colors[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-28 rounded border border-gray-300 px-3 py-2 text-sm font-mono"
                    placeholder="#000000"
                  />
                  <div
                    className="h-10 w-20 rounded border-2 border-gray-300"
                    style={{ backgroundColor: localBrand.colors[key] }}
                  />
                </div>
              </div>
            ))}

            {/* Custom Colors */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <p className="mb-2 text-sm font-medium text-gray-700">Additional Brand Colors</p>
              <div className="flex flex-wrap gap-2">
                {localBrand.colors.custom.map((color, index) => (
                  <div
                    key={index}
                    className="group relative h-12 w-12 rounded border-2 border-gray-300"
                    style={{ backgroundColor: color }}
                  >
                    <button
                      onClick={() => handleRemoveCustomColor(index)}
                      className="absolute -right-2 -top-2 hidden rounded-full bg-red-500 p-1 text-white group-hover:block"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="h-12 w-12 cursor-pointer rounded border border-gray-300"
                  />
                  <button
                    onClick={handleAddCustomColor}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <Type className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Typography</h3>
          </div>

          <div className="space-y-4">
            {/* Font Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Heading Font
              </label>
              <select
                value={localBrand.typography.headingFont}
                onChange={(e) => handleFontChange('headingFont', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                style={{ fontFamily: localBrand.typography.headingFont }}
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Body Font
              </label>
              <select
                value={localBrand.typography.bodyFont}
                onChange={(e) => handleFontChange('bodyFont', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                style={{ fontFamily: localBrand.typography.bodyFont }}
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Sizes */}
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(localBrand.typography.fontSizes) as Array<keyof BrandIdentity['typography']['fontSizes']>).map((key) => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-medium uppercase text-gray-600">
                    {key}
                  </label>
                  <input
                    type="number"
                    value={localBrand.typography.fontSizes[key]}
                    onChange={(e) => handleFontSizeChange(key, parseInt(e.target.value))}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                    min="8"
                    max="120"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <Image className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Logo</h3>
          </div>

          <div className="space-y-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-gray-600 hover:bg-gray-100">
              <Upload className="h-5 w-5" />
              <span className="text-sm">Upload Logo (Coming Soon)</span>
            </button>

            {localBrand.logo && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Logo Position
                  </label>
                  <select
                    value={localBrand.logo.position}
                    onChange={(e) => setLocalBrand({
                      ...localBrand,
                      logo: { ...localBrand.logo!, position: e.target.value as any },
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  >
                    {LOGO_POSITIONS.map((pos) => (
                      <option key={pos.value} value={pos.value}>
                        {pos.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
                    <span>Logo Size</span>
                    <span className="text-gray-600">{localBrand.logo.size}%</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={localBrand.logo.size}
                    onChange={(e) => setLocalBrand({
                      ...localBrand,
                      logo: { ...localBrand.logo!, size: parseInt(e.target.value) },
                    })}
                    className="w-full"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-900">Brand Preview</h3>
          </div>
          
          <div
            className="rounded-lg p-8 text-center"
            style={{ backgroundColor: localBrand.colors.background }}
          >
            <h4
              className="mb-3 text-4xl font-bold"
              style={{
                color: localBrand.colors.primary,
                fontFamily: localBrand.typography.headingFont,
                fontSize: `${localBrand.typography.fontSizes.h1}px`,
              }}
            >
              {localBrand.name}
            </h4>
            <p
              className="text-lg"
              style={{
                color: localBrand.colors.text,
                fontFamily: localBrand.typography.bodyFont,
                fontSize: `${localBrand.typography.fontSizes.body}px`,
              }}
            >
              Your brand identity will be applied consistently throughout your video
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <div className="h-8 w-8 rounded" style={{ backgroundColor: localBrand.colors.primary }} />
              <div className="h-8 w-8 rounded" style={{ backgroundColor: localBrand.colors.secondary }} />
              <div className="h-8 w-8 rounded" style={{ backgroundColor: localBrand.colors.accent }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
