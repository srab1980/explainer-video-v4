'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import {
  Download,
  FileText,
  Video,
  FileJson,
  Settings,
  Clock,
  Check,
  AlertCircle,
  Loader2,
  Trash2,
  X,
  FileCheck,
  Package,
  TrendingUp,
} from 'lucide-react';
import type { ExportFormat, ExportConfig, PDFExportConfig, JSONExportConfig, VideoRenderConfig } from '@/lib/types';
import jsPDF from 'jspdf';

const EXPORT_FORMATS = [
  { value: 'video' as ExportFormat, label: 'Video', icon: Video, description: 'MP4/WebM video file' },
  { value: 'pdf' as ExportFormat, label: 'PDF', icon: FileText, description: 'Presentation or storyboard document' },
  { value: 'json' as ExportFormat, label: 'JSON', icon: FileJson, description: 'Project data backup' },
];

export default function ExportManager() {
  const {
    currentProject,
    exportJobs,
    exportHistory,
    currentExportJob,
    isExporting,
    exportProgress,
    exportStatistics,
    startExport,
    startBatchExport,
    downloadExport,
    deleteExportHistory,
    clearExportHistory,
    videoConfig,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'export' | 'history' | 'stats'>('export');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('video');
  const [batchExport, setBatchExport] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState<ExportFormat[]>(['video']);

  // PDF config
  const [pdfConfig, setPdfConfig] = useState<PDFExportConfig>({
    format: 'storyboard',
    pageSize: 'a4',
    orientation: 'landscape',
    includeSceneThumbnails: true,
    includeSceneDescriptions: true,
    includeVoiceoverText: true,
    includeTimestamps: true,
    includePageNumbers: true,
    includeBranding: true,
    quality: 'high',
  });

  // JSON config
  const [jsonConfig, setJSONConfig] = useState<JSONExportConfig>({
    includeMetadata: true,
    includeAssets: false,
    pretty: true,
    version: '1.0.0',
  });

  const [error, setError] = useState<string | null>(null);

  if (!currentProject) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Package className="mx-auto mb-3 h-12 w-12 text-gray-400" />
        <p>Create a storyboard first to export</p>
      </div>
    );
  }

  const handleExport = async () => {
    setError(null);
    try {
      if (batchExport) {
        // Batch export
        await startBatchExport({
          formats: selectedFormats,
          configs: {
            video: videoConfig || undefined,
            pdf: pdfConfig,
            json: jsonConfig,
          },
          simultaneousExports: true,
        });
      } else {
        // Single export
        const config: ExportConfig = {
          format: selectedFormat,
          projectId: currentProject.id,
          projectName: currentProject.name || 'Untitled Project',
          includeWatermark: false,
        };

        if (selectedFormat === 'video') {
          config.videoConfig = videoConfig || undefined;
        } else if (selectedFormat === 'pdf') {
          config.pdfConfig = pdfConfig;
          
          // Generate PDF client-side
          await generatePDF(currentProject, pdfConfig);
          return;
        } else if (selectedFormat === 'json') {
          config.jsonConfig = jsonConfig;
          
          // Generate JSON client-side
          await generateJSON(currentProject, jsonConfig);
          return;
        }

        await startExport(config);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  };

  const generatePDF = async (project: any, config: PDFExportConfig) => {
    const pdf = new jsPDF({
      orientation: config.orientation,
      unit: 'mm',
      format: config.pageSize,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;

    // Title page
    pdf.setFontSize(24);
    pdf.text(project.name || 'Storyboard', pageWidth / 2, 40, { align: 'center' });
    
    if (config.includeBranding) {
      pdf.setFontSize(10);
      pdf.text('Created with StoryVid', pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    pdf.addPage();

    // Scene pages
    project.scenes?.forEach((scene: any, index: number) => {
      if (index > 0) pdf.addPage();

      let yOffset = margin;

      // Scene title
      pdf.setFontSize(18);
      pdf.text(`Scene ${index + 1}: ${scene.title}`, margin, yOffset);
      yOffset += 12;

      // Scene description
      if (config.includeSceneDescriptions && scene.description) {
        pdf.setFontSize(12);
        const lines = pdf.splitTextToSize(scene.description, pageWidth - 2 * margin);
        pdf.text(lines, margin, yOffset);
        yOffset += lines.length * 6;
      }

      // Voiceover
      if (config.includeVoiceoverText && scene.voiceover) {
        pdf.setFontSize(10);
        pdf.text('Voiceover:', margin, yOffset);
        yOffset += 6;
        pdf.setFontSize(9);
        const voiceoverLines = pdf.splitTextToSize(scene.voiceover, pageWidth - 2 * margin);
        pdf.text(voiceoverLines, margin, yOffset);
        yOffset += voiceoverLines.length * 5;
      }

      // Timestamps
      if (config.includeTimestamps) {
        pdf.setFontSize(9);
        pdf.text(`Duration: ${scene.duration || 5}s | Layout: ${scene.layoutType}`, margin, yOffset);
      }
    });

    // Save PDF
    const fileName = `${project.name || 'storyboard'}_${Date.now()}.pdf`;
    pdf.save(fileName);
  };

  const generateJSON = async (project: any, config: JSONExportConfig) => {
    const response = await fetch('/api/export-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project, config }),
    });

    if (!response.ok) {
      throw new Error('JSON export failed');
    }

    const result = await response.json();
    
    // Create download
    const blob = new Blob([result.jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Download className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Export Manager</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('export')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'export'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Export
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              History ({exportHistory.length})
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Statistics
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'export' && (
          <div className="space-y-6">
            {/* Batch Export Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="batch-export"
                checked={batchExport}
                onChange={(e) => setBatchExport(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="batch-export" className="text-sm font-medium text-gray-700">
                Batch Export (Multiple Formats)
              </label>
            </div>

            {/* Format Selection */}
            {!batchExport ? (
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">Select Format</label>
                <div className="grid grid-cols-3 gap-4">
                  {EXPORT_FORMATS.map((format) => {
                    const Icon = format.icon;
                    return (
                      <button
                        key={format.value}
                        onClick={() => setSelectedFormat(format.value)}
                        className={`flex flex-col items-center rounded-lg border-2 p-4 transition-all ${
                          selectedFormat === format.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <Icon className={`h-8 w-8 ${selectedFormat === format.value ? 'text-purple-600' : 'text-gray-400'}`} />
                        <span className="mt-2 font-medium">{format.label}</span>
                        <span className="mt-1 text-xs text-gray-500">{format.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">Select Formats to Export</label>
                <div className="space-y-2">
                  {EXPORT_FORMATS.map((format) => {
                    const Icon = format.icon;
                    return (
                      <label
                        key={format.value}
                        className="flex items-center space-x-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFormats.includes(format.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFormats([...selectedFormats, format.value]);
                            } else {
                              setSelectedFormats(selectedFormats.filter((f) => f !== format.value));
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <Icon className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <div className="font-medium">{format.label}</div>
                          <div className="text-xs text-gray-500">{format.description}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Format-specific Config */}
            {!batchExport && selectedFormat === 'pdf' && (
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-4 flex items-center space-x-2 font-medium">
                  <Settings className="h-5 w-5" />
                  <span>PDF Options</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm text-gray-700">Format</label>
                    <select
                      value={pdfConfig.format}
                      onChange={(e) => setPdfConfig({ ...pdfConfig, format: e.target.value as any })}
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    >
                      <option value="presentation">Presentation</option>
                      <option value="storyboard">Storyboard</option>
                      <option value="script">Script</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-700">Page Size</label>
                    <select
                      value={pdfConfig.pageSize}
                      onChange={(e) => setPdfConfig({ ...pdfConfig, pageSize: e.target.value as any })}
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    >
                      <option value="a4">A4</option>
                      <option value="letter">Letter</option>
                      <option value="a3">A3</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-700">Orientation</label>
                    <select
                      value={pdfConfig.orientation}
                      onChange={(e) => setPdfConfig({ ...pdfConfig, orientation: e.target.value as any })}
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    >
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-700">Quality</label>
                    <select
                      value={pdfConfig.quality}
                      onChange={(e) => setPdfConfig({ ...pdfConfig, quality: e.target.value as any })}
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={pdfConfig.includeSceneThumbnails}
                      onChange={(e) => setPdfConfig({ ...pdfConfig, includeSceneThumbnails: e.target.checked })}
                      className="rounded border-gray-300 text-purple-600"
                    />
                    <span className="text-sm">Include scene thumbnails</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={pdfConfig.includeVoiceoverText}
                      onChange={(e) => setPdfConfig({ ...pdfConfig, includeVoiceoverText: e.target.checked })}
                      className="rounded border-gray-300 text-purple-600"
                    />
                    <span className="text-sm">Include voiceover text</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={pdfConfig.includeTimestamps}
                      onChange={(e) => setPdfConfig({ ...pdfConfig, includeTimestamps: e.target.checked })}
                      className="rounded border-gray-300 text-purple-600"
                    />
                    <span className="text-sm">Include timestamps</span>
                  </label>
                </div>
              </div>
            )}

            {!batchExport && selectedFormat === 'json' && (
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-4 flex items-center space-x-2 font-medium">
                  <Settings className="h-5 w-5" />
                  <span>JSON Options</span>
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={jsonConfig.includeMetadata}
                      onChange={(e) => setJSONConfig({ ...jsonConfig, includeMetadata: e.target.checked })}
                      className="rounded border-gray-300 text-purple-600"
                    />
                    <span className="text-sm">Include metadata</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={jsonConfig.includeAssets}
                      onChange={(e) => setJSONConfig({ ...jsonConfig, includeAssets: e.target.checked })}
                      className="rounded border-gray-300 text-purple-600"
                    />
                    <span className="text-sm">Include assets (base64 images)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={jsonConfig.pretty}
                      onChange={(e) => setJSONConfig({ ...jsonConfig, pretty: e.target.checked })}
                      className="rounded border-gray-300 text-purple-600"
                    />
                    <span className="text-sm">Pretty print (human-readable)</span>
                  </label>
                </div>
              </div>
            )}

            {/* Export Progress */}
            {isExporting && currentExportJob && (
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                    <span className="font-medium">Exporting...</span>
                  </div>
                  <span className="text-sm text-gray-600">{exportProgress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-purple-200">
                  <div
                    className="h-full bg-purple-600 transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="flex items-start space-x-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={isExporting || (batchExport && selectedFormats.length === 0)}
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white transition-all hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isExporting ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Exporting...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>{batchExport ? `Export ${selectedFormats.length} Formats` : 'Start Export'}</span>
                </span>
              )}
            </button>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {exportHistory.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <FileCheck className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                <p>No export history yet</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Export History</h3>
                  <button
                    onClick={clearExportHistory}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-3">
                  {exportHistory.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center space-x-4">
                        {entry.format === 'video' && <Video className="h-6 w-6 text-purple-600" />}
                        {entry.format === 'pdf' && <FileText className="h-6 w-6 text-blue-600" />}
                        {entry.format === 'json' && <FileJson className="h-6 w-6 text-green-600" />}
                        <div>
                          <div className="font-medium">{entry.fileName}</div>
                          <div className="text-sm text-gray-500">
                            {formatFileSize(entry.fileSize)} • {formatDate(entry.exportedAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = entry.fileUrl;
                            a.download = entry.fileName;
                            a.click();
                          }}
                          className="rounded bg-purple-600 px-3 py-1 text-sm text-white hover:bg-purple-700"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => deleteExportHistory(entry.id)}
                          className="rounded p-1 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Export Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold">{exportStatistics.totalExports}</div>
                    <div className="text-sm text-gray-500">Total Exports</div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">{exportStatistics.averageExportTime.toFixed(1)}s</div>
                    <div className="text-sm text-gray-500">Avg Export Time</div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{formatFileSize(exportStatistics.totalExportedSize)}</div>
                    <div className="text-sm text-gray-500">Total Size</div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <FileCheck className="h-8 w-8 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold">
                      {exportStatistics.lastExportDate
                        ? new Date(exportStatistics.lastExportDate).toLocaleDateString()
                        : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">Last Export</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="mb-4 font-medium">Exports by Format</h4>
              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>Video</span>
                    <span className="font-medium">{exportStatistics.exportsByFormat.video}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-purple-600"
                      style={{
                        width: `${(exportStatistics.exportsByFormat.video / exportStatistics.totalExports) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>PDF</span>
                    <span className="font-medium">{exportStatistics.exportsByFormat.pdf}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-blue-600"
                      style={{
                        width: `${(exportStatistics.exportsByFormat.pdf / exportStatistics.totalExports) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>JSON</span>
                    <span className="font-medium">{exportStatistics.exportsByFormat.json}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-green-600"
                      style={{
                        width: `${(exportStatistics.exportsByFormat.json / exportStatistics.totalExports) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
