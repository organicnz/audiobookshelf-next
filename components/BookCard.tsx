
import React from 'react';
import { Book } from '../types';
import { Play, Info, Clock, CheckCircle2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { Badge } from './ui/badge';

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const { playBook, currentBook, isPlaying } = usePlayer();
  const isCurrent = currentBook?.id === book.id;
  const pct = Math.round((book.progress / book.duration) * 100);
  const isFinished = pct >= 100;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playBook(book);
  };

  return (
    <div 
      className="group flex flex-col gap-3 cursor-pointer gpu-accelerated"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-indigo-500/20 ring-1 ring-white/10">
        <img 
          src={book.cover} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
        />
        
        {/* Glass Overlay on Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 backdrop-blur-[2px] will-change-opacity">
           <button 
             onClick={handlePlayClick}
             className="bg-white text-black rounded-full p-4 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform duration-200"
           >
             <Play className="w-6 h-6 fill-current pl-1" />
           </button>
           <button 
             onClick={onClick}
             className="text-white font-medium text-xs bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 transition-colors"
           >
             View Details
           </button>
        </div>

        {/* Progress Overlay */}
        {pct > 0 && !isFinished && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/50 backdrop-blur-sm">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: `${pct}%` }} />
          </div>
        )}

        {/* Finished Overlay */}
        {isFinished && (
           <div className="absolute top-2 right-2">
              <div className="bg-green-500/90 text-white rounded-full p-1 shadow-lg backdrop-blur-sm">
                 <CheckCircle2 className="w-4 h-4" />
              </div>
           </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-base text-slate-100 leading-tight line-clamp-1 group-hover:text-indigo-400 transition-colors" title={book.title}>
            {book.title}
        </h3>
        <p className="text-sm text-slate-400 line-clamp-1">{book.author}</p>
        
        <div className="flex items-center justify-between pt-1">
            <Badge variant="outline" className="text-[10px] px-1.5 h-5 border-white/10 bg-white/5 text-slate-400">
                {book.genres[0]}
            </Badge>
            {book.duration > 0 && (
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {Math.round(book.duration / 3600)}h
                </span>
            )}
        </div>
      </div>
    </div>
  );
};
