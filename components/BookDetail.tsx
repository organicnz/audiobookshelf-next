
'use client';

import React, { useState } from 'react';
import { Book } from '../types';
import { X, Play, BookOpen, Bot, Mic, FileText, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import { usePlayer } from '../context/PlayerContext';
import { generateSummary, chatWithBook, generateTTSPreview } from '../app/actions';
import { decodeAudioData } from '../services/audioUtils';

interface BookDetailProps {
  book: Book;
  onClose: () => void;
}

export const BookDetail: React.FC<BookDetailProps> = ({ book, onClose }) => {
  const { playBook, previewAudioBuffer } = usePlayer();
  const [activeTab, setActiveTab] = useState<'info' | 'ai'>('info');
  
  // AI State
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);

  const handleSummary = async () => {
    setLoadingSummary(true);
    const result = await generateSummary(book.title, book.author);
    setSummary(result);
    setLoadingSummary(false);
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);

    const result = await chatWithBook(book.title, book.author, userMsg);
    setChatHistory(prev => [...prev, { role: 'ai', text: result }]);
    setChatLoading(false);
  };

  const handleTTSPreview = async () => {
    setTtsLoading(true);
    const textToRead = `Here is a preview of ${book.title} by ${book.author}. ${book.description.substring(0, 150)}`;
    
    // Server Action returns base64 string
    const base64Audio = await generateTTSPreview(textToRead);
    
    if (base64Audio) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000
      });
      // Decode on client
      const buffer = await decodeAudioData(base64Audio, audioContext, 24000, 1);
      previewAudioBuffer(buffer);
    } else {
      alert("Could not generate audio preview. Check API Key.");
    }
    setTtsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-background/90 w-full max-w-4xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10 backdrop-blur-xl">
        
        {/* Mobile Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 md:hidden z-10 bg-black/50 p-2 rounded-full text-white">
          <X className="w-6 h-6" />
        </button>

        {/* Left Panel: Cover & Key Actions */}
        <div className="w-full md:w-1/3 bg-black/20 p-6 flex flex-col items-center border-b md:border-b-0 md:border-r border-white/5 overflow-y-auto">
          <img src={book.cover} alt={book.title} className="w-48 rounded-lg shadow-2xl mb-6 object-cover aspect-[2/3] ring-1 ring-white/10" />
          
          <h2 className="text-xl font-bold text-center text-white mb-1">{book.title}</h2>
          <p className="text-slate-400 mb-6 text-center">{book.author}</p>

          <div className="flex flex-col gap-3 w-full">
            <Button onClick={() => playBook(book)} className="w-full gap-2 justify-center bg-indigo-600 hover:bg-indigo-700 text-white">
              <Play className="w-4 h-4 fill-current" /> Play Audiobook
            </Button>
            <Button 
                variant="secondary" 
                className="w-full gap-2 justify-center bg-white/5 border-white/10 hover:bg-white/10"
                onClick={handleTTSPreview}
                disabled={ttsLoading}
            >
              <Mic className="w-4 h-4" /> 
              {ttsLoading ? 'Generating Audio...' : 'AI Narrator Preview'}
            </Button>
            {book.series && (
               <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5 w-full text-sm text-center">
                 <span className="text-slate-400">Part of series</span>
                 <div className="text-indigo-300 font-medium">{book.series}</div>
               </div>
            )}
          </div>
        </div>

        {/* Right Panel: Content */}
        <div className="flex-1 flex flex-col h-full bg-transparent">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
             <div className="flex space-x-1 bg-black/40 p-1 rounded-lg border border-white/5">
                <button 
                  onClick={() => setActiveTab('info')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'info' ? 'bg-white/10 text-white shadow ring-1 ring-white/5' : 'text-slate-400 hover:text-white'}`}
                >
                  <BookOpen className="w-4 h-4" /> Info
                </button>
                <button 
                   onClick={() => setActiveTab('ai')}
                   className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'ai' ? 'bg-indigo-500/80 text-white shadow ring-1 ring-indigo-500/50' : 'text-slate-400 hover:text-white'}`}
                >
                   <Bot className="w-4 h-4" /> Ask AI
                </button>
             </div>
             <button onClick={onClose} className="hidden md:block text-slate-400 hover:text-white transition-colors">
               <X className="w-6 h-6" />
             </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {activeTab === 'info' ? (
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" /> Description
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                    {book.description}
                  </p>
                </section>

                <section>
                  <div className="flex items-center justify-between mb-3">
                     <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                       <Bot className="w-5 h-5 text-indigo-400" /> AI Summary
                     </h3>
                     {!summary && (
                       <Button size="sm" variant="ghost" onClick={handleSummary} disabled={loadingSummary}>
                         {loadingSummary ? 'Thinking...' : 'Generate'}
                       </Button>
                     )}
                  </div>
                  {summary ? (
                    <div className="p-4 bg-white/5 rounded-lg border border-white/5 text-slate-300 text-sm italic">
                      {summary}
                    </div>
                  ) : (
                    <div className="p-8 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center text-slate-500 gap-2">
                      <Bot className="w-8 h-8 opacity-50" />
                      <p className="text-sm">Ask Gemini to summarize this book instantly.</p>
                    </div>
                  )}
                </section>

                <div className="flex flex-wrap gap-2">
                  {book.genres.map(g => (
                    <span key={g} className="px-3 py-1 bg-white/5 text-slate-300 rounded-full text-xs font-medium border border-white/5">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-1 space-y-4 mb-4">
                  {chatHistory.length === 0 && (
                    <div className="text-center text-slate-500 mt-10">
                      <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Ask anything about <span className="text-white font-medium">{book.title}</span>.</p>
                      <p className="text-xs mt-2">"Who is the protagonist?"</p>
                      <p className="text-xs">"What is the main theme?"</p>
                    </div>
                  )}
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white/10 text-slate-200 border border-white/5 rounded-bl-none'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 p-3 rounded-lg rounded-bl-none flex gap-1">
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                      </div>
                    </div>
                  )}
                </div>
                
                <form onSubmit={handleChat} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask Gemini about this book..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-600"
                  />
                  <Button type="submit" disabled={chatLoading || !chatInput.trim()} size="icon" className="bg-indigo-600 hover:bg-indigo-700">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
