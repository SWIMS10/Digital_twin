import React, { useState } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import DisclaimerBanner from './components/DisclaimerBanner';
import Overview from './pages/Overview';
import GeospatialExplorer from './pages/GeospatialExplorer';
import Forecasting from './pages/Forecasting';
import ScenarioSimulator from './pages/ScenarioSimulator';
import DataModels from './pages/DataModels';
import { Satellite, Globe2, ShieldCheck, Database, Layers } from 'lucide-react';

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState('mumbai'); // 'mumbai' | 'pune'
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'geospatial' | 'forecasting' | 'scenarios' | 'datamodels'

  return (
    <div className="min-h-screen bg-[#050b17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Protocol / Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Main Top Header */}
      <Header 
        selectedRegion={selectedRegion} 
        setSelectedRegion={setSelectedRegion} 
      />

      {/* Tab Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Main Page Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'overview' && (
          <Overview 
            selectedRegion={selectedRegion} 
            setSelectedRegion={setSelectedRegion} 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'geospatial' && (
          <GeospatialExplorer 
            selectedRegion={selectedRegion} 
            setSelectedRegion={setSelectedRegion} 
          />
        )}

        {activeTab === 'forecasting' && (
          <Forecasting 
            selectedRegion={selectedRegion} 
          />
        )}

        {activeTab === 'scenarios' && (
          <ScenarioSimulator 
            selectedRegion={selectedRegion} 
          />
        )}

        {activeTab === 'datamodels' && (
          <DataModels />
        )}
      </main>

      {/* Scientific Footer */}
      <footer className="bg-space-950 border-t border-space-800/80 py-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Satellite className="w-4 h-4" />
            </div>
            <div>
              <div className="text-white font-semibold text-xs tracking-wide">
                ISRO Bharatiya Antariksh Hackathon 2026 – Problem Statement 5
              </div>
              <div className="text-[11px] text-slate-400">
                AI-Powered Digital Twin of India's Climate Using National Data (IMD 0.25°/1.0° & INSAT MOSDAC)
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              IMD Gridded Baseline v1.4
            </span>
            <span>•</span>
            <span>Domain: Mumbai MMR & Pune PMC</span>
            <span>•</span>
            <span className="text-cyan-400">React + Vite + Leaflet + Recharts</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

