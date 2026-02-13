const BEEP_URL = 'https://www.soundjay.com/buttons/beep-07a.mp3';

let audioCache: HTMLAudioElement | null = null;

export function playBeep() {
  try {
    if (!audioCache) {
      audioCache = new Audio(BEEP_URL);
    }
    
    // Clone the audio to allow multiple rapid plays
    const audio = audioCache.cloneNode() as HTMLAudioElement;
    audio.volume = 0.5;
    
    // Play and handle errors silently
    audio.play().catch(() => {
      // Ignore errors (e.g., user hasn't interacted with page yet)
    });
  } catch (error) {
    // Silently fail if audio can't be played
  }
}
