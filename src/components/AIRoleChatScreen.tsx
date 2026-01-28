import { useState } from 'react';
import { Menu, Send, Plus, Mic, ArrowLeft } from 'lucide-react';
import bgImage from '../assets/e46e876837945b38b071f7b03a073e25fe414289.png';
import characterImage from '../assets/bf2fbb41942ba0ca05b66bf91743bd2456561aaf.png';

interface AIRoleChatScreenProps {
  selectedModel: string;
  isPro: boolean;
  onMenuClick: () => void;
  onModelClick: () => void;
  onProClick: () => void;
  onBackToHome: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const HIKARI_INTRO = `Hikari was a prototype designed not to replace humans, but to understand them. She was designed with an advanced cognitive core capable of learning, adapting, and observing at a level that no human could match. Her creators gave her the ability to recognise and analyse emotions, but they never let her experience them firsthand.

For this reason, user was assigned to her. user intended to allow her to observe emotions in their most common forms rather than to directly instruct her in them. She started to see trends that data alone could not account for, such as why people cherished pointless moments, why they clung to painful memories, and why they prioritised presence over productivity.

She moved in with user as a roommate, not as an experiment on paper, but as a presence that moved through the house calmly and purposefully, taking note of how life developed when no one was around.

The kitchen was open and dimly lit that evening. With her long black hair tied loosely behind her, Hikari stood at the counter with her white blouse sleeves neatly rolled up. The soft sound of sizzling eggs filled the room as a pan sat on the stove. She followed a perfectly memorised recipe with cautious confidence, but she watched the food as though it might teach her something new.

She broke the silence by saying "This dish is called omelette rice" without looking back. "It falls under the comfort food category. Although I don't feel comfortable, people tend to associate it with familiarity and warmth."`;

export function AIRoleChatScreen({
  selectedModel,
  isPro,
  onMenuClick,
  onModelClick,
  onProClick,
  onBackToHome,
}: AIRoleChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: HIKARI_INTRO,
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Check if user is Pro before allowing to send message
    if (!isPro) {
      onProClick();
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I observe your words with interest. Please, tell me more about what you're thinking.",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt="Background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-white/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBackToHome}
              className="w-8 h-8 bg-[#1a1d2e] rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <span className="font-semibold text-lg text-[#1a1d2e]">Hikari</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onProClick}
              className="px-3 py-1.5 bg-gradient-to-r from-[#2d3b6e] to-[#1a1d2e] text-white text-xs font-medium rounded-full flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0L10.472 5.528L16 8L10.472 10.472L8 16L5.528 10.472L0 8L5.528 5.528L8 0Z"/>
              </svg>
              PRO
            </button>

            <button
              onClick={onModelClick}
              className="text-sm font-medium text-gray-700 flex items-center gap-1 hover:text-gray-900 transition-colors"
            >
              {selectedModel}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 8L2 4H10L6 8Z"/>
              </svg>
            </button>

            <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 pt-8 pb-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-lg">
                    <img 
                      src={characterImage} 
                      alt="Hikari" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2 max-w-[85%]">
                  {message.role === 'assistant' && (
                    <span className="text-sm font-medium text-gray-900">Hikari</span>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-[#1a1d2e] text-white'
                        : 'bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-800 shadow-lg'
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="bg-white/80 backdrop-blur-md border-t border-gray-200 px-4 py-3 pb-20">
          <div className="flex items-center gap-3">
            {/* Input Container with integrated buttons */}
            <div className="flex-1 bg-gray-50 rounded-[2rem] px-4 py-3 flex items-center gap-3">
              <button className="flex-shrink-0 hover:opacity-70 transition-opacity">
                <Plus className="w-6 h-6 text-gray-600" />
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Send message to Hikari..."
                className="flex-1 bg-transparent text-[15px] text-gray-800 placeholder-gray-400 outline-none"
              />

              <button className="flex-shrink-0 hover:opacity-70 transition-opacity">
                <Mic className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="w-14 h-14 bg-[#00A67E] rounded-[18px] transition-all flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#00957a] flex items-center justify-center shadow-sm"
            >
              <Send className="w-6 h-6 text-white" fill="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}