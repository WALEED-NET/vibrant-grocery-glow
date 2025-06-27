
import { useState, useEffect } from 'react';

export const useSplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const initApp = async () => {
      // Check if this is the first load or a refresh
      const isFirstLoad = !sessionStorage.getItem('appLoaded');
      
      if (isFirstLoad) {
        // Show splash for first load
        sessionStorage.setItem('appLoaded', 'true');
        
        // Wait for critical resources to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsAppReady(true);
      } else {
        // Skip splash for subsequent navigation
        setShowSplash(false);
        setIsAppReady(true);
      }
    };

    initApp();
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return {
    showSplash,
    isAppReady,
    handleSplashComplete
  };
};
