import React, { useState } from 'react';
import { Package, Image as ImageIcon, BarChart3, Upload, Download, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { User } from '../lib/supabase';

interface BulkProcessPageProps {
  user: User | null;
  onBulkProcess: (data: any[]) => Promise<void>;
}

export const BulkProcessPage: React.FC<BulkProcessPageProps> = ({ user, onBulkProcess }) => {
  const [selectedType, setSelectedType] = useState<'blog' | 'infographic'>('blog');
  const [bulkData, setBulkData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [results, setResults] = useState<any[]>([]);

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row);
    }

    return data;
  };

  const handleProcess = async () => {
    const lines = bulkData.trim().split('\n').filter(line => line.trim());
    if (lines.length === 0) return;

    setIsProcessing(true);
    setProgress({ completed: 0, total: lines.length });
    setResults([]);

    const processedResults = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const [title, content] = line.split(',').map(s => s.trim());

      try {
        processedResults.push({
          title: title || `Item ${i + 1}`,
          content: content || '',
          status: 'success',
          type: selectedType
        });
      } catch (error) {
        processedResults.push({
          title: title || `Item ${i + 1}`,
          content: content || '',
          status: 'error',
          error: (error as Error).message,
          type: selectedType
        });
      }

      setProgress({ completed: i + 1, total: lines.length });
      setResults([...processedResults]);
    }

    setIsProcessing(false);
  };

  const downloadTemplate = () => {
    const template = selectedType === 'blog'
      ? 'title,content\n"Example Blog Title","Blog post content description"\n"Another Title","More content here"'
      : 'content\n"First infographic data point"\n"Second infographic data point"';

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bulk-${selectedType}-template.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const creditsPerImage = selectedType === 'blog' ? 5 : 10;
  const totalCreditsNeeded = bulkData.trim().split('\n').filter(line => line.trim()).length * creditsPerImage;
  const hasEnoughCredits = user && user.credits >= totalCreditsNeeded;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Bulk Processing
          </h1>
          <p className="text-gray-600">Generate multiple images at once from CSV or text input</p>
        </div>

        {/* Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setSelectedType('blog')}
            className={`p-6 rounded-3xl transition-all duration-300 ${
              selectedType === 'blog'
                ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-2xl shadow-blue-500/30 scale-105'
                : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                selectedType === 'blog'
                  ? 'bg-white/20 backdrop-blur-sm'
                  : 'bg-gradient-to-br from-blue-500 to-cyan-500'
              }`}>
                <ImageIcon className="w-7 h-7 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className={`text-xl font-bold ${selectedType === 'blog' ? 'text-white' : 'text-gray-900'}`}>
                  Blog Images
                </h3>
                <p className={`text-sm ${selectedType === 'blog' ? 'text-blue-100' : 'text-gray-600'}`}>
                  5 credits each
                </p>
              </div>
              {selectedType === 'blog' && (
                <CheckCircle2 className="w-6 h-6 text-white" />
              )}
            </div>
          </button>

          <button
            onClick={() => setSelectedType('infographic')}
            className={`p-6 rounded-3xl transition-all duration-300 ${
              selectedType === 'infographic'
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl shadow-purple-500/30 scale-105'
                : 'bg-white border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                selectedType === 'infographic'
                  ? 'bg-white/20 backdrop-blur-sm'
                  : 'bg-gradient-to-br from-purple-500 to-pink-500'
              }`}>
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className={`text-xl font-bold ${selectedType === 'infographic' ? 'text-white' : 'text-gray-900'}`}>
                  Infographics
                </h3>
                <p className={`text-sm ${selectedType === 'infographic' ? 'text-purple-100' : 'text-gray-600'}`}>
                  10 credits each
                </p>
              </div>
              {selectedType === 'infographic' && (
                <CheckCircle2 className="w-6 h-6 text-white" />
              )}
            </div>
          </button>
        </div>

        {/* Template Download */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Need a template?</h3>
              <p className="text-indigo-100">
                {selectedType === 'blog'
                  ? 'Download CSV template with title and content columns'
                  : 'Download CSV template with content column'}
              </p>
            </div>
            <button
              onClick={downloadTemplate}
              className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Template
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200/50 p-8 mb-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enter Your Data</h3>
            <p className="text-gray-600">
              {selectedType === 'blog'
                ? 'Enter one item per line in format: Title, Content'
                : 'Enter one content item per line'}
            </p>
          </div>

          <textarea
            value={bulkData}
            onChange={(e) => setBulkData(e.target.value)}
            placeholder={
              selectedType === 'blog'
                ? 'Example Blog Title, Blog post content\nAnother Title, More content here'
                : 'First infographic content\nSecond infographic content'
            }
            rows={10}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
          />

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Items to Process</p>
              <p className="text-2xl font-bold text-gray-900">
                {bulkData.trim().split('\n').filter(line => line.trim()).length}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Credits Needed</p>
              <p className="text-2xl font-bold text-gray-900">{totalCreditsNeeded}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Your Credits</p>
              <p className={`text-2xl font-bold ${hasEnoughCredits ? 'text-green-600' : 'text-red-600'}`}>
                {user?.credits || 0}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleProcess}
            disabled={isProcessing || !bulkData.trim() || !hasEnoughCredits}
            className="w-full mt-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing... {progress.completed}/{progress.total}
              </>
            ) : (
              <>
                <Zap className="w-6 h-6" />
                Start Bulk Processing
              </>
            )}
          </button>

          {!hasEnoughCredits && bulkData.trim() && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Insufficient Credits</p>
                <p className="text-sm text-red-700">
                  You need {totalCreditsNeeded} credits but only have {user?.credits || 0}.
                  Please purchase more credits to continue.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Progress */}
        {isProcessing && (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200/50 p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Processing...</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-300"
                style={{ width: `${(progress.completed / progress.total) * 100}%` }}
              />
            </div>
            <p className="text-center text-gray-600 mt-2">
              {progress.completed} of {progress.total} completed
            </p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200/50 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Results</h3>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 ${
                    result.status === 'success'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {result.title || `Item ${index + 1}`}
                      </p>
                      {result.status === 'error' && (
                        <p className="text-sm text-red-600 mt-1">{result.error}</p>
                      )}
                    </div>
                    {result.status === 'success' ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
