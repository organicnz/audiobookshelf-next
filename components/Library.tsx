'use client';

import * as React from 'react';
import { BookCard } from './BookCard';
import { Book } from '../types';
import { ImportBookDialog } from './ImportBookDialog';

interface LibraryProps {
  initialBooks: Book[];
  onBookSelect: (book: Book) => void;
}

export const Library: React.FC<LibraryProps> = ({ initialBooks, onBookSelect }) => {
  // Sort books: Recently added first
  const sortedBooks = [...initialBooks].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

  // Group by "Continue Listening" vs "All"
  const inProgress = sortedBooks.filter(b => b.progress > 0 && b.progress < b.duration);

  return (
    <div className="space-y-12 pb-24">
      {/* Header with Import Action */}
      <div className="flex items-center justify-between mb-8">
         <h1 className="text-3xl font-bold tracking-tight text-white">My Library</h1>
         <ImportBookDialog />
      </div>

      {initialBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[40vh] text-slate-500 border-2 border-dashed border-white/5 rounded-2xl bg-white/5">
            <p className="mb-4">No books found in library.</p>
            <ImportBookDialog />
          </div>
      ) : (
          <>
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
          </>
      )}
    </div>
  );
};