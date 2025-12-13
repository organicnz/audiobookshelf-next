
'use client';

import React from 'react';
import { BookCard } from './BookCard';
import { Book } from '../types';

interface LibraryProps {
  initialBooks: Book[];
  onBookSelect: (book: Book) => void;
}

export const Library: React.FC<LibraryProps> = ({ initialBooks, onBookSelect }) => {
  // Sort books: Recently added first
  const sortedBooks = [...initialBooks].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

  // Group by "Continue Listening" vs "All"
  const inProgress = sortedBooks.filter(b => b.progress > 0 && b.progress < b.duration);

  if (initialBooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
        <p>No books found in library.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      {inProgress.length > 0 && (
        <section className="space-y-6">
           <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">Continue Listening</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
             {inProgress.map(book => (
               <BookCard key={book.id} book={book} onClick={() => onBookSelect(book)} />
             ))}
           </div>
        </section>
      )}

      <section className="space-y-6">
        <div className="flex items-center gap-3">
           <h2 className="text-2xl font-bold text-white tracking-tight">All Books</h2>
           <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
          {sortedBooks.map(book => (
            <BookCard key={book.id} book={book} onClick={() => onBookSelect(book)} />
          ))}
        </div>
      </section>
    </div>
  );
};
