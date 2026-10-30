import React, { useState } from 'react';
import { 
  CloudRain, 
  Thermometer, 
  Sun, 
  Wind, 
  Droplets, 
  Compass, 
  ExternalLink, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Satellite, 
  AlertCircle,
  TrendingUp,
  MapPin,
  ChevronRight,
  Database
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import KpiCard from '../components/KpiCard';
import { 
  REGIONS_CONFIG, 
  HISTORICAL_ANNUAL_TRENDS, 
  SEVEN_DAY_FORECAST, 
  SYSTEM_STATUS_DATA 
} from '../data/climateData';

export default function Overview({ selectedRegion, setSelectedRegion, setActiveTab }) {
  const currentRegion = REGIONS_CONFIG[selectedRegion];
  const forecastList = SEVEN_DAY_FORECAST[selectedRegion];
  const [trendMetric, setTrendMetric] = useState('rainfall'); // 'rainfall' | 'temperature'

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Hero Context */}
      <div className="bg-gradient-to-r from-space-900 via-space-850 to-space-900 rounded-3xl p-6 sm:p-8 border border-space-700/80 shadow-panel relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold flex items-center gap-1.5">
                <Satellite className="w-3.5 h-3.5 text-cyan-400" />
                ISRO Bharatiya Antariksh Hackathon 2026
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-space-800 border border-space-700 text-slate-300 font-mono text-xs">
                Problem Statement 5: Digital Twin
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              {currentRegion.name}
              <span className="text-sm sm:text-base font-normal text-slate-400">
                ({currentRegion.subtitle})
              </span>
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Real-time operational digital twin monitoring combining high-resolution IMD gridded observations (0.25° rain, 1.0° temperature) and staged INSAT-3DR MOSDAC remote sensing products for urban flood risk, heat stress, and agricultural resilience in Maharashtra.
            </p>
          </div>

          {/* Quick Region Selector & Geographic Stats */}
          <div className="bg-space-950/80 p-4 rounded-2xl border border-space-750/90 flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[260px] text-xs font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-space-800 text-slate-400">
              <span>Domain Coordinates:</span>
              <span className="text-cyan-300 font-semibold">
                {currentRegion.bounds.latMin}°N - {currentRegion.bounds.latMax}°N
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-space-800 text-slate-400">
              <span>Elevation / Zone:</span>
              <span className="text-white">{currentRegion.elevation}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Rain Grid Res:</span>
              <span className="text-emerald-400 font-semibold">{currentRegion.rainGridRes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row (Rainfall / Tmax / Tmin / INSAT LST) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KpiCard
          title="Daily Rainfall"
          subtitle="IMD 0.25° Grid Point Mean"
          value={currentRegion.kpis.currentRain}
          unit="mm/day"
          anomaly={currentRegion.kpis.rainAnomaly}
          anomalyLabel="vs 10-Yr Climatology"
          isPositiveGood={true}
          icon={CloudRain}
          accentColor="cyan"
          badge="IMD 0.25°"
          footerNote={currentRegion.kpis.rainStatus}
        />

        <KpiCard
          title="Max Temperature (Tmax)"
          subtitle="IMD 1.0° Gridded Cell"
          value={currentRegion.kpis.currentTmax}
          unit="°C"
          anomaly={currentRegion.kpis.tmaxAnomaly}
          anomalyLabel="Normal Departure"
          isPositiveGood={false}
          icon={Thermometer}
          accentColor="amber"
          badge="IMD 1.0°"
          footerNote={`Min: ${currentRegion.kpis.currentTmin}°C`}
        />

        <KpiCard
          title="Night-time Min (Tmin)"
          subtitle="Diurnal Cooling Cycle"
          value={currentRegion.kpis.currentTmin}
          unit="°C"
          anomaly={currentRegion.kpis.tminAnomaly}
          anomalyLabel="Departure"
          isPositiveGood={false}
          icon={Sun}
          accentColor="blue"
          badge="IMD 1.0°"
          footerNote={`RH: ${currentRegion.kpis.relativeHumidity}`}
        />

        <KpiCard
          title="INSAT-3DR LST / SST"
          subtitle="MOSDAC 4km Thermal Band"
          value={currentRegion.kpis.insatLst}
          unit="°C (LST)"
          anomaly={currentRegion.kpis.insatSst ? `${currentRegion.kpis.insatSst}°C SST` : "Inland Plateau"}
          anomalyLabel="Offshore SST"
          isPositiveGood={true}
          icon={Satellite}
          accentColor="purple"
          badge="DEMO / STAGED"
          footerNote="3RIMG_L2B_LST"
        />
      </div>

      {/* 7-Day Forecast Summary Bar */}
      <div className="bg-space-900/90 rounded-2xl p-6 border border-space-700/80 shadow-panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-space-800 gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              7-Day Synoptic Forecast Outlook
            </h3>
            <p className="text-xs text-slate-400">
              Multi-horizon forecast generated via Ridge Regression baseline calibrated with IMD historical series.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('forecasting')}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors self-start sm:self-auto"
          >
            Detailed Model Evaluation & Benchmarks
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecastList.map((item, idx) => {
            const isToday = idx === 0;
            const alertColor = 
              item.alert === 'amber' ? 'border-amber-500/50 bg-amber-500/10 text-amber-300' :
              item.alert === 'yellow' ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300' :
              'border-emerald-500/30 bg-emerald-500/5 text-emerald-400';

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all ${
                  isToday 
                    ? 'border-cyan-500/60 bg-cyan-950/20 shadow-glow-cyan' 
                    : 'border-space-800 bg-space-850/60 hover:border-space-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>{item.date}</span>
                  {isToday && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                      Current
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-white mb-2">{item.day.split(' ')[0]}</div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-cyan-300">
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <CloudRain className="w-3 h-3 text-cyan-400" /> Rain:
                    </span>
                    <span className="font-bold">{item.rain} <span className="text-[10px]">mm</span></span>
                  </div>

                  <div className="flex items-center justify-between text-amber-300">
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Thermometer className="w-3 h-3 text-amber-400" /> Tmax:
                    </span>
                    <span>{item.tmax}°C</span>
                  </div>

                  <div className="flex items-center justify-between text-blue-300">
                    <span className="text-[11px] text-slate-400">Tmin:</span>
                    <span>{item.tmin}°C</span>
                  </div>
                </div>

                <div className={`mt-2.5 pt-2 border-t border-space-800/80 text-[10px] font-medium text-center truncate rounded px-1 py-0.5 border ${alertColor}`}>
                  {item.condition}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Charts & Geospatial Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historical Climate Trends (2015-2024) */}
        <div className="lg:col-span-2 bg-space-900/90 rounded-2xl p-6 border border-space-700/80 shadow-panel">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-space-800 gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                10-Year Decadal Climate Trends (2015 – 2024)
              </h3>
              <p className="text-xs text-slate-400">
                IMD Gridded Historical Archive comparison between Mumbai (Konkan coast) and Pune (Deccan plateau).
              </p>
            </div>

            {/* Metric Toggle */}
            <div className="flex items-center bg-space-850 p-1 rounded-xl border border-space-800 text-xs font-mono">
              <button
                onClick={() => setTrendMetric('rainfall')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  trendMetric === 'rainfall'
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Annual Rain (mm)
              </button>
              <button
                onClick={() => setTrendMetric('temperature')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  trendMetric === 'temperature'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tmax (°C) & Heat Days
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {trendMetric === 'rainfall' ? (
                <BarChart data={HISTORICAL_ANNUAL_TRENDS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#17274c" />
                  <XAxis dataKey="year" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit="mm" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#091226', borderColor: '#1e3a8a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                  <Bar dataKey="mumbaiRain" name="Mumbai Annual Rain (mm)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="puneRain" name="Pune Annual Rain (mm)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <ComposedChart data={HISTORICAL_ANNUAL_TRENDS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#17274c" />
                  <XAxis dataKey="year" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis yAxisId="temp" stroke="#f59e0b" domain={[30, 35]} unit="°C" tick={{ fill: '#f59e0b', fontSize: 11 }} />
                  <YAxis yAxisId="days" orientation="right" stroke="#ef4444" domain={[0, 40]} unit="d" tick={{ fill: '#ef4444', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#091226', borderColor: '#1e3a8a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                  <Line yAxisId="temp" type="monotone" dataKey="mumbaiTmaxMean" name="Mumbai Mean Tmax (°C)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  <Line yAxisId="temp" type="monotone" dataKey="puneTmaxMean" name="Pune Mean Tmax (°C)" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
                  <Bar yAxisId="days" dataKey="extremeHeatDays" name="Extreme Heat Days (>38°C)" fill="#ef4444" fillOpacity={0.6} radius={[4, 4, 0, 0]} />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-space-800 pt-2">
            <span>Note: 2019 was recorded as Maharashtra's highest monsoonal anomaly in 65 years.</span>
            <span className="font-mono text-cyan-400">Source: IMD Daily Gridded Archive</span>
          </div>
        </div>

        {/* Regional Geography & Geospatial Quick Preview */}
        <div className="bg-space-900/90 rounded-2xl p-6 border border-space-700/80 shadow-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-space-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                PoC Spatial Domain
              </h3>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono text-[10px] border border-blue-500/30">
                Maharashtra
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Demonstrates contrasting climate regimes separated by the Western Ghats (Sahyadri): Coastal hyper-monsoon Mumbai vs rain-shadow Deccan plateau Pune.
            </p>

            {/* Quick Station Stats */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-space-850/80 border border-space-800">
                <div className="text-xs font-semibold text-cyan-300 mb-1 flex items-center justify-between">
                  <span>Mumbai Urban MMR Box</span>
                  <span className="text-[10px] font-mono text-slate-400">9 IMD Cells</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono">
                  <div>Rain: <strong className="text-white">2,890 mm</strong>/yr</div>
                  <div>Tmax Avg: <strong className="text-white">33.3 °C</strong></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-space-850/80 border border-space-800">
                <div className="text-xs font-semibold text-blue-300 mb-1 flex items-center justify-between">
                  <span>Pune Urban PMC Box</span>
                  <span className="text-[10px] font-mono text-slate-400">4 IMD Cells</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono">
                  <div>Rain: <strong className="text-white">840 mm</strong>/yr</div>
                  <div>Tmax Avg: <strong className="text-white">32.6 °C</strong></div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('geospatial')}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-glow-cyan flex items-center justify-center gap-2"
          >
            <Layers className="w-4 h-4" />
            Launch Interactive Geospatial Explorer
          </button>
        </div>
      </div>

      {/* System Pipeline Status Matrix */}
      <div className="bg-space-900/90 rounded-2xl p-6 border border-space-700/80 shadow-panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-space-800 gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              National Climate Data Pipeline Ingestion Status
            </h3>
            <p className="text-xs text-slate-400">
              Live audit of observational NetCDF streams, INSAT MOSDAC geostationary products, and ML inference baseline.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('datamodels')}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
          >
            Technical Data Dictionary <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-space-800 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                <th className="py-2.5 px-3">Data Stream / Product</th>
                <th className="py-2.5 px-3">Resolution & Format</th>
                <th className="py-2.5 px-3">Domain Coverage</th>
                <th className="py-2.5 px-3">Ingestion Status</th>
                <th className="py-2.5 px-3">Cadence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-800/60 font-mono">
              {SYSTEM_STATUS_DATA.map((row, index) => {
                const isRealActive = row.status.includes('Active') || row.status.includes('Operational');
                return (
                  <tr key={index} className="hover:bg-space-850/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isRealActive ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400'}`}></span>
                        {row.name}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{row.product}</td>
                    <td className="py-3 px-3 text-slate-400">{row.coverage}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        isRealActive 
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{row.latency}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

