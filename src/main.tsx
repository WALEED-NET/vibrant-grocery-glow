
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { toast } from "sonner";

// تسجيل Service Worker
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
                  // يتوفر محتوى جديد ؛ اطلب من المستخدم التحديث.
                  console.log('New content is available. Please refresh.');
                  toast.info("تحديث جديد متوفر للتطبيق", {
                    description: "اضغط على زر التحديث لتطبيق التغييرات.",
                    duration: Infinity, // لن يتم إغلاق الرسالة تلقائيًا
                    closeButton: true,
                    action: {
                      label: "تحديث الآن",
                      onClick: () => {
                        installingWorker.postMessage({ type: 'SKIP_WAITING' });
                      },
                    },
                  });
                } else {
                  // تم تخزين المحتوى مؤقتًا لأول مرة.
                  console.log('Content is cached for offline use.');
                }
              }
            };
          }
        };

        // يتم إطلاق هذا الحدث عند تغيير Service Worker الذي يتحكم في هذه الصفحة.
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

createRoot(document.getElementById("root")!).render(<App />);

