// Speech synthesizer utility with multi-language fallback
export function speakText(text: string, language: string = 'en', onEnd?: () => void) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  if (!text) {
    if (onEnd) onEnd();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // Map language codes to BCP-47 tags
  const langCodeMap: Record<string, string> = {
    hi: 'hi-IN',
    mr: 'mr-IN',
    bn: 'bn-IN',
    es: 'es-ES',
    sw: 'sw-KE',
    en: 'en-IN',
  };

  const targetLang = langCodeMap[language] || 'en-US';
  utterance.lang = targetLang;
  utterance.rate = 0.95; // Slightly slower, calm cadence for clear comprehension in rural settings
  utterance.pitch = 1.0;

  // Try to find matching voice
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.startsWith(language) || v.lang === targetLang);
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis error:', e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
