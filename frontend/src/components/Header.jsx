import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  Satellite, 
  MapPin, 
  Radio, 
  Layers, 
  Activity, 
  Cpu, 
  Sparkles 
} from 'lucide-react';
import { DATA_DISCLAIMER } from '../data/climateData';

export default function Header({ selectedRegion, setSelectedRegion }) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC') + ' | ' + 
        now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-space-900/90 backdrop-blur-md border-b border-space-700/60 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Main Title */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-indigo-600/30 border border-cyan-500/40 shadow-glow-cyan">
              <Satellite className="w-6 h-6 text-cyan-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 radar-dot border-2 border-space-900"></div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  ISRO BAH 2026 • PS-5
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  IMD 2015-2025 Pipeline
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight truncate flex items-center gap-2">
                Digital Twin of India's Climate
                <span className="text-xs font-normal text-slate-400 hidden md:inline">| Maharashtra PoC</span>
              </h1>
            </div>
          </div>

          {/* Region Switcher & Telemetry Bar */}
          <div className="flex items-center gap-3">
            {/* Region Switcher */}
            <div className="flex items-center bg-space-850 p-1 rounded-xl border border-space-700/80 shadow-inner">
              <button
                onClick={() => setSelectedRegion('mumbai')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedRegion === 'mumbai'
                    ? 'bg-cyan-600 text-white shadow-glow-cyan'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-space-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                Mumbai
                <span className="text-[10px] font-mono opacity-80 hidden lg:inline">(Konkan)</span>
              </button>
              <button
                onClick={() => setSelectedRegion('pune')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedRegion === 'pune'
                    ? 'bg-blue-600 text-white shadow-glow-blue'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-space-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                Pune
                <span className="text-[10px] font-mono opacity-80 hidden lg:inline">(Deccan)</span>
              </button>
            </div>

            {/* Live Clock & Telemetry */}
            <div className="hidden xl:flex flex-col text-right font-mono text-[11px] text-slate-400 border-l border-space-750 pl-3">
              <div className="text-cyan-400 font-medium flex items-center justify-end gap-1.5">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                {currentTime || 'Synchronizing UTC/IST...'}
              </div>
              <div className="text-[10px] text-slate-400">
                Grid: 0.25° Rain | 1.0° Temp
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

