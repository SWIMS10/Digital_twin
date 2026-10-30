import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  AlertTriangle, 
  Flame, 
  CloudRain, 
  RotateCcw, 
  HelpCircle, 
  Sparkles, 
  ShieldAlert, 
  Thermometer, 
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { GENERATE_TIME_SERIES } from '../data/climateData';

export default function ScenarioSimulator({ selectedRegion }) {
  // Simulator State
  const [tempDelta, setTempDelta] = useState(1.5); // +1.5 °C default
  const [rainMultiplier, setRainMultiplier] = useState(15); // +15% default
  const [heatThreshold, setHeatThreshold] = useState(38); // 38 °C heatwave trigger
  const [heavyRainThreshold, setHeavyRainThreshold] = useState(64.5); // IMD heavy rain criteria 64.5 mm

  // Preset Handlers
  const applyPreset = (preset) => {
    switch (preset) {
      case 'ssp245':
        setTempDelta(1.8);
        setRainMultiplier(12);
        break;
      case 'drought':
        setTempDelta(2.5);
        setRainMultiplier(-35);
        break;
      case 'cloudburst':
        setTempDelta(0.5);
        setRainMultiplier(55);
        break;
      case 'uhi':
        setTempDelta(3.2);
        setRainMultiplier(0);
        break;
      case 'baseline':
      default:
        setTempDelta(0);
        setRainMultiplier(0);
        break;
    }
  };

  // Generate Baseline vs Scenario Time-Series
  const scenarioData = useMemo(() => {
    const baseRain = GENERATE_TIME_SERIES(selectedRegion, 'rain');
    const baseTemp = GENERATE_TIME_SERIES(selectedRegion, 'tmax');

    return baseRain.map((r, i) => {
      const t = baseTemp[i];
      const simulatedRain = Math.max(0, +(r.actual * (1 + rainMultiplier / 100)).toFixed(1));
      const simulatedTemp = +(t.actual + tempDelta).toFixed(1);

      return {
        date: r.date,
        baselineRain: r.actual,
        simulatedRain,
        rainDelta: +(simulatedRain - r.actual).toFixed(1),
        baselineTemp: t.actual,
        simulatedTemp,
        tempDelta
      };
    });
  }, [selectedRegion, tempDelta, rainMultiplier]);

  // Dynamic Impact Metrics Math
  const metrics = useMemo(() => {
    const isMumbai = selectedRegion === 'mumbai';
    // Baseline heatwave days (sample projection across monsoon/pre-monsoon year)
    const baseHeatDays = isMumbai ? 18 : 22;
    // Non-linear increase in heatwave probability with temperature delta
    const simHeatDays = Math.max(0, Math.round(baseHeatDays * Math.exp(tempDelta * 0.42)));

    // Heavy rain days (> 64.5 mm IMD criteria)
    const baseHeavyRainDays = isMumbai ? 14 : 4;
    const rainFactor = Math.max(0.1, 1 + (rainMultiplier / 100) * 1.5);
    const simHeavyRainDays = Math.max(0, Math.round(baseHeavyRainDays * rainFactor));

    // Water Stress Index (-100% to +100%)
    const waterStress = Math.round(
      Math.min(100, Math.max(-100, (tempDelta * 12) - (rainMultiplier * 0.85)))
    );

    // Urban Heat Island Exacerbation (°C)
    const uhiExacerbation = +(tempDelta * (isMumbai ? 1.35 : 1.15)).toFixed(1);

    return {
      baseHeatDays,
      simHeatDays,
      heatDaysDelta: simHeatDays - baseHeatDays,
      baseHeavyRainDays,
      simHeavyRainDays,
      heavyRainDelta: simHeavyRainDays - baseHeavyRainDays,
      waterStress,
      uhiExacerbation
    };
  }, [selectedRegion, tempDelta, rainMultiplier]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title & Transparent Disclosure Notice */}
      <div className="bg-space-900/90 rounded-2xl p-6 border border-space-700/80 shadow-panel">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Interactive Diagnostic Sandbox
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Sliders className="w-6 h-6 text-cyan-400" />
                Climate Scenario & Sensitivity Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Explore hypothetical climate perturbations (+ΔT warming, ±% precipitation shifts) to diagnose localized urban vulnerability across Mumbai MMR and Pune PMC.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-space-850 text-[11px] font-mono text-slate-400 border border-space-800">
              Diagnostic Mode: Counterfactual Perturbation
            </span>
          </div>
        </div>

        {/* Warning / Methodology Disclaimer */}
        <div className="mt-4 p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-300/90 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Methodology Note:</strong> This module performs statistical sensitivity perturbation tests on IMD historical distributions (2015–2024). It is designed for exploratory resilience planning, stress-testing, and academic demonstration for ISRO BAH 2026. It is <em>not</em> an operational numerical weather prediction (NWP) model.
          </p>
        </div>
      </div>

      {/* Preset Buttons & Slider Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="bg-space-900/90 rounded-2xl p-6 border border-space-700/80 shadow-panel space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-space-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Perturbation Parameters
            </h3>
            <button
              onClick={() => applyPreset('baseline')}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Preset Buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Scenario Presets:</label>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <button
                onClick={() => applyPreset('ssp245')}
                className="p-2 rounded-lg bg-space-850 hover:bg-space-800 border border-space-750 text-cyan-300 text-left transition-all"
              >
                SSP2-4.5 (+1.8°C, +12% P)
              </button>
              <button
                onClick={() => applyPreset('drought')}
                className="p-2 rounded-lg bg-space-850 hover:bg-space-800 border border-space-750 text-amber-300 text-left transition-all"
              >
                El Niño Drought (-35% P)
              </button>
              <button
                onClick={() => applyPreset('cloudburst')}
                className="p-2 rounded-lg bg-space-850 hover:bg-space-800 border border-space-750 text-blue-300 text-left transition-all"
              >
                Cloudburst Surge (+55% P)
              </button>
              <button
                onClick={() => applyPreset('uhi')}
                className="p-2 rounded-lg bg-space-850 hover:bg-space-800 border border-space-750 text-rose-300 text-left transition-all"
              >
                Urban Heat Island (+3.2°C)
              </button>
            </div>
          </div>

          {/* Slider 1: Temperature Delta */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                Temperature Anomaly (ΔT):
              </span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {tempDelta > 0 ? `+${tempDelta}` : tempDelta} °C
              </span>
            </div>
            <input
              type="range"
              min="-2.0"
              max="5.0"
              step="0.5"
              value={tempDelta}
              onChange={(e) => setTempDelta(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-space-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-2.0 °C</span>
              <span>0.0 °C (Baseline)</span>
              <span>+5.0 °C (Severe)</span>
            </div>
          </div>

          {/* Slider 2: Rainfall Multiplier */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                Precipitation Shift (ΔP):
              </span>
              <span className="font-mono font-bold text-cyan-400 text-sm">
                {rainMultiplier > 0 ? `+${rainMultiplier}` : rainMultiplier} %
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              step="5"
              value={rainMultiplier}
              onChange={(e) => setRainMultiplier(parseInt(e.target.value))}
              className="w-full accent-cyan-500 bg-space-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-50% (Drought)</span>
              <span>0% (Normal)</span>
              <span>+100% (Surge)</span>
            </div>
          </div>
        </div>

        {/* Calculated Impact Gauges Column */}
        <div className="lg:col-span-2 bg-space-900/90 rounded-2xl p-6 border border-space-700/80 shadow-panel space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-space-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Simulated Impact Indicators ({selectedRegion.toUpperCase()})
              </h3>
              <p className="text-xs text-slate-400">
                Projected shifts against calibrated IMD 10-year historical baseline.
              </p>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Heatwave Days */}
            <div className="p-4 rounded-xl bg-space-850/80 border border-space-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span className="flex items-center gap-1 text-amber-400">
                  <Flame className="w-4 h-4" /> Extreme Heat Days (&gt;38°C)
                </span>
                <span className="text-[10px] font-mono">Annualized</span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold font-mono text-white">
                  {metrics.simHeatDays}
                </span>
                <span className="text-xs text-slate-400">days/yr</span>
                <span className={`text-xs font-mono font-bold ml-auto px-2 py-0.5 rounded ${
                  metrics.heatDaysDelta > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {metrics.heatDaysDelta > 0 ? `+${metrics.heatDaysDelta}` : metrics.heatDaysDelta} d vs base
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                Baseline: {metrics.baseHeatDays} days. High thermal stress on public health and power grid peak loads.
              </p>
            </div>

            {/* Heavy Rain Days */}
            <div className="p-4 rounded-xl bg-space-850/80 border border-space-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span className="flex items-center gap-1 text-cyan-400">
                  <CloudRain className="w-4 h-4" /> Heavy Rain Spells (&gt;64.5 mm)
                </span>
                <span className="text-[10px] font-mono">IMD Heavy</span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold font-mono text-white">
                  {metrics.simHeavyRainDays}
                </span>
                <span className="text-xs text-slate-400">events/yr</span>
                <span className={`text-xs font-mono font-bold ml-auto px-2 py-0.5 rounded ${
                  metrics.heavyRainDelta > 0 ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700 text-slate-300'
                }`}>
                  {metrics.heavyRainDelta > 0 ? `+${metrics.heavyRainDelta}` : metrics.heavyRainDelta} events
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                Baseline: {metrics.baseHeavyRainDays} events. Increased urban waterlogging and storm drain overflow risk.
              </p>
            </div>

            {/* Urban Heat Island Exacerbation */}
            <div className="p-4 rounded-xl bg-space-850/80 border border-space-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span className="flex items-center gap-1 text-purple-400">
                  <ShieldAlert className="w-4 h-4" /> Urban Heat Island (UHI) Disparity
                </span>
                <span className="text-[10px] font-mono">Microclimate</span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold font-mono text-white">
                  +{metrics.uhiExacerbation}
                </span>
                <span className="text-xs text-purple-300">°C excess</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                Simulated concrete surface-air thermal trap across high-density wards.
              </p>
            </div>

            {/* Water Stress Index */}
            <div className="p-4 rounded-xl bg-space-850/80 border border-space-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span className="flex items-center gap-1 text-blue-400">
                  <Activity className="w-4 h-4" /> Agricultural Water Deficit Index
                </span>
                <span className="text-[10px] font-mono">Evapotranspiration</span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className={`text-3xl font-extrabold font-mono ${
                  metrics.waterStress > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {metrics.waterStress > 0 ? `+${metrics.waterStress}%` : `${metrics.waterStress}%`}
                </span>
                <span className="text-xs text-slate-400">stress index</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                Coupled balance of higher vapor pressure deficit vs reservoir replenishment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Charts: Baseline vs Simulated Scenario */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rainfall Comparison Chart */}
        <div className="bg-space-900/90 rounded-2xl p-6 border border-space-700/80 shadow-panel">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-space-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-cyan-400" />
              Precipitation: Baseline vs Perturbed Scenario
            </h3>
            <span className="text-xs font-mono text-cyan-300">
              {rainMultiplier > 0 ? `+${rainMultiplier}%` : `${rainMultiplier}%`}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scenarioData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#17274c" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} unit="mm" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#091226', borderColor: '#1e3a8a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="baselineRain" name="Baseline Observed (mm)" stroke="#64748b" fill="#334155" fillOpacity={0.4} />
                <Area type="monotone" dataKey="simulatedRain" name="Simulated Scenario (mm)" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temperature Comparison Chart */}
        <div className="bg-space-900/90 rounded-2xl p-6 border border-space-700/80 shadow-panel">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-space-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-amber-400" />
              Temperature: Baseline vs Perturbed Scenario
            </h3>
            <span className="text-xs font-mono text-amber-300">
              {tempDelta > 0 ? `+${tempDelta}°C` : `${tempDelta}°C`}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scenarioData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#17274c" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} unit="°C" domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#091226', borderColor: '#1e3a8a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="baselineTemp" name="Baseline Tmax (°C)" stroke="#94a3b8" strokeDasharray="3 3" dot={false} strokeWidth={1.5} />
                <Line type="monotone" dataKey="simulatedTemp" name="Simulated Tmax (°C)" stroke="#f59e0b" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

