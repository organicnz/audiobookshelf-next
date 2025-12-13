import React, { useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import { Layout } from './components/Layout';
import { Library } from './components/Library';
import { BookDetail } from './components/BookDetail';
import { Analytics } from './components/Analytics';
import { SeriesView } from './components/SeriesView';
import { MOCK_BOOKS } from './constants';
import { Book } from './types';

function App() {
  const [activeView, setActiveView] = useState('library');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <PlayerProvider>
      <Layout activeView={activeView} onNavigate={setActiveView}>
        {activeView === 'library' && (
          <Library initialBooks={MOCK_BOOKS} onBookSelect={setSelectedBook} />
        )}
        
        {activeView === 'analytics' && (
          <Analytics />
        )}

        {activeView === 'series' && (
          <SeriesView initialBooks={MOCK_BOOKS} onBookSelect={setSelectedBook} />
        )}

        {selectedBook && (
          <BookDetail 
            book={selectedBook} 
            onClose={() => setSelectedBook(null)} 
          />
        )}
      </Layout>
    </PlayerProvider>
  );
}

export default App;