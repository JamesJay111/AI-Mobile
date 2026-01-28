import { X, Check } from 'lucide-react';
import { MODELS } from '../App';

interface ModelSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  isPro: boolean;
}

export function ModelSelector({
  isOpen,
  onClose,
  selectedModel,
  onSelectModel,
  isPro,
}: ModelSelectorProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 shadow-2xl animate-slide-up max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Select Model</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Models Grid */}
        <div className="overflow-y-auto p-4 flex-1">
          <div className="grid grid-cols-2 gap-3">
            {MODELS.map((model) => {
              const isSelected = selectedModel === model.id;
              const isLocked = model.isPro && !isPro;

              return (
                <button
                  key={model.id}
                  onClick={() => onSelectModel(model.id)}
                  className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-[#1a1d2e] bg-[#1a1d2e]/5'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  } ${isLocked ? 'opacity-75' : ''}`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-[#1a1d2e] rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}

                  {isLocked && (
                    <div className="absolute top-3 right-3">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-gray-900">
                        {model.name}
                      </h3>
                      {model.isPro && (
                        <span className="px-1.5 py-0.5 bg-[#1a1d2e] text-white text-[10px] font-medium rounded">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-snug">
                      {model.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {model.speed === 'fast' && (
                        <span className="text-[10px] text-gray-500">⚡ Fast</span>
                      )}
                      {model.speed === 'normal' && (
                        <span className="text-[10px] text-gray-500">🟢 Normal</span>
                      )}
                      {model.speed === 'slow' && (
                        <span className="text-[10px] text-gray-500">🐌 Slow</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Safe Area */}
        <div className="h-6 flex-shrink-0" />
      </div>
    </>
  );
}