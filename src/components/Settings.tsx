import { X, Search, Smartphone, Grid3x3, RotateCcw, HelpCircle, FileText, Shield, MessageSquare } from 'lucide-react';

interface SettingsProps {
  isPro: boolean;
  onClose: () => void;
  onUpgradeToPro: () => void;
}

export function Settings({ isPro, onClose, onUpgradeToPro }: SettingsProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="px-4 pb-8 pt-4 space-y-4">
        {/* Settings Group 1 */}
        <div className="bg-[#F5F5F7] rounded-3xl overflow-hidden">
          <button className="w-full flex items-center gap-4 px-6 py-4 hover:opacity-90 transition-opacity text-left border-b border-gray-200">
            <Search className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
            <span className="flex-1 text-base text-gray-900">Search Engine</span>
          </button>

          <button className="w-full flex items-center gap-4 px-6 py-4 hover:opacity-90 transition-opacity text-left">
            <Smartphone className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
            <div className="flex-1 flex items-center justify-between">
              <span className="text-base text-gray-900">Haptic feedback</span>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </div>
            </div>
          </button>
        </div>

        {/* Settings Group 2 */}
        <div className="bg-[#F5F5F7] rounded-3xl overflow-hidden">
          <button className="w-full flex items-center gap-4 px-6 py-4 hover:opacity-90 transition-opacity text-left border-b border-gray-200">
            <Grid3x3 className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
            <span className="flex-1 text-base text-gray-900">More of our apps</span>
          </button>

          <button className="w-full flex items-center gap-4 px-6 py-4 hover:opacity-90 transition-opacity text-left border-b border-gray-200">
            <RotateCcw className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
            <span className="flex-1 text-base text-gray-900">Restore purchase</span>
          </button>

          <button className="w-full flex items-center gap-4 px-6 py-4 hover:opacity-90 transition-opacity text-left">
            <HelpCircle className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
            <span className="flex-1 text-base text-gray-900">FAQ</span>
          </button>
        </div>

        {/* Settings Group 3 */}
        <div className="bg-[#F5F5F7] rounded-3xl overflow-hidden">
          <button className="w-full flex items-center gap-4 px-6 py-4 hover:opacity-90 transition-opacity text-left border-b border-gray-200">
            <FileText className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
            <span className="flex-1 text-base text-gray-900">Terms of Service</span>
          </button>

          <button className="w-full flex items-center gap-4 px-6 py-4 hover:opacity-90 transition-opacity text-left border-b border-gray-200">
            <Shield className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
            <span className="flex-1 text-base text-gray-900">Privacy Policy</span>
          </button>

          <button className="w-full flex items-center gap-4 px-6 py-4 hover:opacity-90 transition-opacity text-left">
            <MessageSquare className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
            <span className="flex-1 text-base text-gray-900">Community guidelines</span>
          </button>
        </div>
      </div>
    </div>
  );
}