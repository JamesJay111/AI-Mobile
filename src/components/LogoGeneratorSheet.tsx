import { useState } from 'react';

interface LogoGeneratorSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (style: string, text: string) => void;
}

const TATTOO_STYLES = [
  { id: 'biomechanical', name: 'Biomechanical' },
  { id: 'flame-design', name: 'Flame Design' },
  { id: 'geometric-tattoo', name: 'Geometric Tattoo' },
];

export function LogoGeneratorSheet({ isOpen, onClose, onContinue }: LogoGeneratorSheetProps) {
  const [selectedStyle, setSelectedStyle] = useState('biomechanical');
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleContinue = () => {
    if (text.trim() && selectedStyle) {
      onContinue(selectedStyle, text);
      setText('');
      setSelectedStyle('biomechanical');
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
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M12 12v9" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Tattoo Generator</h2>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Create unique tattoo designs with AI. Choose a style and describe your tattoo idea.
            </p>

            {/* Text Input */}
            <div className="bg-gray-100 rounded-2xl p-6 flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M12 12v9" />
                </svg>
              </div>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe your tattoo idea"
                className="flex-1 bg-transparent text-gray-800 text-base placeholder-gray-400 outline-none"
              />
            </div>

            {/* Style Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Style</h3>
              <div className="grid grid-cols-3 gap-3">
                {TATTOO_STYLES.map((style) => (
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