import { useState } from 'react';
import { Menu, Sparkles } from 'lucide-react';
import logoImg from '../assets/e3ade1b558b3b6915bbd0aa4817e63d55d1b0cbb.png';

interface AssistantCard {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  category: 'work' | 'social' | 'lifestyle' | 'aiRole';
}

const ASSISTANTS: AssistantCard[] = [
  // Work & Study
  { id: 'email-generator', emoji: '✉️', title: 'Email Generator', subtitle: 'Draft professional emails quickly', category: 'work' },
  { id: 'text-optimizer', emoji: '✨', title: 'Text Optimizer', subtitle: 'Rewrite with perfect tone', category: 'work' },
  { id: 'summary-assistant', emoji: '📝', title: 'Summary Assistant', subtitle: 'Extract key points instantly', category: 'work' },
  { id: 'study-tutor', emoji: '🎓', title: 'Study Tutor', subtitle: 'Learn faster, step by step', category: 'work' },
  { id: 'business-planner', emoji: '💼', title: 'Business Planner', subtitle: 'Provide business planning and growth strategies', category: 'work' },
  { id: 'financial-analyst', emoji: '💰', title: 'Financial Analyst', subtitle: 'Manage your finances and plan for the future', category: 'work' },
  { id: 'lawyer', emoji: '⚖️', title: 'Lawyer', subtitle: 'Legal advice and document support', category: 'work' },
  { id: 'interview-coach', emoji: '🎤', title: 'Interview Coach', subtitle: 'Help you prepare for interviews', category: 'work' },
  { id: 'marketing-expert', emoji: '📊', title: 'Marketing Expert', subtitle: 'Effective strategies to boost your brand', category: 'work' },
  
  // Social Media
  { id: 'instagram-post', emoji: '📸', title: 'Instagram Post Creator', subtitle: 'Engaging posts for your feed', category: 'social' },
  { id: 'instagram-caption', emoji: '💬', title: 'Instagram Caption Writer', subtitle: 'Perfect captions every time', category: 'social' },
  { id: 'facebook-post', emoji: '👍', title: 'Facebook Post Writer', subtitle: 'Share your story effectively', category: 'social' },
  { id: 'tiktok-hook', emoji: '🎬', title: 'TikTok Hook & Caption', subtitle: 'Viral-worthy video descriptions', category: 'social' },
  { id: 'linkedin-post', emoji: '💼', title: 'LinkedIn Post Creator', subtitle: 'Professional thought leadership', category: 'social' },
  { id: 'x-post', emoji: '🐦', title: 'X Post Summarizer', subtitle: 'Turn ideas into sharp posts', category: 'social' },
  
  // Lifestyle
  { id: 'health-coach', emoji: '💪', title: 'Health Coach', subtitle: 'Your personal wellness guide', category: 'lifestyle' },
  { id: 'meal-planner', emoji: '🍽️', title: 'Meal Planner', subtitle: 'Custom nutrition planning', category: 'lifestyle' },
  { id: 'mind-support', emoji: '🧘', title: 'Mind Support', subtitle: 'Emotional wellness companion', category: 'lifestyle' },
  { id: 'astrologer', emoji: '🔮', title: 'Astrologer', subtitle: 'Cosmic insights & guidance', category: 'lifestyle' },
  { id: 'zodiac-master', emoji: '♈', title: 'Zodiac Master', subtitle: 'Signs, traits & compatibility', category: 'lifestyle' },
  { id: 'news-reporter', emoji: '📰', title: 'News Reporter', subtitle: 'Get the latest news and event coverage', category: 'lifestyle' },
  { id: 'travel-guide', emoji: '✈️', title: 'Travel Guide', subtitle: 'Help you plan your trips', category: 'lifestyle' },
  { id: 'chef', emoji: '👨‍🍳', title: 'Chef', subtitle: 'Delicious recipes and cooking tips', category: 'lifestyle' },
];

interface AssistantsScreenProps {
  onMenuClick: () => void;
  onAssistantClick: (assistantId: string) => void;
  isPro: boolean;
  selectedModel: string;
  onProClick: () => void;
  onModelClick: () => void;
}

export function AssistantsScreen({ onMenuClick, onAssistantClick, isPro, selectedModel, onProClick, onModelClick }: AssistantsScreenProps) {
  const [activeCategory, setActiveCategory] = useState<'work' | 'social' | 'lifestyle' | 'aiRole'>('work');

  const filteredAssistants = ASSISTANTS.filter(a => a.category === activeCategory);

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
      <div className="bg-white px-6 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Assistants</h1>
        </div>

        {/* Segmented Control */}
        <div className="overflow-x-auto">
          <div className="inline-flex p-1 bg-[#F5F5F7] rounded-xl">
            <button
              onClick={() => setActiveCategory('work')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === 'work'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Work & Study
            </button>
            <button
              onClick={() => setActiveCategory('social')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === 'social'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Social Media
            </button>
            <button
              onClick={() => setActiveCategory('lifestyle')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === 'lifestyle'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lifestyle
            </button>
            <button
              onClick={() => setActiveCategory('aiRole')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === 'aiRole'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              AI Role Chat
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="grid grid-cols-2 gap-3 pt-3">
          {filteredAssistants.map((assistant) => (
            <button
              key={assistant.id}
              onClick={() => onAssistantClick(assistant.id)}
              className="bg-[#F5F5F7] hover:opacity-90 rounded-2xl p-4 text-left transition-all active:scale-95"
            >
              <div className="flex flex-col h-full">
                <div className="text-3xl mb-3">{assistant.emoji}</div>
                <h3 className="text-base font-semibold mb-1 text-gray-900">
                  {assistant.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {assistant.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}