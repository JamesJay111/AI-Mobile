import { X, MessageCircle, Zap, Image as ImageIcon, FileText, Lock } from 'lucide-react';
import { useState } from 'react';

interface ProPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTrial: () => void;
  onPaymentSuccess?: (amount: number) => void;
}

const SUBSCRIPTION_PLANS = [
  {
    id: 'weekly',
    title: 'Weekly Pro',
    price: '$4.9',
    period: '/week',
    billingCycle: 'Billed weekly',
    features: [
      'Unlimited messages',
      'Access to all AI models',
      'Priority support',
      'Ad-free experience'
    ],
    highlighted: false
  },
  {
    id: 'monthly',
    title: 'Monthly Pro',
    price: '$9.9',
    period: '/month',
    originalPrice: '$19.8',
    discount: '50% OFF',
    billingCycle: 'Billed monthly',
    features: [
      'Unlimited messages',
      'Access to all AI models',
      'Priority support',
      'Ad-free experience',
      'Best value - Save $14.7/month vs weekly'
    ],
    highlighted: true,
    recommended: true
  }
];

export function ProPaywall({ isOpen, onClose, onStartTrial, onPaymentSuccess }: ProPaywallProps) {
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly'>('monthly');

  if (!isOpen) return null;

  const handleContinue = () => {
    const amount = selectedPlan === 'monthly' ? 9.9 : 4.9;
    onStartTrial();
    if (onPaymentSuccess) {
      onPaymentSuccess(amount);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-transparent px-6 py-4 flex items-center justify-between flex-shrink-0">
        <button
          onClick={onClose}
          className="text-[17px] text-[#A1A1AA] font-normal hover:opacity-80 transition-opacity"
        >
          Cancel
        </button>
        <div className="w-16"></div>
      </div>

      {/* Content - Auto Layout Stack */}
      <div className="flex-1 flex flex-col px-6 pb-8 space-y-6 max-w-md mx-auto w-full">
        
        {/* Section A: Header (Atmospheric) */}
        <div className="flex flex-col items-center justify-center pt-8 relative">
          {/* Glowing Ambient Background */}
          <div className="absolute w-48 h-48 bg-[#00E585] rounded-full opacity-20 blur-3xl"></div>
          
          {/* App Logo Icon */}
          <div className="relative z-10 w-24 h-24 bg-white rounded-[1.5rem] flex items-center justify-center shadow-2xl mb-6">
            <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
              <path d="M30 30 L50 20 L70 30 L70 50 L50 60 L30 50 Z" fill="#1a1d2e" stroke="#1a1d2e" strokeWidth="3" strokeLinejoin="round"/>
              <path d="M15 50 L30 40 L30 60 L15 70 Z" fill="#1a1d2e" stroke="#1a1d2e" strokeWidth="3" strokeLinejoin="round"/>
              <path d="M70 50 L85 40 L85 60 L70 70 Z" fill="#1a1d2e" stroke="#1a1d2e" strokeWidth="3" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-[28px] font-bold text-white leading-tight">
            Get <span className="text-[#00E585] font-bold">Pro</span> Access
          </h1>
        </div>

        {/* Section B: Value Proposition (Clean List) */}
        <div className="flex flex-col items-start space-y-4 pt-4 mx-auto">
          <div className="flex items-center gap-4">
            <MessageCircle className="w-6 h-6 text-[#00E585]" strokeWidth={2} />
            <span className="text-[16px] text-white">Unlimited Chat</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Zap className="w-6 h-6 text-[#00E585]" strokeWidth={2} />
            <span className="text-[16px] text-white">Fastest AI Models</span>
          </div>
          
          <div className="flex items-center gap-4">
            <ImageIcon className="w-6 h-6 text-[#00E585]" strokeWidth={2} />
            <span className="text-[16px] text-white">Image Generation</span>
          </div>

          <div className="flex items-center gap-4">
            <FileText className="w-6 h-6 text-[#00E585]" strokeWidth={2} />
            <span className="text-[16px] text-white">PDF Summaries</span>
          </div>
        </div>

        {/* Section C: Pricing Cards (Radio Selection Style) */}
        <div className="flex flex-col space-y-3 pt-4">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                className="relative rounded-2xl p-5 cursor-pointer transition-all"
                style={{
                  background: isSelected
                    ? 'linear-gradient(180deg, rgba(0, 229, 133, 0.1) 0%, rgba(0, 229, 133, 0.05) 100%)'
                    : '#121212',
                  border: isSelected ? '2px solid #00E585' : '1px solid #333333',
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)'
                }}
                onClick={() => setSelectedPlan(plan.id as 'weekly' | 'monthly')}
              >
                {/* 50% OFF Badge for Monthly Plan */}
                {plan.id === 'monthly' && plan.highlighted && (
                  <div className="absolute -top-3 right-4 bg-[#FFD700] text-black px-3 py-1 rounded-full text-[11px] font-bold shadow-md">
                    {plan.discount}
                  </div>
                )}

                {/* Best Value Badge */}
                {isSelected && plan.recommended && (
                  <div className="absolute -top-3 left-4 bg-white text-black px-3 py-1 rounded-full text-[11px] font-bold shadow-md">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className={`text-[16px] font-bold ${isSelected ? 'text-white' : 'text-[#A1A1AA]'}`}>
                      {plan.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      {plan.id === 'monthly' && plan.originalPrice && (
                        <span className="text-[13px] text-[#A1A1AA] line-through">
                          {plan.originalPrice}
                        </span>
                      )}
                      <span className="text-[13px] text-[#A1A1AA]">
                        {plan.price}{plan.period}
                      </span>
                    </div>
                    <span className="text-[12px] text-[#A1A1AA] mt-1">
                      {plan.billingCycle}
                    </span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className={`text-[20px] font-bold ${isSelected ? 'text-[#00E585]' : 'text-white'}`}>
                      {plan.price}
                    </span>
                    {isSelected && plan.id === 'monthly' && (
                      <span className="text-[12px] text-[#00E585] mt-1">Best Value</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section D: Footer Action */}
        <div className="flex flex-col space-y-4 pt-6">
          {/* CTA Button - Pill Shape */}
          <button
            onClick={handleContinue}
            className="w-full h-14 bg-[#00E585] text-black rounded-full font-semibold text-[17px] hover:bg-[#00d078] transition-colors shadow-lg active:scale-95"
          >
            {selectedPlan === 'monthly' ? 'Start Monthly Trial' : 'Start Weekly Trial'}
          </button>

          {/* Cancel Anytime */}
          <div className="flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-[#A1A1AA]" strokeWidth={2} />
            <span className="text-[13px] text-[#A1A1AA]">Cancel anytime</span>
          </div>

          {/* Footer Links */}
          <div className="flex items-center justify-center gap-3 text-[11px] text-[#A1A1AA] pt-2">
            <button className="hover:text-white transition-colors">Terms of Use</button>
            <span>•</span>
            <button className="hover:text-white transition-colors">Privacy Policy</button>
            <span>•</span>
            <button className="hover:text-white transition-colors">Restore</button>
          </div>
        </div>
      </div>
    </div>
  );
}