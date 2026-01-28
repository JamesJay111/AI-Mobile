import { useState } from 'react';
import { Menu, Send, Plus, Mic, Loader2, AlertCircle } from 'lucide-react';
import { MODELS, Mode } from '../App';
import { ImagePickerSheet } from './ImagePickerSheet';
import { ImageGenerationModal } from './ImageGenerationModal';
import { chatCompletion, getOpenRouterModelId as getModelId } from '../services/openRouter';
import { getCurrentUserId } from '../utils/user';
import artGeneratorImg from '../assets/d1dab51735c85217302220e13fa75e98768a7179.png';
import logoImg from '../assets/e3ade1b558b3b6915bbd0aa4817e63d55d1b0cbb.png';

interface ChatScreenProps {
  mode: Mode;
  selectedModel: string;
  isPro: boolean;
  onMenuClick: () => void;
  onModelClick: () => void;
  onAttachmentClick: () => void;
  onProClick: () => void;
  onArtGeneratorClick: () => void;
  onPDFClick: () => void;
  onYoutubeClick: () => void;
  onRoleChatClick: () => void;
  onSignatureMakerClick: () => void;
  onLogoGeneratorClick: () => void;
  onTattooGeneratorClick: () => void;
  onWebSearchClick: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ChatScreen({
  mode,
  selectedModel,
  isPro,
  onMenuClick,
  onModelClick,
  onAttachmentClick,
  onProClick,
  onArtGeneratorClick,
  onPDFClick,
  onYoutubeClick,
  onRoleChatClick,
  onSignatureMakerClick,
  onLogoGeneratorClick,
  onTattooGeneratorClick,
  onWebSearchClick,
}: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: mode === 'chat'
        ? "Hi! I'm your AI assistant. I can help answer questions, generate images, and explore ideas with you. What would you like to do today?"
        : "I can help you create beautiful images using AI. Describe what you want to generate.",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [isImageGenerationModalOpen, setIsImageGenerationModalOpen] = useState(false);

  const model = MODELS.find(m => m.id === selectedModel);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    // Add loading message
    const loadingMessageId = (Date.now() + 1).toString();
    const loadingMessage: Message = {
      id: loadingMessageId,
      role: 'assistant',
      content: '',
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Get OpenRouter model ID
      const openRouterModelId = getModelId(selectedModel);
      
      // Prepare messages for API
      const apiMessages = [
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: inputValue }
      ];

      // Call OpenRouter API via Firebase Function
      const response = await chatCompletion({
        messages: apiMessages,
        modelId: openRouterModelId,
        userId: getCurrentUserId(),
        isPro: isPro,
        stream: false
      });

      if (response.success && response.data?.choices?.[0]?.message?.content) {
        // Update loading message with actual response
        setMessages(prev => prev.map(msg => 
          msg.id === loadingMessageId
            ? { ...msg, content: response.data!.choices[0].message.content }
            : msg
        ));
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to send message. Please try again.');
      // Remove loading message on error
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = async (title: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: title,
    };

    setMessages([...messages, userMessage]);
    setIsLoading(true);
    setError(null);

    const loadingMessageId = (Date.now() + 1).toString();
    const loadingMessage: Message = {
      id: loadingMessageId,
      role: 'assistant',
      content: '',
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const openRouterModelId = getModelId(selectedModel);
      const apiMessages = [
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: title }
      ];

      const response = await chatCompletion({
        messages: apiMessages,
        modelId: openRouterModelId,
        userId: getCurrentUserId(),
        isPro: isPro,
        stream: false
      });

      if (response.success && response.data?.choices?.[0]?.message?.content) {
        setMessages(prev => prev.map(msg => 
          msg.id === loadingMessageId
            ? { ...msg, content: response.data!.choices[0].message.content }
            : msg
        ));
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to send message. Please try again.');
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
    } finally {
      setIsLoading(false);
    }
  };

  // Image generation handled inside ImageGenerationModal now

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
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
            {model?.name}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 8L2 4H10L6 8Z"/>
            </svg>
          </button>

          <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Messages / Middle Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-8 pb-4">
        {messages.length === 1 ? (
          // First time user experience - Conversion focused content
          <div className="space-y-8 pb-20">
            {/* Section 1: Help with any task - Horizontal Scroll */}
            <div className="px-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-5">Help With Any Task</h2>
              
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {/* Unit 1: Image Generation - Large Single Card */}
                <button
                  onClick={() => setIsImageGenerationModalOpen(true)}
                  className="flex-shrink-0 w-[280px] h-[250px] bg-[#F5F5F7] rounded-[24px] p-6 text-left hover:opacity-90 active:scale-[0.98] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="text-4xl mb-3">🎨</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Image Generation</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Turn text into images</p>
                  </div>
                </button>

                {/* Unit 2: Summarize + Social Media - Combined Card */}
                <div className="flex-shrink-0 w-[280px] h-[250px] flex flex-col gap-2.5">
                  <button
                    onClick={() => handleCardClick('Summarize')}
                    className="h-[120px] bg-[#F5F5F7] rounded-[18px] p-4 text-left hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    <div className="text-3xl mb-2">📷</div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Summarize</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">Extract key points from text or photos</p>
                  </button>

                  <button
                    onClick={() => handleCardClick('Social Media')}
                    className="h-[120px] bg-[#F5F5F7] rounded-[18px] p-4 text-left hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    <div className="text-3xl mb-2">💬</div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Social Media</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">Create an engaging post</p>
                  </button>
                </div>

                {/* Unit 3: Writing - Medium Single Card */}
                <button
                  onClick={() => handleCardClick('Writing')}
                  className="flex-shrink-0 w-[240px] h-[250px] bg-[#F5F5F7] rounded-[22px] p-5 text-left hover:opacity-90 active:scale-[0.98] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="text-4xl mb-3">✏️</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Writing</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Write an article or story</p>
                  </div>
                </button>

                {/* Unit 4: PDF Reading + Tattoo Generator - Combined Card */}
                <div className="flex-shrink-0 w-[280px] h-[250px] flex flex-col gap-2.5">
                  <button
                    onClick={onPDFClick}
                    className="h-[120px] bg-[#F5F5F7] rounded-[18px] p-4 text-left hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    <div className="text-3xl mb-2">📄</div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">PDF Reading</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">Upload and analyze PDF documents</p>
                  </button>

                  <button
                    onClick={onTattooGeneratorClick}
                    className="h-[120px] bg-[#F5F5F7] rounded-[18px] p-4 text-left hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    <div className="text-3xl mb-2">🦋</div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Tattoo Generator</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">Design unique tattoo ideas</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Section 2: Topics */}
            <div className="px-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-left">Topics</h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleCardClick('Find movies that make you laugh or scream')}
                  className="w-full bg-[#F5F5F7] rounded-[16px] px-5 py-4 flex items-center justify-between hover:opacity-90 active:scale-[0.99] transition-all"
                >
                  <span className="text-[15px] text-gray-900 font-medium text-left flex-1">Find movies that make you laugh or scream</span>
                  <span className="text-xl ml-3 flex-shrink-0">🎬</span>
                </button>

                <button
                  onClick={() => handleCardClick('Create a Halloween pumpkin everyone will love')}
                  className="w-full bg-[#F5F5F7] rounded-[16px] px-5 py-4 flex items-center justify-between hover:opacity-90 active:scale-[0.99] transition-all"
                >
                  <span className="text-[15px] text-gray-900 font-medium text-left flex-1">Create a Halloween pumpkin everyone will love</span>
                  <span className="text-xl ml-3 flex-shrink-0">🎃</span>
                </button>

                <button
                  onClick={() => handleCardClick('Discover scary-looking but delicious desserts')}
                  className="w-full bg-[#F5F5F7] rounded-[16px] px-5 py-4 flex items-center justify-between hover:opacity-90 active:scale-[0.99] transition-all"
                >
                  <span className="text-[15px] text-gray-900 font-medium text-left flex-1">Discover scary-looking but delicious desserts</span>
                  <span className="text-xl ml-3 flex-shrink-0">🧁</span>
                </button>

                <button
                  onClick={() => handleCardClick('Build the perfect playlist for a spooky night')}
                  className="w-full bg-[#F5F5F7] rounded-[16px] px-5 py-4 flex items-center justify-between hover:opacity-90 active:scale-[0.99] transition-all"
                >
                  <span className="text-[15px] text-gray-900 font-medium text-left flex-1">Build the perfect playlist for a spooky night</span>
                  <span className="text-xl ml-3 flex-shrink-0">🎵</span>
                </button>

                <button
                  onClick={() => handleCardClick('Turn your home into a Halloween mystery')}
                  className="w-full bg-[#F5F5F7] rounded-[16px] px-5 py-4 flex items-center justify-between hover:opacity-90 active:scale-[0.99] transition-all"
                >
                  <span className="text-[15px] text-gray-900 font-medium text-left flex-1">Turn your home into a Halloween mystery</span>
                  <span className="text-xl ml-3 flex-shrink-0">🕸️</span>
                </button>

                <button
                  onClick={() => handleCardClick('Plan the perfect Halloween outfit for your pet')}
                  className="w-full bg-[#F5F5F7] rounded-[16px] px-5 py-4 flex items-center justify-between hover:opacity-90 active:scale-[0.99] transition-all"
                >
                  <span className="text-[15px] text-gray-900 font-medium text-left flex-1">Plan the perfect Halloween outfit for your pet</span>
                  <span className="text-xl ml-3 flex-shrink-0">🐾</span>
                </button>

                <button
                  onClick={() => handleCardClick('Create a step-by-step plan to grow wealth')}
                  className="w-full bg-[#F5F5F7] rounded-[16px] px-5 py-4 flex items-center justify-between hover:opacity-90 active:scale-[0.99] transition-all"
                >
                  <span className="text-[15px] text-gray-900 font-medium text-left flex-1">Create a step-by-step plan to grow wealth</span>
                  <span className="text-xl ml-3 flex-shrink-0">💰</span>
                </button>

                <button
                  onClick={() => handleCardClick('Get a daily dose of happiness and humor')}
                  className="w-full bg-[#F5F5F7] rounded-[16px] px-5 py-4 flex items-center justify-between hover:opacity-90 active:scale-[0.99] transition-all"
                >
                  <span className="text-[15px] text-gray-900 font-medium text-left flex-1">Get a daily dose of happiness and humor</span>
                  <span className="text-xl ml-3 flex-shrink-0">😊</span>
                </button>

                <button
                  onClick={() => handleCardClick('Find answers to life\'s big questions')}
                  className="w-full bg-[#F5F5F7] rounded-[16px] px-5 py-4 flex items-center justify-between hover:opacity-90 active:scale-[0.99] transition-all"
                >
                  <span className="text-[15px] text-gray-900 font-medium text-left flex-1">Find answers to life's big questions</span>
                  <span className="text-xl ml-3 flex-shrink-0">🤔</span>
                </button>

                <button
                  onClick={() => handleCardClick('Explore delicious Easter brunch ideas')}
                  className="w-full bg-[#F5F5F7] rounded-[16px] px-5 py-4 flex items-center justify-between hover:opacity-90 active:scale-[0.99] transition-all"
                >
                  <span className="text-[15px] text-gray-900 font-medium text-left flex-1">Explore delicious Easter brunch ideas</span>
                  <span className="text-xl ml-3 flex-shrink-0">🍞</span>
                </button>

                <button
                  onClick={() => handleCardClick('Learn the secrets to perfect sleep')}
                  className="w-full bg-[#F5F5F7] rounded-[16px] px-5 py-4 flex items-center justify-between hover:opacity-90 active:scale-[0.99] transition-all"
                >
                  <span className="text-[15px] text-gray-900 font-medium text-left flex-1">Learn the secrets to perfect sleep</span>
                  <span className="text-xl ml-3 flex-shrink-0">😴</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Conversation mode - show messages
          <div className="space-y-3">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800 text-sm underline"
                >
                  Dismiss
                </button>
              </div>
            )}
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
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-[#1a1d2e] text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    {message.content ? (
                      <p className="text-[15px] leading-relaxed">{message.content}</p>
                    ) : (
                      // Loading state
                      <div className="flex gap-2 py-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 pb-20">
        <div className="flex items-center gap-3">
          {/* Input Container with integrated buttons */}
          <div className="flex-1 bg-gray-50 rounded-[2rem] px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setIsImagePickerOpen(true)}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <Plus className="w-6 h-6 text-gray-600" />
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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
            disabled={!inputValue.trim() || isLoading}
            className="w-14 h-14 bg-[#00A67E] rounded-[18px] transition-all flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#00957a] active:scale-95 flex items-center justify-center shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Send className="w-6 h-6 text-white" fill="white" />
            )}
          </button>
        </div>
      </div>

      {/* Image Picker Sheet */}
      <ImagePickerSheet
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onSelectFromGallery={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              console.log('Selected from gallery:', file);
              // Handle image upload logic here
            }
          };
          input.click();
        }}
        onTakePhoto={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.capture = 'environment';
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              console.log('Took photo:', file);
              // Handle camera capture logic here
            }
          };
          input.click();
        }}
      />

      {/* Image Generation Modal */}
      <ImageGenerationModal
        isOpen={isImageGenerationModalOpen}
        onClose={() => setIsImageGenerationModalOpen(false)}
        isPro={isPro}
        onProClick={onProClick}
      />
    </div>
  );
}