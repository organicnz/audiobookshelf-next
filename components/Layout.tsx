import React from 'react';
import { Player } from './Player';
import { Library, Settings, Radio, BarChart3, Search } from 'lucide-react';
import { Button } from './ui/button';
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
    { id: 'library', label: 'Library', icon: Library, href: '/' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
    { id: 'series', label: 'Series', icon: Radio, href: '/series' },
  ];

  return (
    <div className="min-h-screen bg-background text-slate-200 pb-24">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-surface/80 backdrop-blur-md border-b border-white/5 px-4 h-16 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
               <span className="font-bold text-white text-lg">A</span>
            </div>
            <span className="font-semibold text-lg hidden md:block tracking-tight text-white">Audiobookshelf Next</span>
         </div>

         <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search library..." 
                 className="w-full bg-slate-900/50 border border-slate-700 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
               />
            </div>
         </div>

         <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
               <Settings className="w-5 h-5 text-slate-400" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
         </div>
      </nav>

      <div className="flex pt-16 min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 fixed left-0 top-16 bottom-0 bg-surface border-r border-white/5 hidden md:flex flex-col p-4">
           <div className="space-y-1">
              <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-2">Menu</p>
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
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
           </div>
           
           <div className="mt-auto p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <h5 className="text-xs font-semibold text-slate-300 mb-1">Serverless Stack</h5>
              <p className="text-[10px] text-slate-500 leading-tight">
                Powered by Vercel, Supabase, Upstash & MotherDuck.
              </p>
           </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 animate-in fade-in duration-500">
           {children}
        </main>
      </div>

      <Player />
    </div>
  );
};