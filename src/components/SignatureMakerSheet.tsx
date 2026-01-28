import { useState } from 'react';
import { PenTool } from 'lucide-react';

interface SignatureMakerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (style: string, text: string) => void;
}

const SIGNATURE_STYLES = [
  { id: 'no-style', name: 'No Style' },
  { id: 'business', name: 'Business' },
  { id: 'monogram', name: 'Monogram' },
  { id: 'bold', name: 'Bold' },
  { id: 'classic', name: 'Classic' },
];

export function SignatureMakerSheet({ isOpen, onClose, onContinue }: SignatureMakerSheetProps) {
  const [selectedStyle, setSelectedStyle] = useState('no-style');
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleContinue = () => {
    if (text.trim() && selectedStyle) {
      onContinue(selectedStyle, text);
      setText('');
      setSelectedStyle('no-style');
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
              <div className="w-12 h-12 bg-[#1a1d2e]/10 rounded-xl flex items-center justify-center">
                <PenTool className="w-7 h-7 text-[#1a1d2e]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Signature Maker</h2>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Create your own custom signature with AI. Choose a style and enter your name or text.
            </p>

            {/* Text Input */}
            <div className="bg-gray-100 rounded-2xl p-6 flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <PenTool className="w-6 h-6 text-[#1a1d2e]" />
              </div>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your name"
                className="flex-1 bg-transparent text-gray-800 text-base placeholder-gray-400 outline-none"
              />
            </div>

            {/* Style Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Style</h3>
              <div className="grid grid-cols-5 gap-3">
                {SIGNATURE_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`flex-shrink-0 flex flex-col items-center gap-2 transition-all ${
                      selectedStyle === style.id ? 'opacity-100' : 'opacity-60'
                    }`}
                  >
                    <div
                      className={`w-full aspect-square rounded-2xl bg-white flex items-center justify-center border-2 transition-all ${
                        selectedStyle === style.id
                          ? 'border-gray-900 ring-2 ring-gray-300'
                          : 'border-gray-200'
                      }`}
                    />
                    <span
                      className={`text-xs font-medium text-center ${
                        selectedStyle === style.id ? 'text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      {style.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!text.trim() || !selectedStyle}
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
