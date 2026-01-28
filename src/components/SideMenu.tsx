import { X, PenSquare, User, Settings } from 'lucide-react';

export interface ChatHistory {
  id: string;
  title: string;
  timestamp: number;
  type: 'chat' | 'pdf' | 'youtube' | 'art';
}

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onPersonalization: () => void;
  onSettings: () => void;
  chatHistory: ChatHistory[];
  onHistoryItemClick: (id: string) => void;
}

export function SideMenu({
  isOpen,
  onClose,
  onNewChat,
  onPersonalization,
  onSettings,
  chatHistory,
  onHistoryItemClick,
}: SideMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Floating Menu Card */}
      <div className="fixed top-16 right-4 w-[280px] bg-white rounded-3xl shadow-2xl z-50 animate-scale-in overflow-hidden flex flex-col">
        {/* Free Quota Section */}
        <div className="px-6 py-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">Free Quota Remaining</span>
            <div className="px-2 py-0.5 bg-green-100 rounded-full">
              <span className="text-xs font-bold text-green-700">5/5</span>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '100%' }} />
          </div>
          <p className="text-xs text-gray-500 mt-1.5">Daily limit resets in 18h</p>
        </div>
        
        {/* Menu Items */}
        <div className="py-2">
          <button
            onClick={onNewChat}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
          >
            <span className="text-base text-gray-900">New Chat</span>
            <PenSquare className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
          </button>

          <button
            onClick={onPersonalization}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
          >
            <span className="text-base text-gray-900">Personalization</span>
            <User className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
          </button>

          <button
            onClick={onSettings}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
          >
            <span className="text-base text-gray-900">Settings</span>
            <Settings className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </>
  );
}