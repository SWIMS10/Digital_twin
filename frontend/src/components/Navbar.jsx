import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  TrendingUp, 
  Sliders, 
  Database,
  Satellite,
  Compass
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    {
      id: 'overview',
      label: '1. Overview',
      subtitle: 'KPIs & Climate State',
      icon: LayoutDashboard,
    },
    {
      id: 'geospatial',
      label: '2. Geospatial Explorer',
      subtitle: '0.25° & 1° Grids & Layers',
      icon: Map,
    },
    {
      id: 'forecasting',
      label: '3. Forecasting',
      subtitle: '1-Day & 3-Day Multi-Model',
      icon: TrendingUp,
    },
    {
      id: 'scenarios',
      label: '4. Scenario Simulator',
      subtitle: 'Stress Testing & Anomaly',
      icon: Sliders,
    },
    {
      id: 'datamodels',
      label: '5. Data & Models',
      subtitle: 'IMD / MOSDAC / Specs',
      icon: Database,
    },
  ];

  return (
    <nav className="bg-space-900/60 border-b border-space-700/60 sticky top-20 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-space-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div>{item.label}</div>
                  <div className={`text-[10px] font-normal leading-tight hidden md:block ${
                    isActive ? 'text-cyan-400/80' : 'text-slate-400'
                  }`}>
                    {item.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

