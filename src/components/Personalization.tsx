import { X, ChevronRight, Lock } from 'lucide-react';

interface PersonalizationProps {
  isPro: boolean;
  onClose: () => void;
  onUpgradeToPro: () => void;
}

export function Personalization({ isPro, onClose, onUpgradeToPro }: PersonalizationProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Personalization</h1>
        <div className="w-9" />
      </div>

      <div className="p-4 space-y-4">
        {/* Custom Instructions */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left">
            <span className="flex-1 text-sm font-medium text-gray-900">Custom Instructions</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Memory */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <button
            onClick={isPro ? undefined : onUpgradeToPro}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm font-medium text-gray-900">Memory</span>
              {!isPro && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-[#2d3b6e] to-[#1a1d2e] text-white text-[10px] font-medium rounded">
                  PRO
                </span>
              )}
            </div>
            {!isPro ? (
              <Lock className="w-5 h-5 text-gray-400" />
            ) : (
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1a1d2e]"></div>
              </div>
            )}
          </button>
        </div>

        {/* Description */}
        <div className="px-2 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            As you chat, GemGPT becomes more useful. It captures details and preferences to tailor your responses as you customize.
          </p>

          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              Want GemGPT to remember what you teach it or be reminded to chat:
            </p>
            <ul className="space-y-2 pl-4">
              <li className="text-sm text-gray-600 list-disc">
                "Remember I like simple answers."
              </li>
              <li className="text-sm text-gray-600 list-disc">
                "Did you remember what I told you about me?"
              </li>
            </ul>
          </div>
        </div>

        {/* Manage Memory */}
        {isPro && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left">
              <span className="flex-1 text-sm font-medium text-gray-900">Manage Memory</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Safe Area */}
      <div className="h-8" />
    </div>
  );
}