import { MessageSquare, Users, Clock } from 'lucide-react';

type Tab = 'chat' | 'assistants' | 'history';

interface BottomTabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-gray-200 border-t safe-area-bottom">
      <div className="flex items-center justify-around px-4 py-2">
        <button
          onClick={() => onTabChange('chat')}
          className={`flex flex-col items-center gap-1 py-2 px-6 transition-colors ${
            activeTab === 'chat' 
              ? 'text-gray-900'
              : 'text-gray-400'
          }`}
        >
          <MessageSquare 
            className="w-6 h-6" 
            strokeWidth={activeTab === 'chat' ? 2 : 1.5}
          />
          <span className={`text-xs ${activeTab === 'chat' ? 'font-semibold' : 'font-medium'}`}>
            Chat
          </span>
        </button>

        <button
          onClick={() => onTabChange('assistants')}
          className={`flex flex-col items-center gap-1 py-2 px-6 transition-colors ${
            activeTab === 'assistants' 
              ? 'text-gray-900'
              : 'text-gray-400'
          }`}
        >
          <Users 
            className="w-6 h-6" 
            strokeWidth={activeTab === 'assistants' ? 2 : 1.5}
          />
          <span className={`text-xs ${activeTab === 'assistants' ? 'font-semibold' : 'font-medium'}`}>
            Assistants
          </span>
        </button>

        <button
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center gap-1 py-2 px-6 transition-colors ${
            activeTab === 'history' 
              ? 'text-gray-900'
              : 'text-gray-400'
          }`}
        >
          <Clock 
            className="w-6 h-6" 
            strokeWidth={activeTab === 'history' ? 2 : 1.5}
          />
          <span className={`text-xs ${activeTab === 'history' ? 'font-semibold' : 'font-medium'}`}>
            History
          </span>
        </button>
      </div>
    </div>
  );
}