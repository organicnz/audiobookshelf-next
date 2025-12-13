import React from 'react';
import { BarChart3, Database, Zap, Activity, PieChart } from 'lucide-react';

export const Analytics: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
       <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Analytics</h2>
            <p className="text-slate-400">Powered by MotherDuck (OLAP) & Upstash (Redis).</p>
          </div>
          <div className="flex gap-3 text-xs font-medium">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF2CC]/10 text-[#FFF2CC] border border-[#FFF2CC]/20 hover:bg-[#FFF2CC]/20 transition-colors cursor-default">
               <Database className="w-3.5 h-3.5" /> 
               <span>MotherDuck</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00E9A3]/10 text-[#00E9A3] border border-[#00E9A3]/20 hover:bg-[#00E9A3]/20 transition-colors cursor-default">
               <Zap className="w-3.5 h-3.5" /> 
               <span>Upstash</span>
            </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity className="w-24 h-24 rotate-12" />
             </div>
             <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Time</h3>
             <p className="text-4xl font-bold text-white mt-2">42.5 <span className="text-lg text-slate-500 font-normal">hrs</span></p>
             <div className="mt-4 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-medium">
               ↑ 12% vs last month
             </div>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Database className="w-24 h-24 -rotate-12" />
             </div>
             <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Books Completed</h3>
             <p className="text-4xl font-bold text-white mt-2">12</p>
             <div className="mt-4 text-slate-500 text-xs font-medium">
               On track for yearly goal
             </div>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <PieChart className="w-24 h-24 rotate-45" />
             </div>
             <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Top Genre</h3>
             <p className="text-3xl font-bold text-indigo-400 mt-2 truncate">Science Fiction</p>
             <div className="mt-4 w-full bg-white/5 rounded-full h-1.5">
               <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
             </div>
          </div>
       </div>

       <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            Activity (Last 7 Days)
          </h3>
          <div className="h-64 flex items-end justify-between gap-3 px-2">
             {[45, 120, 30, 0, 90, 60, 150].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                   <div className="w-full bg-white/5 rounded-t-lg relative h-full flex items-end overflow-hidden">
                      <div 
                        className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 opacity-80 group-hover:opacity-100 transition-all duration-500 rounded-t-lg"
                        style={{ height: `${(val / 150) * 100}%` }}
                      ></div>
                   </div>
                   <span className="text-xs font-medium text-slate-500 group-hover:text-white transition-colors">
                     {['M','T','W','T','F','S','S'][i]}
                   </span>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};