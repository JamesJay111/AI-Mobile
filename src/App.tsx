import { useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { ChatScreen } from './components/ChatScreen';
import { ArtGeneratorScreen } from './components/ArtGeneratorScreen';
import { ArtChatScreen } from './components/ArtChatScreen';
import { AIRoleChatScreen } from './components/AIRoleChatScreen';
import { AssistantsScreen } from './components/AssistantsScreen';
import { AssistantChatScreen } from './components/AssistantChatScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { BottomTabBar } from './components/BottomTabBar';
import { SideMenu, ChatHistory } from './components/SideMenu';
import { ModelSelector } from './components/ModelSelector';
import { ProPaywall } from './components/ProPaywall';
import { PaymentSuccess } from './components/PaymentSuccess';
import { Settings } from './components/Settings';
import { Personalization } from './components/Personalization';
import { AttachmentSheet } from './components/AttachmentSheet';
import { PDFReadingModal } from './components/PDFReadingModal';
import { YouTubeInputSheet } from './components/YouTubeInputSheet';
import { SignatureMakerSheet } from './components/SignatureMakerSheet';
import { LogoGeneratorSheet } from './components/LogoGeneratorSheet';
import { TattooGeneratorSheet } from './components/TattooGeneratorSheet';
import { ErrorBoundary } from './components/ErrorBoundary';

// Export helper function for model ID conversion
export function getOpenRouterModelId(internalModelId: string): string {
  const model = CHAT_MODELS.find(m => m.id === internalModelId);
  return model?.openRouterId || 'deepseek/deepseek-chat';
}

export type Screen = 'chat' | 'settings' | 'personalization' | 'art-generator' | 'art-chat' | 'pdf-chat' | 'youtube-chat' | 'role-chat' | 'assistant-chat';
export type Tab = 'chat' | 'assistants' | 'history';
export type Mode = 'chat' | 'ai-art';
export type Model = {
  id: string;
  name: string;
  description: string;
  isPro: boolean;
  provider: string;
  speed: 'fast' | 'normal' | 'slow';
  openRouterId: string;
};

export const CHAT_MODELS: Model[] = [
  {
    id: 'gpt-5.1-instant',
    name: 'GPT-5.1 Instant',
    description: 'OpenAI fastest model',
    isPro: true,
    provider: 'OpenAI',
    speed: 'fast',
    openRouterId: 'openai/gpt-4-turbo-2024-04-09' // Placeholder - verify with OpenRouter docs
  },
  {
    id: 'gpt-5.2-instant',
    name: 'GPT-5.2 Instant',
    description: 'Lightning fast responses',
    isPro: true,
    provider: 'OpenAI',
    speed: 'fast',
    openRouterId: 'openai/gpt-4-turbo-2024-04-09' // Placeholder - verify with OpenRouter docs
  },
  {
    id: 'gpt-5.2',
    name: 'GPT-5.2',
    description: 'Most advanced model',
    isPro: true,
    provider: 'OpenAI',
    speed: 'normal',
    openRouterId: 'openai/gpt-4-turbo-2024-04-09' // Placeholder - verify with OpenRouter docs
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Google\'s best model',
    isPro: true,
    provider: 'Google',
    speed: 'normal',
    openRouterId: 'google/gemini-pro-1.5'
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'Research focused',
    isPro: true,
    provider: 'Perplexity',
    speed: 'normal',
    openRouterId: 'perplexity/llama-3.1-sonar-large-128k-online'
  },
  {
    id: 'grok-4.1',
    name: 'Grok 4.1',
    description: 'xAI advanced model',
    isPro: true,
    provider: 'xAI',
    speed: 'normal',
    openRouterId: 'x-ai/grok-beta'
  },
  {
    id: 'o3',
    name: 'o3',
    description: 'Reasoning specialist',
    isPro: true,
    provider: 'OpenAI',
    speed: 'slow',
    openRouterId: 'openai/o3-mini'
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    description: 'Powerful & efficient',
    isPro: false,
    provider: 'DeepSeek',
    speed: 'fast',
    openRouterId: 'deepseek/deepseek-chat'
  },
];

// For backward compatibility
export const MODELS = CHAT_MODELS;

interface HistoryItem {
  id: string;
  title: string;
  timestamp: number;
  type: 'chat' | 'assistant';
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('chat');
  const [currentScreen, setCurrentScreen] = useState<Screen>('chat');
  const [mode, setMode] = useState<Mode>('chat');
  const [selectedModel, setSelectedModel] = useState<string>('deepseek-v3');
  const [isPro, setIsPro] = useState(true); // 临时设为true，让所有功能可以测试
  const [isAuthReady, setIsAuthReady] = useState(false);

  // 初始化匿名认证（让Functions可以工作）
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        try {
          await signInAnonymously(auth);
          console.log('✅ 匿名登录成功');
        } catch (error) {
          console.error('❌ 匿名登录失败:', error);
        }
      } else {
        console.log('✅ 用户已登录:', user.uid);
      }
      setIsAuthReady(true);
    });
    return unsubscribe;
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [isProPaywallOpen, setIsProPaywallOpen] = useState(false);
  const [isAttachmentSheetOpen, setIsAttachmentSheetOpen] = useState(false);
  const [artPrompt, setArtPrompt] = useState('');
  const [isPDFSheetOpen, setIsPDFSheetOpen] = useState(false);
  const [isYouTubeSheetOpen, setIsYouTubeSheetOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSignatureMakerOpen, setIsSignatureMakerOpen] = useState(false);
  const [isLogoGeneratorOpen, setIsLogoGeneratorOpen] = useState(false);
  const [isTattooGeneratorOpen, setIsTattooGeneratorOpen] = useState(false);
  const [currentAssistantId, setCurrentAssistantId] = useState<string>('');
  const [isPaymentSuccessOpen, setIsPaymentSuccessOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(119);

  // 等待认证就绪后再渲染应用
  if (!isAuthReady) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">正在初始化...</p>
        </div>
      </div>
    );
  }

  const handleModelSelect = (modelId: string) => {
    const model = MODELS.find(m => m.id === modelId);
    if (model?.isPro && !isPro) {
      setIsModelSelectorOpen(false);
      setTimeout(() => setIsProPaywallOpen(true), 300);
    } else {
      setSelectedModel(modelId);
      setIsModelSelectorOpen(false);
    }
  };

  const handleProFeatureClick = () => {
    setIsProPaywallOpen(true);
  };

  const handleStartTrial = () => {
    setIsPro(true);
    setIsProPaywallOpen(false);
    setIsPaymentSuccessOpen(true);
  };

  const handleNewChat = () => {
    setIsMenuOpen(false);
    setCurrentTab('chat');
    setCurrentScreen('chat');
    setCurrentChatId(null);
  };

  const addChatHistory = (title: string, type: ChatHistory['type']) => {
    const newChat: ChatHistory = {
      id: Date.now().toString(),
      title: title.substring(0, 5) + (title.length > 5 ? '...' : ''),
      timestamp: Date.now(),
      type,
    };
    setChatHistory((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    return newChat.id;
  };

  const addHistoryItem = (title: string, type: 'chat' | 'assistant') => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      title,
      timestamp: Date.now(),
      type,
    };
    setHistoryItems((prev) => [newItem, ...prev]);
  };

  const handleHistoryItemClick = (id: string) => {
    setCurrentChatId(id);
    setCurrentTab('chat');
    setCurrentScreen('chat');
  };

  const handleAssistantClick = (assistantId: string) => {
    setCurrentAssistantId(assistantId);
    setCurrentTab('assistants');
    setCurrentScreen('assistant-chat');
  };

  const handleTabChange = (tab: Tab) => {
    setCurrentTab(tab);
    if (tab === 'chat') {
      setCurrentScreen('chat');
    } else if (tab === 'assistants') {
      setCurrentScreen('chat');
    } else if (tab === 'history') {
      setCurrentScreen('chat');
    }
  };

  // Always show bottom tabs except for settings and personalization screens
  const showBottomTabs = currentScreen !== 'settings' && currentScreen !== 'personalization';

  return (
      <div className="h-screen bg-white overflow-hidden flex flex-col">
        <ErrorBoundary>
        <div className={`flex-1 min-h-0 overflow-hidden ${showBottomTabs ? 'pb-16' : ''}`}>
        {/* Main Tab Content */}
        {currentTab === 'chat' && currentScreen === 'chat' && (
          <ChatScreen
            mode={mode}
            selectedModel={selectedModel}
            isPro={isPro}
            onMenuClick={() => setIsMenuOpen(true)}
            onModelClick={() => setIsModelSelectorOpen(true)}
            onAttachmentClick={() => setIsAttachmentSheetOpen(true)}
            onProClick={() => setIsProPaywallOpen(true)}
            onArtGeneratorClick={() => setCurrentScreen('art-generator')}
            onPDFClick={() => setIsPDFSheetOpen(true)}
            onYoutubeClick={() => setIsYouTubeSheetOpen(true)}
            onRoleChatClick={() => setCurrentScreen('role-chat')}
            onSignatureMakerClick={() => setIsSignatureMakerOpen(true)}
            onLogoGeneratorClick={() => setIsLogoGeneratorOpen(true)}
            onTattooGeneratorClick={() => setIsTattooGeneratorOpen(true)}
            onWebSearchClick={() => {
              if (!isPro) {
                setIsProPaywallOpen(true);
              }
            }}
          />
        )}

        {currentTab === 'assistants' && currentScreen === 'chat' && (
          <AssistantsScreen
            onMenuClick={() => setIsMenuOpen(true)}
            onAssistantClick={handleAssistantClick}
            isPro={isPro}
            selectedModel={MODELS.find(m => m.id === selectedModel)?.name || 'GPT 5.1 Instant'}
            onProClick={() => setIsProPaywallOpen(true)}
            onModelClick={() => setIsModelSelectorOpen(true)}
          />
        )}

        {currentTab === 'history' && currentScreen === 'chat' && (
          <HistoryScreen
            onMenuClick={() => setIsMenuOpen(true)}
            onStartChat={() => {
              setCurrentTab('chat');
              setCurrentScreen('chat');
            }}
            onHistoryItemClick={handleHistoryItemClick}
            historyItems={historyItems}
            isPro={isPro}
            selectedModel={MODELS.find(m => m.id === selectedModel)?.name || 'GPT 5.1 Instant'}
            onProClick={() => setIsProPaywallOpen(true)}
            onModelClick={() => setIsModelSelectorOpen(true)}
          />
        )}

        {/* Other Screens */}
        {currentScreen === 'art-generator' && (
          <ArtGeneratorScreen
            selectedModel={selectedModel}
            isPro={isPro}
            onMenuClick={() => setIsMenuOpen(true)}
            onModelClick={() => setIsModelSelectorOpen(true)}
            onProClick={() => setIsProPaywallOpen(true)}
            onContinue={(prompt) => {
              setArtPrompt(prompt);
              setCurrentScreen('art-chat');
            }}
            onBackToHome={() => {
              setCurrentTab('chat');
              setCurrentScreen('chat');
            }}
          />
        )}

        {currentScreen === 'art-chat' && (
          <ArtChatScreen
            initialPrompt={artPrompt}
            selectedModel={selectedModel}
            isPro={isPro}
            onMenuClick={() => setIsMenuOpen(true)}
            onModelClick={() => setIsModelSelectorOpen(true)}
            onProClick={() => setIsProPaywallOpen(true)}
            onBack={() => {
              setCurrentTab('chat');
              setCurrentScreen('chat');
            }}
          />
        )}

        {currentScreen === 'role-chat' && (
          <AIRoleChatScreen
            selectedModel={selectedModel}
            isPro={isPro}
            onMenuClick={() => setIsMenuOpen(true)}
            onModelClick={() => setIsModelSelectorOpen(true)}
            onProClick={() => setIsProPaywallOpen(true)}
            onBackToHome={() => {
              setCurrentTab('chat');
              setCurrentScreen('chat');
            }}
          />
        )}

        {currentScreen === 'assistant-chat' && (
          <AssistantChatScreen
            assistantId={currentAssistantId}
            selectedModel={selectedModel}
            isPro={isPro}
            onMenuClick={() => setIsMenuOpen(true)}
            onModelClick={() => setIsModelSelectorOpen(true)}
            onProClick={() => setIsProPaywallOpen(true)}
            onAddToHistory={addHistoryItem}
            onBack={() => {
              setCurrentTab('assistants');
              setCurrentScreen('chat');
            }}
          />
        )}

        {currentScreen === 'settings' && (
          <Settings
            isPro={isPro}
            onClose={() => {
              setCurrentTab('chat');
              setCurrentScreen('chat');
            }}
            onUpgradeToPro={handleProFeatureClick}
          />
        )}

        {currentScreen === 'personalization' && (
          <Personalization
            isPro={isPro}
            onClose={() => {
              setCurrentTab('chat');
              setCurrentScreen('chat');
            }}
            onUpgradeToPro={handleProFeatureClick}
          />
        )}
        </div>
        </ErrorBoundary>

        {/* Side Menu */}
        <SideMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onNewChat={handleNewChat}
          onPersonalization={() => {
            setIsMenuOpen(false);
            setCurrentScreen('personalization');
          }}
          onSettings={() => {
            setIsMenuOpen(false);
            setCurrentScreen('settings');
          }}
          chatHistory={chatHistory}
          onHistoryItemClick={handleHistoryItemClick}
        />

        {/* Modal Selectors */}
        <ModelSelector
          isOpen={isModelSelectorOpen}
          onClose={() => setIsModelSelectorOpen(false)}
          selectedModel={selectedModel}
          onSelectModel={handleModelSelect}
          isPro={isPro}
        />

        <ProPaywall
          isOpen={isProPaywallOpen}
          onClose={() => setIsProPaywallOpen(false)}
          onStartTrial={handleStartTrial}
          onPaymentSuccess={(amount) => {
            setPaymentAmount(amount);
            setIsProPaywallOpen(false);
            setIsPaymentSuccessOpen(true);
            setIsPro(true);
          }}
        />

        <PaymentSuccess
          isOpen={isPaymentSuccessOpen}
          amount={paymentAmount}
          onBackToHome={() => {
            setIsPaymentSuccessOpen(false);
            setCurrentTab('chat');
            setCurrentScreen('chat');
          }}
        />

        {/* Sheets */}
        <AttachmentSheet
          isOpen={isAttachmentSheetOpen}
          onClose={() => setIsAttachmentSheetOpen(false)}
        />

        <PDFReadingModal
          isOpen={isPDFSheetOpen}
          onClose={() => setIsPDFSheetOpen(false)}
          isPro={isPro}
          onProClick={() => setIsProPaywallOpen(true)}
        />

        <YouTubeInputSheet
          isOpen={isYouTubeSheetOpen}
          onClose={() => setIsYouTubeSheetOpen(false)}
          onContinue={(url) => {
            addChatHistory(url, 'youtube');
            addHistoryItem('YouTube Video', 'chat');
            setIsYouTubeSheetOpen(false);
            setCurrentTab('chat');
            setCurrentScreen('chat');
          }}
        />

        <SignatureMakerSheet
          isOpen={isSignatureMakerOpen}
          onClose={() => setIsSignatureMakerOpen(false)}
          onContinue={(style, text) => {
            addChatHistory(`${text} - ${style}`, 'chat');
            addHistoryItem(`Signature: ${text}`, 'chat');
            setIsSignatureMakerOpen(false);
            setCurrentTab('chat');
            setCurrentScreen('chat');
          }}
        />

        <LogoGeneratorSheet
          isOpen={isLogoGeneratorOpen}
          onClose={() => setIsLogoGeneratorOpen(false)}
          onContinue={(style, text) => {
            addChatHistory(`${text} - ${style}`, 'chat');
            addHistoryItem(`Logo: ${text}`, 'chat');
            setIsLogoGeneratorOpen(false);
            setCurrentTab('chat');
            setCurrentScreen('chat');
          }}
        />

        <TattooGeneratorSheet
          isOpen={isTattooGeneratorOpen}
          onClose={() => setIsTattooGeneratorOpen(false)}
          isPro={isPro}
          onProClick={() => setIsProPaywallOpen(true)}
        />

        {/* Bottom Tab Bar */}
        {showBottomTabs && (
          <BottomTabBar
            activeTab={currentTab}
            onTabChange={handleTabChange}
          />
        )}
      </div>
  );
}