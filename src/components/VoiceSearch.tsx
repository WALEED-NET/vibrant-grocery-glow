
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';
import { useToast } from '@/hooks/use-toast';

interface VoiceSearchProps {
  onSearchResult: (searchTerm: string) => void;
  disabled?: boolean;
}

const VoiceSearch = ({ onSearchResult, disabled = false }: VoiceSearchProps) => {
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error,
  } = useVoiceSearch();
  
  const { toast } = useToast();
  const prevIsListening = useRef(isListening);

  useEffect(() => {
    if (isListening && !prevIsListening.current) {
      toast({
        title: "🎙️ جارِ الاستماع...",
        description: "تحدث الآن من فضلك. سيتم إيقاف التسجيل تلقائياً.",
      });
    }
    prevIsListening.current = isListening;
  }, [isListening, toast]);

  useEffect(() => {
    if (transcript) {
      onSearchResult(transcript);
      toast({
        title: "تم التعرف على الصوت",
        description: `البحث عن: "${transcript}"`,
      });
      resetTranscript();
    }
  }, [transcript, onSearchResult, toast, resetTranscript]);

  useEffect(() => {
    if (error) {
      toast({
        title: "خطأ في البحث الصوتي",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <Button variant="outline" size="sm" disabled className="text-xs">
        <AlertCircle className="h-3 w-3" />
        <span className="hidden sm:inline">غير مدعوم</span>
      </Button>
    );
  }

  return (
    <Button
      variant={isListening ? "destructive" : "outline"}
      size="sm"
      onClick={handleToggleListening}
      disabled={disabled}
      className={`text-xs transition-all duration-200 ${
        isListening ? 'animate-pulse-slow' : ''
      }`}
    >
      {isListening ? (
        <>
          <MicOff className="h-3 w-3" />
          <span className="hidden sm:inline">إيقاف</span>
        </>
      ) : (
        <>
          <Mic className="h-3 w-3" />
          <span className="hidden sm:inline">بحث صوتي</span>
        </>
      )}
    </Button>
  );
};

export default VoiceSearch;
