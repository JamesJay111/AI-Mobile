import { useState } from 'react';
import { Menu, Image as ImageIcon } from 'lucide-react';
import artSample1 from '../assets/d86a3c2e3ceeac90224c072478089a02a729cd32.png';

interface ArtGeneratorScreenProps {
  selectedModel: string;
  isPro: boolean;
  onMenuClick: () => void;
  onModelClick: () => void;
  onProClick: () => void;
  onContinue: (prompt: string) => void;
  onBackToHome: () => void;
}

export function ArtGeneratorScreen({
  selectedModel,
  isPro,
  onMenuClick,
  onModelClick,
  onProClick,
  onContinue,
  onBackToHome,
}: ArtGeneratorScreenProps) {
  const [prompt, setPrompt] = useState('');

  const handleContinue = () => {
    if (prompt.trim()) {
      onContinue(prompt);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToHome}
            className="w-8 h-8 bg-[#1a1d2e] rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        {/* Back to Home Button */}
        <button
          onClick={onBackToHome}
          className="mb-4 text-sm text-gray-600 flex items-center gap-2 hover:text-gray-900 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Image Generator</h1>

        {/* Description */}
        <p className="text-base text-gray-600 leading-relaxed mb-6">
          Bring your conversations to life with automatically generated visuals. Enter your message and ask GemGPT.
        </p>

        {/* Add Image Button */}
        <button className="w-full bg-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:bg-gray-200 transition-colors mb-6">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-gray-600" />
          </div>
          <span className="text-base text-gray-700">Add image (optional)</span>
        </button>

        {/* Prompt Input */}
        <div className="bg-gray-100 rounded-2xl p-5 min-h-[200px] mb-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What would you like to create today?"
            className="w-full h-full bg-transparent text-base text-gray-800 placeholder-gray-500 outline-none resize-none"
            rows={8}
          />
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!prompt.trim()}
          className="w-full bg-gray-300 text-gray-800 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}