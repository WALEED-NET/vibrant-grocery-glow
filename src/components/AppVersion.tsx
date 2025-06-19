import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, Calendar, Download, Smartphone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

const AppVersion = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const isMobile = useIsMobile();

  // معلومات الإصدار
  const versionInfo = {
    version: "1.2.1",
    status: "تجريبية",
    lastUpdate: "2025-06-15T12:00:00Z",
    buildNumber: "20250615001"
  };

  const promptInstall = (promptEvent: any) => {
    if (promptEvent) {
      promptEvent.prompt();
      promptEvent.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('تم تثبيت التطبيق');
          toast.success("تم تثبيت التطبيق بنجاح!");
        } else {
          console.log('تم إلغاء تثبيت التطبيق');
        }
        setDeferredPrompt(null);
        setIsInstallable(false);
      });
    }
  };

  const handleInstallApp = () => {
    promptInstall(deferredPrompt);
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as any;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
      
      toast.info("يمكنك تثبيت التطبيق على جهازك!", {
        action: {
          label: "تثبيت",
          onClick: () => promptInstall(promptEvent),
        },
        duration: 10000,
        dismissible: true,
      });
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
        >
          <Info className="h-3 w-3 ml-1" />
          معلومات التطبيق
        </Button>
      </DialogTrigger>
      <DialogContent className={`${isMobile ? 'w-[95vw] max-w-none' : 'max-w-md'} z-[1000]`}>
        <DialogHeader>
          <DialogTitle className="text-right flex items-center gap-2">
            <Info className="h-5 w-5 text-[#388E3C]" />
            معلومات التطبيق
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="text-center">
                <h3 className="font-bold text-lg text-[#388E3C] mb-2">البقالة الذكية</h3>
                <p className="text-sm text-muted-foreground">
                  نظام إدارة ذكي وشامل للبقالات والمتاجر الصغيرة
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-right">
                  <span className="font-medium">الإصدار:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="outline">{versionInfo.version}</Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="font-medium">الحالة:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {versionInfo.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right col-span-2">
                  <span className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    آخر تحديث:
                  </span>
                  <p className="text-muted-foreground mt-1" dir="ltr">
                    {new Date(versionInfo.lastUpdate).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              {/* تحذير النسخة التجريبية */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-right">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-orange-800 mb-1">
                      هذه نسخة تجريبية
                    </p>
                    <p className="text-orange-700 text-xs leading-relaxed">
                      قد تحتوي على بعض الأخطاء أو الميزات غير المكتملة. 
                      نحن نعمل باستمرار على تحسين التطبيق وإضافة ميزات جديدة.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* تثبيت التطبيق */}
              {isInstallable && (
                <div className="border-t pt-3">
                  <Button 
                    onClick={handleInstallApp}
                    className="w-full bg-[#388E3C] hover:bg-[#2E7D32]"
                  >
                    <Download className="h-4 w-4 ml-2" />
                    تثبيت التطبيق على الجهاز
                  </Button>
                </div>
              )}
              
              {/* معلومات PWA */}
              <div className="text-center pt-2 border-t">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Smartphone className="h-3 w-3" />
                  يمكن استخدام التطبيق بدون إنترنت
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppVersion;
