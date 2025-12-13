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

// Mapper to convert DB row (snake_case) to application model (camelCase)
export const mapDbBookToBook = (row: any): Book => ({
  id: row.id,
  title: row.title,
  author: row.author,
  description: row.description || '',
  cover: row.cover_url || row.cover || 'https://picsum.photos/seed/default/400/600',
  series: row.series || undefined,
  duration: row.duration || 0,
  progress: row.progress || 0, // In a real app, this would be joined from a progress table
  genres: Array.isArray(row.genres) ? row.genres : [],
  addedAt: row.created_at || new Date().toISOString()
});