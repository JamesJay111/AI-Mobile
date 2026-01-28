import { useState, useEffect } from 'react';
import { Menu, Send, Plus, Mic, ArrowLeft } from 'lucide-react';
import generatedImage from '../assets/fc15bbc809b94e6dd7896b5db1f014b30e3ba5b0.png';
import logoImg from '../assets/e3ade1b558b3b6915bbd0aa4817e63d55d1b0cbb.png';

interface ArtChatScreenProps {
  initialPrompt: string;
  selectedModel: string;
  isPro: boolean;
  onMenuClick: () => void;
  onModelClick: () => void;
  onProClick: () => void;
  onBack: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

export function ArtChatScreen({
  initialPrompt,
  selectedModel,
  isPro,
  onMenuClick,
  onModelClick,
  onProClick,
  onBack,
}: ArtChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add user's initial prompt
    const userMessage: Message = {
      id: '1',
      role: 'user',
      content: initialPrompt,
    };
    setMessages([userMessage]);

    // Simulate image generation loading
    setTimeout(() => {
      const aiResponse: Message = {
        id: '2',
        role: 'assistant',
        content: 'Here is your generated image! You can ask me to modify it or create variations.',
        image: generatedImage,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2500);
  }, [initialPrompt]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response with modified image
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I've updated the image based on your request. Let me know if you'd like any other changes!",
        image: generatedImage,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-8 h-8 bg-[#1a1d2e] rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <span className="font-semibold text-lg text-[#1a1d2e]">AI Art</span>
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-8 pb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img src={logoImg} alt="GemGPT" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex flex-col gap-2 max-w-[85%]">
              {message.role === 'assistant' && (
                <span className="text-sm font-medium text-gray-900">GemGPT</span>
              )}
              <div
                className={`rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-[#1a1d2e] text-white px-4 py-3'
                    : ''
                }`}
              >
                {message.image && (
                  <div className="rounded-2xl overflow-hidden mb-2 max-w-[320px]">
                    <img src={message.image} alt="Generated" className="w-full h-auto" />
                  </div>
                )}
                {message.content && (
                  <div className={message.image ? 'bg-white border border-gray-200 rounded-2xl px-4 py-3' : ''}>
                    <p className={`text-[15px] leading-relaxed ${message.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                      {message.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-9 h-9 bg-[#1a1d2e] rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 pb-20">
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
              placeholder="Ask to modify the image..."
              className="flex-1 bg-transparent text-[15px] text-gray-800 placeholder-gray-400 outline-none"
            />

            <button className="flex-shrink-0 hover:opacity-70 transition-opacity">
              <Mic className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="w-14 h-14 bg-[#00A67E] rounded-[18px] transition-all flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#00957a] flex items-center justify-center shadow-sm"
          >
            <Send className="w-6 h-6 text-white" fill="white" />
          </button>
        </div>
      </div>
    </div>
  );
}