
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Zap } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    // Remove lovable badge during splash screen
    const removeLovableBadge = () => {
      const badge = document.getElementById('lovable-badge');
      if (badge) {
        badge.remove();
      }
    };
    
    // Remove badge immediately when splash screen starts
    removeLovableBadge();
    
    const timer1 = setTimeout(() => setAnimationStage(1), 300);
    const timer2 = setTimeout(() => setAnimationStage(2), 800);
    const timer3 = setTimeout(() => setAnimationStage(3), 1200);
    
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-gradient-to-br from-[#388E3C] to-[#2E7D32] flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        background: 'linear-gradient(135deg, #388E3C 0%, #4CAF50 25%, #66BB6A 50%, #2E7D32 100%)'
      }}
    >
      <div className="text-center text-white">
        {/* App Icon */}
        <div className={`mb-6 transform transition-all duration-700 ${
          animationStage >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}>
          <div className="relative mx-auto w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border border-white/30">
            <ShoppingCart size={48} className="text-white" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
          </div>
        </div>

        {/* App Name */}
        <div className={`mb-4 transform transition-all duration-700 delay-300 ${
          animationStage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <h1 className="text-3xl font-bold mb-2" dir="rtl">
            البقالة الذكية
          </h1>
          <p className="text-white/80 text-lg" dir="rtl">
            نظام إدارة المتاجر الذكي
          </p>
        </div>

        {/* Loading Animation */}
        <div className={`transform transition-all duration-700 delay-500 ${
          animationStage >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="flex justify-center space-x-2 rtl:space-x-reverse">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-white/60 text-sm mt-4" dir="rtl">
            جاري التحميل...
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
