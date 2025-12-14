import React from 'react';
import { createClient } from '../../utils/supabase/server';
import { Book, mapDbBookToBook } from '../../types';
import { MOCK_BOOKS } from '../../constants';
import ClientPageWrapper from '../../components/ClientPageWrapper';

export default async function SeriesPage() {
  const supabase = await createClient();
  let books: Book[] = [];

  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      books = data.map(mapDbBookToBook);
    } else {
        books = MOCK_BOOKS;
    }
  } catch (e) {
      books = MOCK_BOOKS;
  }

  return (
    <ClientPageWrapper books={books} view="series" />
  );
}