
import { useState, useEffect, useRef, useCallback } from 'react';

interface VoiceSearchHook {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

export const useVoiceSearch = (): VoiceSearchHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    const recognition = recognitionRef.current;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'ar-SA'; // Arabic language

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript.trim());
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      let errorMessage = 'حدث خطأ في التعرف على الصوت';
      if (event.error === 'no-speech') {
        errorMessage = 'لم يتم اكتشاف أي كلام. يرجى المحاولة مرة أخرى.';
      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMessage = 'تم رفض الوصول إلى الميكروفون. يرجى السماح بالوصول والمحاولة مرة أخرى.';
      } else if (event.error === 'audio-capture') {
        errorMessage = 'حدث خطأ في الميكروفون. يرجى التحقق من توصيله.';
      }
      
      setError(errorMessage);
      setIsListening(false);
      console.error('Speech recognition error:', event.error);
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isSupported]);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      setError('المتصفح لا يدعم البحث الصوتي');
      return;
    }

    setError(null);
    setTranscript('');
    recognitionRef.current.start();
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error,
  };
};
