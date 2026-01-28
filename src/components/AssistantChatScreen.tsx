import { useState, useRef, useEffect } from 'react';
import { Menu, Send, Plus, Mic } from 'lucide-react';
import { MODELS } from '../App';
import logoImg from '../assets/e3ade1b558b3b6915bbd0aa4817e63d55d1b0cbb.png';

const ASSISTANT_INFO: Record<
  string,
  { name: string; emoji: string; welcomeText: string }
> = {
  'email-generator': { name: 'Email Generator', emoji: '✉️', welcomeText: "Tell me who you're emailing, the goal, and the tone. I'll draft it." },
  'text-optimizer': { name: 'Text Optimizer', emoji: '✨', welcomeText: "Paste your text and the tone you want. I'll rewrite it." },
  'summary-assistant': { name: 'Summary Assistant', emoji: '📝', welcomeText: "Send the text. I'll summarize the key points." },
  'study-tutor': { name: 'Study Tutor', emoji: '🎓', welcomeText: "What are you learning and what's your level? I'll help step by step." },
  'business-planner': { name: 'Business Planner', emoji: '💼', welcomeText: "Tell me about your business idea or challenge. I'll help with planning and growth strategies." },
  'financial-analyst': { name: 'Financial Analyst', emoji: '💰', welcomeText: "Share your financial goals or concerns. I'll help you plan and manage effectively." },
  'lawyer': { name: 'Lawyer', emoji: '⚖️', welcomeText: "Describe your legal question or document need. I'll provide guidance and support." },
  'interview-coach': { name: 'Interview Coach', emoji: '🎤', welcomeText: "What's the role and company? I'll help you prepare for your interview." },
  'marketing-expert': { name: 'Marketing Expert', emoji: '📊', welcomeText: "Tell me about your brand and goals. I'll suggest effective marketing strategies." },
  'instagram-post': { name: 'Instagram Post Creator', emoji: '📸', welcomeText: "What's the topic and audience? I'll draft an IG post." },
  'instagram-caption': { name: 'Instagram Caption Writer', emoji: '💬', welcomeText: "Describe the photo and vibe. I'll write caption options." },
  'facebook-post': { name: 'Facebook Post Writer', emoji: '👍', welcomeText: "What do you want to share? I'll write a Facebook post." },
  'tiktok-hook': { name: 'TikTok Hook & Caption', emoji: '🎬', welcomeText: "Describe your video goal. I'll suggest hooks and captions." },
  'linkedin-post': { name: 'LinkedIn Post Creator', emoji: '💼', welcomeText: "What's the key insight? I'll craft a LinkedIn post." },
  'x-post': { name: 'X Post Summarizer', emoji: '🐦', welcomeText: "Paste your long text. I'll turn it into a short X post." },
  'health-coach': { name: 'Health Coach', emoji: '💪', welcomeText: "What's your health goal and current routine?" },
  'meal-planner': { name: 'Meal Planner', emoji: '🍽️', welcomeText: "Your goal, diet preferences, and schedule? I'll plan meals." },
  'mind-support': { name: 'Mind Support', emoji: '🧘', welcomeText: "What's on your mind right now?" },
  'astrologer': { name: 'Astrologer', emoji: '🔮', welcomeText: "Ask your question. Birth details are optional." },
  'zodiac-master': { name: 'Zodiac Master', emoji: '♈', welcomeText: "Tell me the zodiac signs. I'll explain traits and compatibility." },
  'news-reporter': { name: 'News Reporter', emoji: '📰', welcomeText: "What topic or event are you interested in? I'll provide the latest coverage." },
  'travel-guide': { name: 'Travel Guide', emoji: '✈️', welcomeText: "Where are you planning to go? I'll help you plan your perfect trip." },
  'chef': { name: 'Chef', emoji: '👨‍🍳', welcomeText: "What ingredients do you have or what cuisine interests you? I'll share recipes and cooking tips." },
};

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

interface AssistantChatScreenProps {
  assistantId: string;
  selectedModel: string;
  isPro: boolean;
  onMenuClick: () => void;
  onModelClick: () => void;
  onProClick: () => void;
  onAddToHistory: (title: string, type: 'chat' | 'assistant') => void;
  onBack: () => void;
}

export function AssistantChatScreen({ 
  assistantId, 
  selectedModel,
  isPro,
  onMenuClick,
  onModelClick,
  onProClick,
  onAddToHistory,
  onBack 
}: AssistantChatScreenProps) {
  const assistant = ASSISTANT_INFO[assistantId];
  const model = MODELS.find(m => m.id === selectedModel);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: assistant?.welcomeText || "Hello! How can I help you?",
      isUser: false,
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Add to history on first user message
    if (messages.length === 1) {
      const historyTitle = input.length > 30 ? input.substring(0, 30) + '...' : input;
      onAddToHistory(historyTitle, 'assistant');
    }

    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm processing your request. This is a placeholder response until assistant chat is wired to the backend.",
        isUser: false,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  if (!assistant) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header - Same as ChatScreen */}
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
              <path d="M8 0L10.472 5.528L16 8L10.472 10.472L8 16L5.528 10.472L0 8L5.528 5.528L8 0Z"/>
            </svg>
            PRO
          </button>

          <button
            onClick={onModelClick}
            className="text-sm font-medium text-gray-700 flex items-center gap-1 hover:text-gray-900 transition-colors"
          >
            {model?.name || 'GPT 5.1 Instant'}
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
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isUser && (
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                {assistant.emoji}
              </div>
            )}
            <div className="flex flex-col gap-2 max-w-[85%]">
              {!message.isUser && (
                <span className="text-sm font-medium text-gray-900">{assistant.name}</span>
              )}
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.isUser
                    ? 'bg-[#1a1d2e] text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                <p className="text-[15px] leading-relaxed">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Send a message to GemGPT"
              className="flex-1 bg-transparent text-[15px] text-gray-800 placeholder-gray-400 outline-none"
            />

            <button className="flex-shrink-0 hover:opacity-70 transition-opacity">
              <Mic className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-14 h-14 bg-[#00A67E] rounded-[18px] transition-all flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#00957a] flex items-center justify-center shadow-sm"
          >
            <Send className="w-6 h-6 text-white" fill="white" />
          </button>
        </div>
      </div>
    </div>
  );
}