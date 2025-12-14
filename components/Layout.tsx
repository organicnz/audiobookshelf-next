import React from 'react';
import { Player } from './Player';
import { Library, Settings, Radio, BarChart3, Search, Home, User, Disc, BookMarked } from 'lucide-react';
import { Button } from './ui/Button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
  activeView?: string;
  onNavigate?: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  const pathname = usePathname();

  const navItems = [
    { id: 'library', label: 'Library', icon: Home, href: '/' },
    { id: 'series', label: 'Series', icon: BookMarked, href: '/series' },
    { id: 'analytics', label: 'Stats', icon: BarChart3, href: '/analytics' },
    { id: 'authors', label: 'Authors', icon: User, href: '#' },
    { id: 'narrators', label: 'Narrators', icon: Disc, href: '#' },
  ];

  return (
    <div className="min-h-screen text-slate-200 pb-32">
      {/* Background Overlay for Depth */}
      <div className="fixed inset-0 bg-black/40 pointer-events-none z-[-1] gpu-accelerated" />

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 md:left-64 z-40 bg-black/20 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex items-center justify-between transition-all duration-300 gpu-accelerated">
         <div className="md:hidden flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
               <span className="font-bold text-white text-lg">A</span>
            </div>
         </div>

         <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-white transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search your library..." 
                 className="w-full bg-white/5 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:bg-white/10 focus:border-white/10 focus:ring-1 focus:ring-white/20 transition-all placeholder:text-white/20"
               />
            </div>
         </div>

         <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10">
               <Settings className="w-5 h-5" />
            </Button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-lg">
               <div className="w-full h-full rounded-full bg-slate-900 border-2 border-transparent overflow-hidden">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
               </div>
            </div>
         </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-black/30 backdrop-blur-2xl border-r border-white/5 hidden md:flex flex-col z-50 gpu-accelerated">
         <div className="h-16 flex items-center px-6 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                 <span className="font-bold text-white text-lg">ABS</span>
              </div>
              <span className="font-semibold text-white tracking-tight">Audiobookshelf</span>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
            <div className="px-3 mb-2 text-xs font-semibold text-white/40 uppercase tracking-wider">Browse</div>
            {navItems.map((item) => {
              const isActive = activeView ? activeView === item.id : pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate(item.id);
                    }
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                    isActive
                      ? 'bg-white/10 text-white shadow-inner border border-white/5' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-white'}`} />
                  {item.label}
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
                </Link>
              );
            })}
         </div>
         
         <div className="p-4 mt-auto">
            <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-4 border border-white/10 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <h5 className="text-xs font-semibold text-white mb-1">Bleeding Edge</h5>
              <p className="text-[10px] text-white/60 leading-relaxed">
                Supabase • Next.js 16 • Tailwind • Gemini AI
              </p>
            </div>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="md:ml-64 pt-20 px-4 md:px-8 animate-in fade-in duration-500">
         {children}
      </main>

      <Player />
    </div>
  );
};