'use client';

import React from 'react';
import { BookCard } from './BookCard';
import { Book } from '../types';
import { Badge } from './ui/badge';

interface SeriesViewProps {
  initialBooks: Book[];
  onBookSelect: (book: Book) => void;
}

export const SeriesView: React.FC<SeriesViewProps> = ({ initialBooks, onBookSelect }) => {
  const seriesGroups: Record<string, Book[]> = {};

  // Group books by series
  initialBooks.forEach(book => {
    if (book.series) {
        // Extract series name (e.g., "Dune Saga #1" -> "Dune Saga")
        // We assume the format "Name #Index" or just "Name"
        const match = book.series.match(/^(.*?)(?:\s+#\d+)?$/);
        const name = match ? match[1] : book.series;
        
        if (!seriesGroups[name]) {
            seriesGroups[name] = [];
        }
        seriesGroups[name].push(book);
    }
  });

  const seriesNames = Object.keys(seriesGroups).sort();

  if (seriesNames.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground animate-in fade-in">
              <div className="bg-slate-800 p-4 rounded-full mb-4 opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M4.9 19.1C1 20.3 1.2 22 1 22a2 2 0 0 0 2 2h16.7a2 2 0 0 0 2-2.2c1.6-2.7 1.6-6-2.6-7.1"/><path d="M12.4 20.9c2.5-.5 5.2-1.6 4.5-5.9"/><path d="M8.4 20.9c-2.5-.5-5.2-1.6-4.5-5.9"/><path d="M12 21v-5"/><path d="M8 21v-5"/><path d="M16 21v-5"/><path d="M12 4a2.2 2.2 0 0 0 .6 4.3A2.2 2.2 0 0 0 14 9a2.2 2.2 0 0 0 1.4-3.7A2.2 2.2 0 0 0 12 4Z"/></svg>
              </div>
              <h3 className="text-lg font-medium">No Series Found</h3>
              <p className="text-sm opacity-70">Books with series information will appear here.</p>
          </div>
      );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-10">
      <div className="space-y-1">
         <h1 className="text-3xl font-bold tracking-tight text-white">Series</h1>
         <p className="text-slate-400">Your collections and sagas.</p>
      </div>
      
      {seriesNames.map((name, index) => (
        <section key={name} className="space-y-6">
          <div className="flex items-end gap-4 border-b border-white/5 pb-2">
             <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
               <span className="w-1.5 h-6 bg-purple-500 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.6)]"></span>
               {name}
             </h2>
             <Badge variant="secondary" className="mb-1 text-slate-400 border-slate-700">
                {seriesGroups[name].length} {seriesGroups[name].length === 1 ? 'Book' : 'Books'}
             </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {seriesGroups[name].map(book => (
              <BookCard key={book.id} book={book} onClick={() => onBookSelect(book)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};