import { useState, useEffect } from 'react';

interface UseSplashScreenOptions {
  duration?: number;
  autoHide?: boolean;
}

export const useSplashScreen = (options: UseSplashScreenOptions = {}) => {
  const { duration = 3000, autoHide = true } = options;
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        // Breve delay per permettere animazioni di uscita
        setTimeout(() => {
          setIsVisible(false);
        }, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, autoHide]);

  const hideSplashScreen = () => {
    setIsLoading(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  return {
    isVisible,
    isLoading,
    hideSplashScreen
  };
};