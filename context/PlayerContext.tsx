'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Book, PlayerState } from '../types';

interface PlayerContextType extends PlayerState {
  playBook: (book: Book) => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  closePlayer: () => void;
  previewAudioBuffer: (buffer: AudioBuffer) => void; // For Gemini TTS preview
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [playbackRate, setPlaybackRateState] = useState(1.0);

  // We use a mock audio element logic or a real one. 
  // Since we don't have real audio files for the books, we will simulate playback with a timer
  // OR we use the audio buffer for TTS. 
  // To make the UX convincing, we'll simulate "playback" for books by incrementing a timer, 
  // but actually play audio for the TTS preview.
  
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  // Simulation loop for "Fake" Book Playback
  useEffect(() => {
    if (isPlaying && currentBook && !sourceNodeRef.current) {
      // Only simulate if NOT playing a real buffer (TTS)
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentBook.duration) {
             setIsPlaying(false);
             return currentBook.duration;
          }
          return prev + playbackRate; // 1 second * rate
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentBook, playbackRate]);

  const playBook = useCallback((book: Book) => {
    // If playing TTS, stop it
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }

    setCurrentBook(book);
    setCurrentTime(book.progress); // Resume from saved progress
    setIsPlaying(true);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (sourceNodeRef.current && audioContextRef.current) {
       if (audioContextRef.current.state === 'running') {
         audioContextRef.current.suspend();
         setIsPlaying(false);
       } else {
         audioContextRef.current.resume();
         setIsPlaying(true);
       }
       return;
    }
    setIsPlaying((prev) => !prev);
  }, []);

  const seek = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackRateState(rate);
  }, []);

  const closePlayer = useCallback(() => {
    setIsPlaying(false);
    setCurrentBook(null);
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
  }, []);

  const previewAudioBuffer = useCallback(async (buffer: AudioBuffer) => {
    // Stop current simulation or playback
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch(e) {}
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') await ctx.resume();

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    
    const gainNode = ctx.createGain();
    gainNode.gain.value = volume;
    
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    source.onended = () => {
      setIsPlaying(false);
      sourceNodeRef.current = null;
    };

    sourceNodeRef.current = source;
    source.start();
    setIsPlaying(true);
    
    // Create a temporary "fake" book for the UI to show it's playing a preview
    setCurrentBook({
      id: 'preview',
      title: 'Gemini Narrator Preview',
      author: 'AI Generated',
      description: 'Preview',
      cover: 'https://picsum.photos/seed/gemini/100/100', // Generic
      duration: buffer.duration,
      progress: 0,
      genres: [],
      addedAt: new Date().toISOString()
    });
    setCurrentTime(0);

    // Sync UI slider with actual audio time
    const startTime = ctx.currentTime;
    const trackingInterval = setInterval(() => {
        if (!sourceNodeRef.current) {
            clearInterval(trackingInterval);
            return;
        }
        const played = ctx.currentTime - startTime;
        if (played >= buffer.duration) {
            clearInterval(trackingInterval);
            setIsPlaying(false);
        } else {
            setCurrentTime(played);
        }
    }, 100);

  }, [volume]);

  return (
    <PlayerContext.Provider value={{
      currentBook,
      isPlaying,
      currentTime,
      volume,
      playbackRate,
      playBook,
      togglePlayPause,
      seek,
      setVolume,
      setPlaybackRate,
      closePlayer,
      previewAudioBuffer
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};