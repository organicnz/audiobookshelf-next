import React, { useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import { Layout } from './components/Layout';
import { Library } from './components/Library';
import { BookDetail } from './components/BookDetail';
import { Analytics } from './components/Analytics';
import { Book } from './types';

function App() {
  const [activeView, setActiveView] = useState('library');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <PlayerProvider>
      <Layout activeView={activeView} onNavigate={setActiveView}>
        {activeView === 'library' && (
          <Library onBookSelect={setSelectedBook} />
        )}
        
        {activeView === 'analytics' && (
          <Analytics />
        )}

        {/* Placeholder for Series View */}
        {activeView === 'series' && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
             <h3 className="text-xl font-medium">Series View</h3>
             <p>Organize your books by series. Coming soon.</p>
          </div>
        )}

        {/* Modal for Selected Book */}
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
