
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSplashScreen } from "@/hooks/useSplashScreen";
import { useAuthStore } from "@/stores/useAuthStore";
import SplashScreen from "@/components/SplashScreen";
import LoginPage from "@/components/LoginPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const { showSplash, isAppReady, handleSplashComplete: originalHandleSplashComplete } = useSplashScreen();
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const handleSplashComplete = () => {
    originalHandleSplashComplete();
    if (!isAuthenticated) {
      setShowLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
        
        {showLogin && (
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        )}
        
        {isAppReady && isAuthenticated && !showLogin && (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
