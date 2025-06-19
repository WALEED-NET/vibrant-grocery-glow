
import { useState, useEffect, useRef } from 'react';

interface InvoiceVoiceSearchHook {
  isListening: boolean;
  transcript: string;
  parsedItems: ParsedItem[];
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

interface ParsedItem {
  quantity: number;
  productName: string;
  confidence: number;
}

export const useInvoiceVoiceSearch = (): InvoiceVoiceSearchHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);
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
    recognition.lang = 'ar-SA';

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
        parseVoiceInput(finalTranscript.trim());
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setError('حدث خطأ في التعرف على الصوت');
      setIsListening(false);
      console.error('Speech recognition error:', event.error);
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isSupported]);

  const parseVoiceInput = (input: string) => {
    // Enhanced parsing for Arabic voice input with quantities
    const items: ParsedItem[] = [];
    
    // Common Arabic number words to digits mapping
    const numberMap: { [key: string]: number } = {
      'واحد': 1, 'اثنين': 2, 'اثنان': 2, 'ثلاثة': 3, 'أربعة': 4, 'خمسة': 5,
      'ستة': 6, 'سبعة': 7, 'ثمانية': 8, 'تسعة': 9, 'عشرة': 10,
      'علبة': 1, 'علبتين': 2, 'علبتان': 2, 'كيس': 1, 'كيسين': 2, 'كيسان': 2,
      'حبة': 1, 'حبتين': 2, 'حبتان': 2, 'قطعة': 1, 'قطعتين': 2, 'قطعتان': 2
    };

    // Split by common separators
    const segments = input.split(/[،,وو]/);
    
    segments.forEach(segment => {
      const cleanSegment = segment.trim();
      if (!cleanSegment) return;

      // Try to extract quantity and product name
      let quantity = 1;
      let productName = cleanSegment;

      // Look for numbers at the beginning
      const numberMatch = cleanSegment.match(/^(\d+|[۰-۹]+)\s*(.+)/);
      if (numberMatch) {
        quantity = parseInt(numberMatch[1]) || 1;
        productName = numberMatch[2].trim();
      } else {
        // Look for Arabic number words
        for (const [word, num] of Object.entries(numberMap)) {
          if (cleanSegment.includes(word)) {
            quantity = num;
            productName = cleanSegment.replace(word, '').trim();
            break;
          }
        }
      }

      // Clean up product name
      productName = productName
        .replace(/^(علب|علبة|أكياس|كيس|حبات|حبة|قطع|قطعة)\s*/i, '')
        .trim();

      if (productName) {
        items.push({
          quantity,
          productName,
          confidence: 0.8 // Basic confidence score
        });
      }
    });

    setParsedItems(items);
  };

  const startListening = () => {
    if (!isSupported || !recognitionRef.current) {
      setError('المتصفح لا يدعم البحث الصوتي');
      return;
    }

    setError(null);
    setTranscript('');
    setParsedItems([]);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const resetTranscript = () => {
    setTranscript('');
    setParsedItems([]);
    setError(null);
  };

  return {
    isListening,
    transcript,
    parsedItems,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error,
  };
};
