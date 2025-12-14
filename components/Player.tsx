'use client';

import * as React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, X, ListMusic, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';

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

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationRef = React.useRef<number>(0);

  // 120Hz GPU Visualizer Logic
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI displays for sharpness
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const barCount = 64;
    const barWidth = rect.width / barCount;
    // Simulate frequency data
    const data = new Uint8Array(barCount);

    const render = () => {
      if (!isPlaying) {
         // Gentle idle animation
         const time = Date.now() / 1000;
         ctx.clearRect(0, 0, rect.width, rect.height);
         for (let i = 0; i < barCount; i++) {
            const h = Math.sin(i * 0.2 + time) * 5 + 8;
            ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
            const x = i * barWidth;
            const y = (rect.height - h) / 2;
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth - 2, h, 2);
            ctx.fill();
         }
         animationRef.current = requestAnimationFrame(render);
         return;
      }

      // Update fake data
      for (let i = 0; i < barCount; i++) {
        // Create a chaotic but smooth pattern based on time
        const n = Date.now() / 100 * playbackRate;
        const val = Math.sin(i * 0.1 + n) * 0.5 + Math.cos(i * 0.3 - n) * 0.5;
        data[i] = Math.max(4, Math.abs(val) * 25);
      }

      ctx.clearRect(0, 0, rect.width, rect.height);

      for (let i = 0; i < barCount; i++) {
        const x = i * barWidth;
        const h = data[i];
        const y = (rect.height - h) / 2;
        
        // Gradient color based on height
        const gradient = ctx.createLinearGradient(0, y, 0, y + h);
        gradient.addColorStop(0, '#818cf8'); // Indigo 400
        gradient.addColorStop(1, '#c084fc'); // Purple 400

        ctx.fillStyle = gradient;
        
        // Rounded bars
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth - 2, h, 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, playbackRate]);

  if (!currentBook) return null;

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressStyle = {
    width: `${(currentTime / currentBook.duration) * 100}%`,
    transition: isPlaying ? `width ${1 / playbackRate}s linear` : 'none',
    willChange: 'width'
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center pb-4 px-4">
      {/* Floating Glass Dock */}
      <div className="w-full max-w-6xl bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl pointer-events-auto flex flex-col md:flex-row items-center gap-4 md:gap-6 relative overflow-hidden gpu-accelerated">
        
        {/* Visualizer Background */}
        <canvas 
           ref={canvasRef} 
           className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" 
           style={{ mixBlendMode: 'overlay' }}
        />

        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent blur-sm" />

        {/* Book Info */}
        <div className="flex items-center gap-4 w-full md:w-1/4 min-w-0 z-10">
          <div className="relative group">
             <img 
                src={currentBook.cover} 
                alt={currentBook.title} 
                className="h-14 w-10 md:h-16 md:w-12 rounded-md object-cover shadow-lg ring-1 ring-white/10"
             />
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                 <Maximize2 className="w-4 h-4 text-white" />
             </div>
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm truncate text-white mb-0.5">{currentBook.title}</h4>
            <p className="text-xs text-slate-400 truncate hover:text-indigo-400 cursor-pointer transition-colors">{currentBook.author}</p>
          </div>
        </div>

        {/* Controls & Scrubber */}
        <div className="flex flex-col flex-1 w-full gap-2 items-center z-10">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10 h-8 w-8" onClick={() => seek(Math.max(0, currentTime - 15))}>
              <SkipBack className="w-5 h-5" />
            </Button>
            
            <button 
              className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current pl-0.5" />}
            </button>
            
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10 h-8 w-8" onClick={() => seek(Math.min(currentBook.duration, currentTime + 15))}>
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-3 w-full text-xs text-slate-400 font-mono max-w-xl">
            <span className="min-w-[4ch] text-right">{formatTime(currentTime)}</span>
            <div className="relative flex-1 group h-4 flex items-center cursor-pointer"
                 onClick={(e) => {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const pct = (e.clientX - rect.left) / rect.width;
                   seek(pct * currentBook.duration);
                 }}
            >
               {/* Track */}
               <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  {/* Fill - Uses CSS linear transition for 120Hz smoothness */}
                  <div 
                     className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] rounded-full relative"
                     style={progressStyle}
                  />
               </div>
               {/* Thumb (visible on hover) - Positioned by left % */}
               <div 
                 className="absolute w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                 style={{ 
                     left: `${(currentTime / currentBook.duration) * 100}%`, 
                     transform: 'translateX(-50%)',
                     transition: isPlaying ? `left ${1 / playbackRate}s linear` : 'none'
                 }}
               />
            </div>
            <span className="min-w-[4ch]">{formatTime(currentBook.duration)}</span>
          </div>
        </div>

        {/* Extra Controls */}
        <div className="flex items-center gap-2 w-full md:w-1/4 justify-end z-10">
           <Button variant="ghost" size="sm" className="h-8 text-xs font-mono text-slate-400 hover:text-white hover:bg-white/10" onClick={() => {
             const rates = [0.8, 1.0, 1.25, 1.5, 2.0];
             const idx = rates.indexOf(playbackRate);
             setPlaybackRate(rates[(idx + 1) % rates.length]);
           }}>
             {playbackRate}x
           </Button>
           
           <div className="flex items-center gap-2 group">
              <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              <div className="w-20 h-1 bg-white/10 rounded-full cursor-pointer">
                 <div className="h-full w-3/4 bg-slate-500 rounded-full group-hover:bg-white transition-colors" />
              </div>
           </div>

           <div className="w-px h-6 bg-white/10 mx-2" />

           <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10">
             <ListMusic className="w-4 h-4" />
           </Button>
           
           <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10" onClick={closePlayer}>
             <X className="w-4 h-4" />
           </Button>
        </div>
      </div>
    </div>
  );
};