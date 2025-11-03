import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Image as ImageIcon, BarChart3, Zap, CheckCircle2, AlertCircle, Package } from 'lucide-react';
import { User } from '../lib/supabase';
import { ImprovedImageForm } from './ImprovedImageForm';

interface BulkProcessPageProps {
  user: User | null;
  onBulkProcess: (data: any[]) => Promise<void>;
}

interface BulkItem {
  id: string;
  type: 'blog' | 'infographic';
  data: any;
  isExpanded: boolean;
}

export const BulkProcessPage: React.FC<BulkProcessPageProps> = ({ user, onBulkProcess }) => {
  const [selectedType, setSelectedType] = useState<'blog' | 'infographic'>('blog');
  const [items, setItems] = useState<BulkItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [results, setResults] = useState<any[]>([]);

  const addItem = () => {
    const newItem: BulkItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      type: selectedType,
      data: {},
      isExpanded: true
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
    ));
  };

  const updateItemData = (id: string, data: any) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, data } : item
    ));
  };

  const handleBulkProcess = async () => {
    if (items.length === 0) return;

    setIsProcessing(true);
    setProgress({ completed: 0, total: items.length });
    setResults([]);

    const processedResults = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      try {
        processedResults.push({
          id: item.id,
          status: 'success',
          type: item.type,
          title: item.data.title || `Item ${i + 1}`
        });

        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        processedResults.push({
          id: item.id,
          status: 'error',
          error: (error as Error).message,
          type: item.type,
          title: item.data.title || `Item ${i + 1}`
        });
      }

      setProgress({ completed: i + 1, total: items.length });
      setResults([...processedResults]);
    }

    setIsProcessing(false);
  };

  const creditsPerImage = selectedType === 'blog' ? 5 : 10;
  const totalCreditsNeeded = items.length * creditsPerImage;
  const hasEnoughCredits = user && user.credits >= totalCreditsNeeded;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-10 h-10 text-emerald-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Bulk Processing
            </h1>
          </div>
          <p className="text-gray-600">Create multiple images at once with individual form controls</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setSelectedType('blog')}
            disabled={isProcessing}
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
            disabled={isProcessing}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Items to Process</p>
            <p className="text-3xl font-bold text-gray-900">{items.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Credits Needed</p>
            <p className="text-3xl font-bold text-gray-900">{totalCreditsNeeded}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Your Credits</p>
            <p className={`text-3xl font-bold ${hasEnoughCredits ? 'text-green-600' : 'text-red-600'}`}>
              {user?.credits || 0}
            </p>
          </div>
        </div>

        <button
          onClick={addItem}
          disabled={isProcessing}
          className="w-full mb-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus className="w-6 h-6" />
          Add {selectedType === 'blog' ? 'Blog Image' : 'Infographic'} Item
        </button>

        {items.length > 0 && (
          <div className="space-y-4 mb-8">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-lg border border-gray-200/50 overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                      item.type === 'blog' ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'
                    } flex items-center justify-center`}>
                      {item.type === 'blog' ? (
                        <ImageIcon className="w-6 h-6 text-white" />
                      ) : (
                        <BarChart3 className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Item {index + 1} - {item.type === 'blog' ? 'Blog Image' : 'Infographic'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.data.title || 'No title yet'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      disabled={isProcessing}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    {item.isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                </div>

                {item.isExpanded && (
                  <div className="p-8">
                    <ImprovedImageForm
                      imageType={item.type}
                      onSubmit={(data) => updateItemData(item.id, data)}
                      isLoading={false}
                      disabled={isProcessing}
                      user={user}
                      setShowAccountPanel={() => {}}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="mb-8">
            <button
              onClick={handleBulkProcess}
              disabled={isProcessing || items.length === 0 || !hasEnoughCredits}
              className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing... {progress.completed}/{progress.total}
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6" />
                  Process All {items.length} Items
                </>
              )}
            </button>

            {!hasEnoughCredits && items.length > 0 && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
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
        )}

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

        {results.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200/50 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Results</h3>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className={`p-4 rounded-xl border-2 ${
                    result.status === 'success'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {result.title} ({result.type})
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

        {items.length === 0 && !isProcessing && results.length === 0 && (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200/50 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Items Added Yet</h3>
            <p className="text-gray-600 mb-6">
              Click "Add Item" above to start creating multiple {selectedType === 'blog' ? 'blog images' : 'infographics'} at once
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
