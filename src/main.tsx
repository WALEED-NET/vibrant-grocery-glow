
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { toast } from "sonner";

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('✅ Service Worker registered successfully with scope: ', registration.scope);
        
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('New content is available. Please refresh.');
                  toast.info("تحديث جديد متوفر للتطبيق", {
                    description: "اضغط على زر التحديث لتطبيق التغييرات.",
                    duration: Infinity,
                    closeButton: true,
                    action: {
                      label: "تحديث الآن",
                      onClick: () => {
                        installingWorker.postMessage({ type: 'SKIP_WAITING' });
                      },
                    },
                  });
                } else {
                  console.log('Content is cached for offline use.');
                  toast.success("التطبيق جاهز للاستخدام بدون إنترنت!");
                }
              }
            };
          }
        };

        // Handle controller change (new SW takes control)
        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (refreshing) return;
          window.location.reload();
          refreshing = true;
        });
      })
      .catch((registrationError) => {
        console.error('❌ Service Worker registration failed:', registrationError);
      });
  });
} else {
    console.log('Service Worker is not supported by this browser.');
}

// Enhanced error handling for the app
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Initialize the React app
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Add some helpful console messages
console.log('🚀 البقالة الذكية - Smart Grocery Management System');
console.log('📱 التطبيق يدعم التشغيل كتطبيق ويب تقدمي (PWA)');
console.log('🌐 يمكن استخدام التطبيق بدون إنترنت بعد التحميل الأول');
