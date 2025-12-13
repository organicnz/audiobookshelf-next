import React from 'react';
import { Book } from '../types';
import { Play, Info } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const { playBook, currentBook, isPlaying } = usePlayer();
  const isCurrent = currentBook?.id === book.id;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playBook(book);
  };

  const pct = Math.round((book.progress / book.duration) * 100);

  return (
    <div 
      className="group relative bg-surface rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-white/5"
      onClick={onClick}
    >
      <div className="aspect-[2/3] w-full overflow-hidden relative">
        <img 
          src={book.cover} 
          alt={book.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
           <button 
             onClick={handlePlayClick}
             className="bg-primary hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
           >
             <Play className="w-6 h-6 fill-current pl-1" />
           </button>
           <button 
             onClick={onClick}
             className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 backdrop-blur-md"
           >
             <Info className="w-6 h-6" />
           </button>
        </div>
        
        {/* Progress Bar Overlay */}
        {pct > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
            <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-slate-100 truncate" title={book.title}>{book.title}</h3>
        <p className="text-sm text-slate-400 truncate">{book.author}</p>
        <div className="mt-2 flex items-center justify-between">
           <span className="text-xs text-slate-500 px-2 py-0.5 bg-slate-800 rounded-full border border-slate-700">
             {book.genres[0]}
           </span>
           {isCurrent && isPlaying && (
             <span className="flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-accent opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
             </span>
           )}
        </div>
      </div>
    </div>
  );
};
