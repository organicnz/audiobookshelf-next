'use client';

import * as React from 'react';
import { Library } from './Library';
import { SeriesView } from './SeriesView';
import { BookDetail } from './BookDetail';
import { Book } from '../types';

interface ClientPageWrapperProps {
  books: Book[];
  view: 'library' | 'series';
}

export default function ClientPageWrapper({ books, view }: ClientPageWrapperProps) {
  const [selectedBook, setSelectedBook] = React.useState<Book | null>(null);

  return (
    <>
      {view === 'library' ? (
        <Library initialBooks={books} onBookSelect={setSelectedBook} />
      ) : (
        <SeriesView initialBooks={books} onBookSelect={setSelectedBook} />
      )}
      
      {selectedBook && (
        <BookDetail 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
        />
      )}
    </>
  );
}