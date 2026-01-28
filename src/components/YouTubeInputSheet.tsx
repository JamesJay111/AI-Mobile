import { useState } from 'react';
import { Youtube } from 'lucide-react';

interface YouTubeInputSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (url: string) => void;
}

export function YouTubeInputSheet({ isOpen, onClose, onContinue }: YouTubeInputSheetProps) {
  const [url, setUrl] = useState('');

  if (!isOpen) return null;

  const handleContinue = () => {
    if (url.trim()) {
      onContinue(url);
      setUrl('');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto">
          {/* Handle Bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Content */}
          <div className="px-6 pb-8 pt-4">
            {/* Icon and Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                <Youtube className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">YouTube Summary</h2>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              You can add a YouTube URL, and let GemGPT answer your questions or summarize it.
            </p>

            {/* URL Input */}
            <div className="bg-gray-100 rounded-2xl p-6 flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M10 8L16 12L10 16V8Z" fill="#1a1d2e"/>
                  <circle cx="12" cy="12" r="10" stroke="#1a1d2e" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your YouTube link"
                className="flex-1 bg-transparent text-gray-800 text-base placeholder-gray-400 outline-none"
              />
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!url.trim()}
              className="w-full bg-[#1a1d2e] hover:bg-[#2d3b6e] transition-colors text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
            >
              Continue
            </button>
          </div>

          {/* Bottom Safe Area */}
          <div className="h-8" />
        </div>
      </div>
    </>
  );
}