'use client';

import React, { useState } from 'react';
import { Library } from '../components/Library';
import { BookDetail } from '../components/BookDetail';
import { Book } from '../types';

export default function Home() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <>
      <Library onBookSelect={setSelectedBook} />
      {selectedBook && (
        <BookDetail 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
        />
      )}
    </>
  );
}