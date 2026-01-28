import { Menu, MessageSquare, Clock, ImageIcon } from 'lucide-react';
import logoImg from '../assets/e3ade1b558b3b6915bbd0aa4817e63d55d1b0cbb.png';

interface HistoryItem {
  id: string;
  title: string;
  timestamp: number;
  type: 'chat' | 'assistant' | 'image';
}

interface HistoryScreenProps {
  onMenuClick: () => void;
  onStartChat: () => void;
  onHistoryItemClick: (id: string) => void;
  historyItems: HistoryItem[];
  isPro: boolean;
  selectedModel: string;
  onProClick: () => void;
  onModelClick: () => void;
}

export function HistoryScreen({ 
  onMenuClick, 
  onStartChat, 
  onHistoryItemClick, 
  historyItems,
  isPro,
  selectedModel,
  onProClick,
  onModelClick
}: HistoryScreenProps) {
  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top Navigation Bar */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity overflow-hidden"
          >
            <img src={logoImg} alt="GemGPT" className="w-full h-full object-contain" />
          </button>
          <span className="font-semibold text-lg text-[#1a1d2e]">GemGPT</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onProClick}
            className="px-3 py-1.5 bg-gradient-to-r from-[#2d3b6e] to-[#1a1d2e] text-white text-xs font-medium rounded-full flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0L10.472 5.528L16 8L10.472 10.472L8 16L5.528 10.472L0 8L5.528 5.528L8 0Z" />
            </svg>
            PRO
          </button>

          <button
            onClick={onModelClick}
            className="text-sm font-medium text-gray-700 flex items-center gap-1 hover:text-gray-900 transition-colors"
          >
            {selectedModel}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 8L2 4H10L6 8Z" />
            </svg>
          </button>

          <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">History</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-24">
        {historyItems.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center text-center max-w-sm">
            <div className="w-20 h-20 rounded-full bg-[#F5F5F7] flex items-center justify-center mb-6">
              <Clock className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              Nothing here yet
            </h2>
            <p className="text-base mb-8 text-gray-500">
              Your saved chats will appear here
            </p>
            <button
              onClick={onStartChat}
              className="px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors active:scale-95"
            >
              Start Chatting
            </button>
          </div>
        ) : (
          // List State
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-[#F5F5F7] rounded-3xl overflow-hidden">
              {historyItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => onHistoryItemClick(item.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 hover:opacity-90 transition-opacity text-left ${
                    index !== historyItems.length - 1 
                      ? 'border-b border-gray-200'
                      : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    {item.type === 'image' ? (
                      <ImageIcon className="w-5 h-5 text-gray-600" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 truncate">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatTimestamp(item.timestamp)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}