import React, { useState } from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  HelpCircle, 
  SlidersHorizontal, 
  Award, 
  BarChart2, 
  AlertCircle,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Brush
} from 'recharts';
import { 
  MODEL_EVALUATION_METRICS, 
  WET_DAY_VERIFICATION, 
  GENERATE_TIME_SERIES 
} from '../data/climateData';

export default function Forecasting({ selectedRegion }) {
  const [horizon, setHorizon] = useState('1'); // '1' or '3' days ahead
  const [variable, setVariable] = useState('tmax'); // 'tmax' or 'rain'
  const [selectedModelFilter, setSelectedModelFilter] = useState('all'); // 'all', 'Ridge', 'Climatology', 'Persistence'

  const horizonLabel = horizon === '1' ? '1-Day Ahead (h=1)' : '3-Day Ahead (h=3)';
  const variableLabel = variable === 'tmax' ? 'Tmax (°C)' : 'Rainfall (mm)';

  // Find metric block
  const currentMetricBlock = MODEL_EVALUATION_METRICS.find(
    (m) => m.horizon === horizonLabel && m.variable === variableLabel
  ) || MODEL_EVALUATION_METRICS[0];

  // Time series data
  const timeSeriesData = GENERATE_TIME_SERIES(selectedRegion, variable);

  // Filter wet-day verification rows
  const wetDayRows = WET_DAY_VERIFICATION.filter(
    (w) => w.horizon.includes(`h=${horizon}`)
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Title & Controls Strip */}
      <div className="bg-space-900/90 rounded-2xl p-6 border border-space-700/80 shadow-panel">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Evaluation Benchmark
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                Multi-Model Climate Forecasting Engine
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              Comparative forecast evaluation across statistical baselines (Persistence, Climatology) and Ridge Regression with lag dynamics (0..7d), rolling statistics, and seasonal harmonics.
            </p>
          </div>

          {/* Interactive Filters: Horizon & Variable */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Horizon Switcher */}
            <div className="flex items-center bg-space-850 p-1 rounded-xl border border-space-800 text-xs font-mono">
              <span className="text-slate-400 px-2 text-[11px] font-sans">Horizon:</span>
              <button
                onClick={() => setHorizon('1')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  horizon === '1'
                    ? 'bg-cyan-600 text-white shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1-Day Ahead (h=1)
              </button>
              <button
                onClick={() => setHorizon('3')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  horizon === '3'
                    ? 'bg-cyan-600 text-white shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                3-Day Ahead (h=3)
              </button>
            </div>

            {/* Variable Switcher */}
            <div className="flex items-center bg-space-850 p-1 rounded-xl border border-space-800 text-xs font-mono">
              <span className="text-slate-400 px-2 text-[11px] font-sans">Variable:</span>
              <button
                onClick={() => setVariable('tmax')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  variable === 'tmax'
                    ? 'bg-amber-600 text-white shadow-glow-amber'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tmax (°C)
              </button>
              <button
                onClick={() => setVariable('rain')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  variable === 'rain'
                    ? 'bg-blue-600 text-white shadow-glow-blue'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Rainfall (mm)
              </button>
            </div>
          </div>
        </div>

        {/* Model Filter Pills */}
        <div className="mt-4 pt-3 border-t border-space-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Chart Model Filter:</span>
            {['all', 'Ridge', 'Climatology', 'Persistence'].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedModelFilter(m)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all ${
                  selectedModelFilter === m
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'bg-space-850 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {m === 'all' ? 'Show All' : m}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Evaluation Split: Train 2015–2021 | Test 2023–2024
          </div>
        </div>
      </div>

      {/* Main Observed vs Predicted Interactive Chart */}
      <div className="bg-space-900/90 rounded-2xl p-6 border border-space-700/80 shadow-panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-space-800 gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-cyan-400" />
              Observed vs Predicted Time-Series ({selectedRegion.toUpperCase()} Region, {variableLabel})
            </h3>
            <p className="text-xs text-slate-400">
              Evaluated on Out-of-Sample Monsoon Validation window. Drag the brush bar at the bottom to zoom into specific storm spells.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-white">
              <span className="w-3 h-0.5 bg-white"></span> Actual Observed (IMD)
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-3 h-0.5 bg-cyan-400"></span> Ridge (α=10)
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData} margin={{ top: 10, right: 15, left: -5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#17274c" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                unit={variable === 'tmax' ? '°C' : 'mm'}
                domain={variable === 'tmax' ? ['auto', 'auto'] : [0, 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#091226',
                  borderColor: '#1e3a8a',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.8)'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />

              {/* Actual Observations */}
              <Line
                type="monotone"
                dataKey="actual"
                name="Actual Observed"
                stroke="#ffffff"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 6 }}
              />

              {/* Ridge Regression */}
              {(selectedModelFilter === 'all' || selectedModelFilter === 'Ridge') && (
                <Line
                  type="monotone"
                  dataKey="ridge"
                  name="Ridge Regression"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  strokeDasharray="0"
                  dot={false}
                />
              )}

              {/* Climatology */}
              {(selectedModelFilter === 'all' || selectedModelFilter === 'Climatology') && (
                <Line
                  type="monotone"
                  dataKey="climatology"
                  name="Climatology (DOY Mean)"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}

              {/* Persistence */}
              {(selectedModelFilter === 'all' || selectedModelFilter === 'Persistence') && (
                <Line
                  type="monotone"
                  dataKey="persistence"
                  name="Persistence Baseline"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  dot={false}
                />
              )}

              <Brush
                dataKey="date"
                height={26}
                stroke="#06b6d4"
                fill="#0b1733"
                tickFormatter={() => ''}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Performance Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {currentMetricBlock.models.map((model, idx) => {
          const isBest = model.isBest;
          return (
            <div
              key={idx}
              className={`rounded-2xl p-5 border transition-all ${
                isBest
                  ? 'bg-gradient-to-br from-cyan-950/40 via-space-900 to-space-850 border-cyan-500/50 shadow-glow-cyan'
                  : 'bg-space-900/90 border-space-700/80'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  {model.name}
                  {isBest && <Award className="w-4 h-4 text-cyan-400" />}
                </span>
                {isBest ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                    Best Model
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-space-800 text-slate-400 border border-space-700">
                    Baseline
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-space-950/80 border border-space-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">MAE Error</div>
                  <div className="text-xl font-bold font-mono text-white mt-0.5">
                    {model.mae} <span className="text-xs font-normal text-slate-400">{currentMetricBlock.unit}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-space-950/80 border border-space-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">RMSE Error</div>
                  <div className="text-xl font-bold font-mono text-white mt-0.5">
                    {model.rmse} <span className="text-xs font-normal text-slate-400">{currentMetricBlock.unit}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-mono border-t border-space-800/80 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Skill vs Persistence:</span>
                  <span className={`font-bold ${
                    model.skillPersistence > 0 ? 'text-emerald-400' : model.skillPersistence < 0 ? 'text-rose-400' : 'text-slate-400'
                  }`}>
                    {model.skillPersistence > 0 ? `+${model.skillPersistence}%` : `${model.skillPersistence}%`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Skill vs Climatology:</span>
                  <span className={`font-bold ${
                    model.skillClimatology > 0 ? 'text-emerald-400' : model.skillClimatology < 0 ? 'text-rose-400' : 'text-slate-400'
                  }`}>
                    {model.skillClimatology > 0 ? `+${model.skillClimatology}%` : `${model.skillClimatology}%`}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2 text-[11px] text-slate-400 leading-tight">
                {model.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Contingency Table: Wet-Day Verification (IMD 2.5 mm Threshold) */}
      <div className="bg-space-900/90 rounded-2xl p-6 border border-space-700/80 shadow-panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-space-800 gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Categorical Wet-Day Verification (Threshold = 2.5 mm)
            </h3>
            <p className="text-xs text-slate-400">
              IMD defines a rainy day when daily precipitation ≥ 2.5 mm. Evaluates hit rate, false alarms, and critical success index for {horizonLabel}.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-space-800 text-[11px] font-mono text-cyan-300 border border-space-700 self-start sm:self-auto">
            184 Observed Wet Days
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-space-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Forecast Model</th>
                <th className="py-2.5 px-3">Horizon</th>
                <th className="py-2.5 px-3">POD (Hit Rate) ↑</th>
                <th className="py-2.5 px-3">FAR (False Alarm) ↓</th>
                <th className="py-2.5 px-3">CSI (Threat Score) ↑</th>
                <th className="py-2.5 px-3">Meteorological Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-800/60">
              {wetDayRows.map((row, idx) => (
                <tr key={idx} className={row.isBest ? 'bg-cyan-950/20' : 'hover:bg-space-850/50'}>
                  <td className="py-3 px-3 font-semibold text-white flex items-center gap-1.5">
                    {row.model}
                    {row.isBest && <Award className="w-3.5 h-3.5 text-cyan-400" />}
                  </td>
                  <td className="py-3 px-3 text-slate-300">{row.horizon}</td>
                  <td className="py-3 px-3 font-bold text-emerald-400">{row.pod}</td>
                  <td className="py-3 px-3 font-bold text-amber-400">{row.far}</td>
                  <td className="py-3 px-3 font-bold text-cyan-300">{row.csi}</td>
                  <td className="py-3 px-3 text-slate-300 font-sans text-xs">
                    {row.model === 'Ridge Regression'
                      ? 'Superior contingency balance; lowers false alarms by 22% compared to climatology.'
                      : row.model === 'Climatology'
                      ? 'High POD but prone to over-forecasting light rain events (high FAR).'
                      : 'Lags weather transitions by one day, dampening sudden onset detection.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

