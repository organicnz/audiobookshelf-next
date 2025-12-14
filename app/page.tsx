import React from 'react';
import { createClient } from '../utils/supabase/server';
import { Library } from '../components/Library';
import { Book, mapDbBookToBook } from '../types';
import { MOCK_BOOKS } from '../constants';
import ClientPageWrapper from '../components/ClientPageWrapper';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();
  
  // Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  let books: Book[] = [];

  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      books = data.map(mapDbBookToBook);
    } else {
        console.warn("Supabase fetch failed or empty, using mock data:", error);
        books = MOCK_BOOKS;
    }
  } catch (e) {
      console.warn("Supabase connection error, using mock data.", e);
      books = MOCK_BOOKS;
  }

  return (
    <ClientPageWrapper books={books} view="library" />
  );
}