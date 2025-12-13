export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  series?: string;
  duration: number; // in seconds
  progress: number; // in seconds
  genres: string[];
  addedAt: string;
}

export interface PlayerState {
  currentBook: Book | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  playbackRate: number;
}

export interface PlaybackStat {
  date: string;
  minutesListened: number;
}

export enum GeminiModel {
  FLASH = 'gemini-2.5-flash',
  PRO = 'gemini-3-pro-preview',
  TTS = 'gemini-2.5-flash-preview-tts'
}
