import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, X, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';

export const Player: React.FC = () => {
  const { 
    currentBook, 
    isPlaying, 
    currentTime, 
    togglePlayPause, 
    seek, 
    closePlayer, 
    playbackRate,
    setPlaybackRate
  } = usePlayer();

  if (!currentBook) return null;

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (currentTime / currentBook.duration) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-white/10 p-4 z-50 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
        
        {/* Book Info */}
        <div className="flex items-center gap-4 w-full md:w-1/4 min-w-0">
          <img 
            src={currentBook.cover} 
            alt={currentBook.title} 
            className="h-14 w-14 rounded-md object-cover shadow-sm flex-shrink-0"
          />
          <div className="truncate">
            <h4 className="font-semibold text-sm truncate text-white">{currentBook.title}</h4>
            <p className="text-xs text-slate-400 truncate">{currentBook.author}</p>
          </div>
        </div>

        {/* Controls & Scrubber */}
        <div className="flex flex-col flex-1 w-full gap-2">
          <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => seek(Math.max(0, currentTime - 15))}>
              <SkipBack className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="primary" 
              className="rounded-full w-12 h-12 !p-0 flex items-center justify-center shadow-lg shadow-blue-500/20"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current pl-0.5" />}
            </Button>
            
            <Button variant="ghost" size="icon" onClick={() => seek(Math.min(currentBook.duration, currentTime + 15))}>
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-3 w-full text-xs text-slate-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <div className="relative flex-1 h-1.5 bg-slate-700 rounded-full cursor-pointer group"
                 onClick={(e) => {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const pct = (e.clientX - rect.left) / rect.width;
                   seek(pct * currentBook.duration);
                 }}
            >
               <div 
                 className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-100"
                 style={{ width: `${progressPercent}%` }}
               >
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
            </div>
            <span>{formatTime(currentBook.duration)}</span>
          </div>
        </div>

        {/* Extra Controls */}
        <div className="flex items-center gap-2 w-full md:w-1/4 justify-end">
           <Button variant="ghost" size="sm" onClick={() => {
             const rates = [0.8, 1.0, 1.25, 1.5, 2.0];
             const idx = rates.indexOf(playbackRate);
             setPlaybackRate(rates[(idx + 1) % rates.length]);
           }}>
             {playbackRate}x
           </Button>
           <Volume2 className="w-5 h-5 text-slate-400" />
           <Button variant="ghost" size="icon" onClick={closePlayer}>
             <X className="w-5 h-5" />
           </Button>
        </div>

      </div>
    </div>
  );
};
