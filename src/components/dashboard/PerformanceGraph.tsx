"use client";

import { motion } from "framer-motion";

interface DataPoint {
  x: number;
  y: number;
  label: string;
}

export function PerformanceGraph({ data }: { data: DataPoint[] }) {
  const height = 240;
  const width = 800;
  
  // Padding inside SVG to prevent edge cutting for dots and tooltips
  const paddingX = 40; 
  const paddingYTop = 30;
  const paddingYBottom = 30;
  
  const innerWidth = width - (paddingX * 2);
  const innerHeight = height - paddingYTop - paddingYBottom;

  // We map pure X numeric sequence evenly across width
  const points = data.map((d, i) => {
    const px = paddingX + (data.length > 1 ? (i / (data.length - 1)) * innerWidth : innerWidth / 2);
    // Y is a percentage out of 100
    const py = paddingYTop + (innerHeight - (d.y / 100) * innerHeight);
    return { px, py, original: d };
  });

  // Generator for smooth cubic Bezier path
  const generateSmoothPath = () => {
    if (points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].px},${points[0].py} L ${width-paddingX},${points[0].py}`;
    
    let path = `M ${points[0].px},${points[0].py}`;
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlPointX = (current.px + next.px) / 2;
      path += ` C ${controlPointX},${current.py} ${controlPointX},${next.py} ${next.px},${next.py}`;
    }
    return path;
  };

  const smoothPath = generateSmoothPath();
  
  // To draw a gradient area underneath, we combine the curve path with bounds closing down to the x-axis
  const areaPath = points.length > 1 
    ? `${smoothPath} L ${points[points.length - 1].px},${height - paddingYBottom} L ${points[0].px},${height - paddingYBottom} Z`
    : "";

  return (
    <div className="p-8 rounded-3xl bg-black/40 border border-white/5 backdrop-blur-[60px] relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden group/graph">
      {/* Liquid Glass Highlight */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-[1px]" />

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white tracking-tight">Cognitive Development</h3>
        <p className="text-sm font-medium text-white/40 mt-1">Real-time analytical mapping of your quiz trajectory</p>
      </div>
      
      <div className="relative w-full overflow-x-auto custom-scrollbar">
        <div style={{ width: `${width}px`, height: `${height}px` }} className="relative mx-auto lg:mx-0">
          
          {/* Aesthetic Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col pointer-events-none z-0" style={{ padding: `${paddingYTop}px 0 ${paddingYBottom}px 0` }}>
            {[100, 75, 50, 25, 0].map((val, idx) => (
              <div 
                key={val} 
                className="w-full relative flex-1 flex flex-col justify-start"
              >
                <div className="w-full border-t border-white/[0.03]" />
                <span className="absolute left-0 -top-2.5 text-[10px] font-semibold tracking-wider text-white/30">{val}%</span>
              </div>
            ))}
          </div>

          <svg width={width} height={height} className="overflow-visible absolute inset-0 z-10">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>

              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>

              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Fill Area underneath the curve */}
            {areaPath && (
              <motion.path
                d={areaPath}
                fill="url(#areaGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            )}

            {/* The main glowing line sequence */}
            <motion.path
              d={smoothPath}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            
            {/* Interactive Data Points overlay */}
            {points.map((pt, i) => (
              <g key={i} className="group/point">
                {/* Invisible larger hover target circle */}
                <circle cx={pt.px} cy={pt.py} r="20" fill="transparent" className="cursor-pointer" />
                
                {/* The visual dot */}
                <motion.circle
                  cx={pt.px}
                  cy={pt.py}
                  r="5"
                  className="fill-[#0f1123] stroke-[#38bdf8] group-hover/point:fill-[#38bdf8] group-hover/point:scale-[1.8] origin-center transition-all duration-300 shadow-[0_0_10px_#38bdf8]"
                  strokeWidth="2.5"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5 + (i * 0.05) }}
                />

                {/* SVG Text Label bridging HTML styled tooltip */}
                <g className="opacity-0 group-hover/point:opacity-100 transition-opacity duration-300">
                  <rect 
                    x={pt.px - 35} 
                    y={pt.py - 45} 
                    width="70" 
                    height="32" 
                    rx="8" 
                    fill="#18181b" 
                    className="stroke-white/10" 
                    strokeWidth="1"
                  />
                  <text 
                    x={pt.px} 
                    y={pt.py - 28} 
                    textAnchor="middle" 
                    fill="white" 
                    fontSize="13" 
                    fontWeight="600"
                  >
                    {pt.original.y}%
                  </text>
                  <text 
                    x={pt.px} 
                    y={pt.py - 18} 
                    textAnchor="middle" 
                    fill="#9ca3af" 
                    fontSize="9"
                  >
                    {pt.original.label}
                  </text>
                </g>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
