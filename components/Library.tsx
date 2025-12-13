import React from 'react';
import { MOCK_BOOKS } from '../constants';
import { BookCard } from './BookCard';
import { Book } from '../types';

interface LibraryProps {
  onBookSelect: (book: Book) => void;
}

export const Library: React.FC<LibraryProps> = ({ onBookSelect }) => {
  // Sort books: Recently added first
  const sortedBooks = [...MOCK_BOOKS].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

  // Group by "Continue Listening" vs "All"
  const inProgress = sortedBooks.filter(b => b.progress > 0 && b.progress < b.duration);

  return (
    <div className="space-y-8">
      {inProgress.length > 0 && (
        <section>
           <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
             <span className="w-1.5 h-6 bg-accent rounded-full"></span>
             Continue Listening
           </h2>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
             {inProgress.map(book => (
               <BookCard key={book.id} book={book} onClick={() => onBookSelect(book)} />
             ))}
           </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
           <span className="w-1.5 h-6 bg-primary rounded-full"></span>
           Library
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {sortedBooks.map(book => (
            <BookCard key={book.id} book={book} onClick={() => onBookSelect(book)} />
          ))}
        </div>
      </section>
    </div>
  );
};
