"use client";

import { motion } from "framer-motion";

export function Heatmap({ logs }: { logs: string[] }) {
  // Generate last 365 days to match a full year of tracking
  const today = new Date();
  today.setHours(0,0,0,0);
  const days = [];
  
  // Create a map of day strings to exact engagement counts
  const counts = logs.reduce((acc: Record<string, number>, iso) => {
    const dStr = iso.split('T')[0];
    acc[dStr] = (acc[dStr] || 0) + 1;
    return acc;
  }, {});

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    
    const count = counts[dStr] || 0;
    
    // Liquid Glass Apple-grade coloring transitions
    let intensityClass = "bg-[#18181b]/50 border-white/[0.03] shadow-inner"; 
    
    if (count > 0 && count <= 2) {
      intensityClass = "bg-indigo-500/30 border-indigo-400/20 shadow-[0_0_8px_rgba(99,102,241,0.15)]";
    } else if (count > 2 && count <= 5) {
      intensityClass = "bg-purple-500/50 border-purple-400/30 shadow-[0_0_12px_rgba(168,85,247,0.3)]";
    } else if (count > 5) {
      intensityClass = "bg-teal-400 border-teal-300 shadow-[0_0_16px_rgba(45,212,191,0.5)] shadow-teal-400/20";
    }

    days.push({ date: d, count, intensityClass });
  }

  return (
    <div className="p-8 rounded-3xl bg-black/40 border border-white/5 backdrop-blur-[60px] relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Refined subtle top glow */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent blur-[1px]" />
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-semibold text-white tracking-tight">Activity Fabric</h3>
          <p className="text-sm font-medium text-white/40 mt-1">365-day engagement density matrix</p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 font-medium backdrop-blur-md">
          {logs.length} Total Logs
        </div>
      </div>
      
      <div className="grid grid-flow-col grid-rows-7 gap-1.5 justify-start align-top overflow-x-auto pb-4 custom-scrollbar smooth-scroll">
        {days.map((day, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.002, ease: "easeOut" }}
            className={`w-[12px] h-[12px] sm:w-[14px] sm:h-[14px] rounded-[4px] border ${day.intensityClass} transition-all duration-300 hover:scale-125 cursor-crosshair relative group hover:z-20`}
          >
            {/* Elegant Tooltip overlay */}
            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-2 bg-[#18181b]/95 border border-white/10 text-white text-[11px] rounded-lg pointer-events-none whitespace-nowrap shadow-2xl backdrop-blur-xl transition-all duration-200 translate-y-2 group-hover:translate-y-0">
              <div className="font-semibold text-white/90 mb-0.5">{day.count} Interactions</div>
              <div className="text-white/40">{day.date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</div>
              
              {/* Tooltip triangle tail */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#18181b]/95 border-r border-b border-white/10 rotate-45" />
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs font-medium tracking-tight text-white/40">
        <span>Less</span>
        <div className="w-3 h-3 rounded-[3px] bg-[#18181b]/50 border border-white/[0.03]" />
        <div className="w-3 h-3 rounded-[3px] bg-indigo-500/30 border border-indigo-400/20" />
        <div className="w-3 h-3 rounded-[3px] bg-purple-500/50 border border-purple-400/30" />
        <div className="w-3 h-3 rounded-[3px] bg-teal-400 border border-teal-300" />
        <span>More</span>
      </div>
    </div>
  );
}
