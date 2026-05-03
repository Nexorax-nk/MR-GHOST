import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ExtractMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ExtractMemoryModal({ isOpen, onClose, onSuccess }: ExtractMemoryModalProps) {
  const [prNumber, setPrNumber] = useState('');
  const [diff, setDiff] = useState('');
  const [comments, setComments] = useState('');
  const [extracting, setExtracting] = useState(false);

  if (!isOpen) return null;

  const handleExtract = async () => {
    if (!prNumber.trim() || !diff.trim() || !comments.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setExtracting(true);
    toast.info('🤖 Bob is extracting the decision...');

    try {
      const res = await fetch('http://localhost:8000/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diff, comments })
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.success && data.memory) {
        toast.success(`✅ Memory ${data.memory.id} created successfully!`, {
          duration: 4000,
        });
        setPrNumber('');
        setDiff('');
        setComments('');
        onClose();
        onSuccess?.();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (e) {
      console.error(e);
      toast.error('❌ Failed to extract decision. Check if backend is running.');
    }
    setExtracting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#161b22] border-b border-[#30363d] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-100">Extract Decision from Merged PR</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors p-1 hover:bg-[#30363d] rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <p className="text-gray-400 text-sm mb-6">
            Bob will analyze the merged PR and extract the key architectural decision to add to the memory bank.
          </p>

          {/* PR Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              PR Number <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={prNumber}
              onChange={(e) => setPrNumber(e.target.value)}
              placeholder="#210"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Diff */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              PR Diff <span className="text-red-400">*</span>
            </label>
            <textarea
              value={diff}
              onChange={(e) => setDiff(e.target.value)}
              placeholder="+ def new_feature():&#10;+     return 'hello'"
              rows={6}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm resize-none"
            />
          </div>

          {/* Comments */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              PR Comments/Discussion <span className="text-red-400">*</span>
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="We decided to use Redis for caching because..."
              rows={6}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#161b22] border-t border-[#30363d] px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={extracting}
            className="px-4 py-2 bg-[#21262d] border border-[#30363d] text-gray-300 rounded-md hover:bg-[#30363d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleExtract}
            disabled={extracting}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg"
          >
            {extracting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Extracting...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Extract Decision
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
