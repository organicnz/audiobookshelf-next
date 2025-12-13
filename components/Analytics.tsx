import React from 'react';
import { BarChart3, Database, Zap } from 'lucide-react';

export const Analytics: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Listening Habits</h2>
          <div className="flex gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Database className="w-3 h-3" /> MotherDuck</span>
            <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Upstash Redis</span>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface p-6 rounded-xl border border-white/5">
             <h3 className="text-slate-400 text-sm font-medium">Total Time (This Month)</h3>
             <p className="text-3xl font-bold text-white mt-2">42.5 hrs</p>
             <div className="mt-2 text-green-400 text-xs flex items-center gap-1">
               ↑ 12% vs last month
             </div>
          </div>
          <div className="bg-surface p-6 rounded-xl border border-white/5">
             <h3 className="text-slate-400 text-sm font-medium">Books Completed</h3>
             <p className="text-3xl font-bold text-white mt-2">3</p>
             <div className="mt-2 text-slate-500 text-xs">
               On track for yearly goal
             </div>
          </div>
          <div className="bg-surface p-6 rounded-xl border border-white/5">
             <h3 className="text-slate-400 text-sm font-medium">Favorite Genre</h3>
             <p className="text-3xl font-bold text-accent mt-2">Sci-Fi</p>
             <div className="mt-2 text-slate-500 text-xs">
               60% of total listening
             </div>
          </div>
       </div>

       <div className="bg-surface p-6 rounded-xl border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Activity (Last 7 Days)</h3>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
             {[45, 120, 30, 0, 90, 60, 150].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                   <div className="w-full bg-slate-800 rounded-t-sm relative h-full flex items-end">
                      <div 
                        className="w-full bg-primary/80 group-hover:bg-primary transition-all rounded-t-sm"
                        style={{ height: `${(val / 150) * 100}%` }}
                      ></div>
                   </div>
                   <span className="text-xs text-slate-500">
                     {['M','T','W','T','F','S','S'][i]}
                   </span>
                </div>
             ))}
          </div>
       </div>
       
       <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-lg flex items-start gap-3">
          <BarChart3 className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-200">Architecture Note</h4>
            <p className="text-xs text-blue-300/80 mt-1">
              In a real deployment, these stats are aggregated via MotherDuck (DuckDB) for high-performance OLAP queries on listening logs, while real-time session progress is cached in Upstash Redis.
            </p>
          </div>
       </div>
    </div>
  );
};
