import React, { useState } from 'react';
import { 
  Database, 
  Cpu, 
  Satellite, 
  CheckCircle2, 
  Code2, 
  Layers, 
  BookOpen, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileText
} from 'lucide-react';
import { TECHNICAL_CATALOG } from '../data/climateData';

export default function DataModels() {
  const [activeSchemaTab, setActiveSchemaTab] = useState('forecastApi');
  const [expandedModel, setExpandedModel] = useState(2); // default Ridge open

  // Sample API Schemas for future Python FastAPI/Flask integration
  const apiSchemas = {
    forecastApi: {
      endpoint: "GET /api/v1/forecast/predict",
      description: "Generates multi-horizon forecasts using Ridge model with IMD & INSAT features",
      exampleRequest: `{
  "region": "mumbai",
  "horizon_days": 1,
  "issue_date": "2026-10-30",
  "models": ["Ridge", "Persistence", "Climatology"]
}`,
      exampleResponse: `{
  "status": "success",
  "region": "mumbai",
  "horizon_days": 1,
  "target_date": "2026-10-31",
  "predictions": {
    "tmax_c": {
      "Ridge": 33.24,
      "Persistence": 33.60,
      "Climatology": 32.85,
      "confidence_interval_90": [32.10, 34.38]
    },
    "rain_mm": {
      "Ridge": 18.20,
      "Persistence": 12.40,
      "Climatology": 14.50,
      "wet_day_probability": 0.82
    }
  },
  "provenance": {
    "model_version": "ridge-v1.4-alpha10",
    "features_used": 14,
    "source_archive": "IMD_025_DAILY_10YR"
  }
}`
    },
    gridApi: {
      endpoint: "GET /api/v1/geospatial/grid",
      description: "Returns GeoJSON features of IMD 0.25° rainfall and 1.0° temperature cells",
      exampleRequest: `{
  "bbox": [18.35, 72.70, 19.35, 74.05],
  "layers": ["imd_rain_025", "imd_temp_100", "insat_lst_4km"]
}`,
      exampleResponse: `{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "cell_id": "MUM_G5",
        "product": "IMD_RAIN_025",
        "centroid": [19.00, 73.00],
        "rain_mm_24h": 15.0,
        "climatology_mm": 12.8,
        "anomaly_pct": 17.1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[72.875, 18.875], [73.125, 18.875], [73.125, 19.125], [72.875, 19.125], [72.875, 18.875]]]
      }
    }
  ]
}`
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title & Technical Context */}
      <div className="bg-space-900/90 rounded-2xl p-6 border border-space-700/80 shadow-panel">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Technical Specifications & Provenance
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Database className="w-6 h-6 text-cyan-400" />
                Data Products, Model Architectures & API Integration
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Complete catalog of India Meteorological Department (IMD) observational archives, ISRO MOSDAC geostationary products, machine learning formulations, and validation protocols aligned with ISRO Hackathon 2026 Problem Statement 5.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="px-3 py-1.5 rounded-lg bg-space-850 border border-space-800">
              Protocol: Leak-Free Time-Series Split
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Observational & Satellite Datasets Registry */}
      <div className="bg-space-900/90 rounded-2xl p-6 border border-space-700/80 shadow-panel space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-space-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              National Climate Data Ingestion Registry
            </h3>
            <p className="text-xs text-slate-400">
              Primary observational and remote sensing data feeds supporting the Maharashtra Digital Twin.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TECHNICAL_CATALOG.datasets.map((dataset, idx) => {
            const isInsat = dataset.code.startsWith('3RIMG');
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-space-850/80 border border-space-800 flex flex-col justify-between hover:border-space-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                    <span className="text-slate-400">{dataset.source}</span>
                    <span className={`px-1.5 py-0.5 rounded font-bold ${
                      isInsat ? 'bg-purple-500/20 text-purple-300' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {dataset.code}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2 leading-tight">
                    {dataset.productName}
                  </h4>

                  <div className="space-y-1.5 text-xs font-mono text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Spatial Res:</span>
                      <span className="text-white font-medium">{dataset.resolution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Temporal:</span>
                      <span>{dataset.temporal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Historical Span:</span>
                      <span>{dataset.period}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Format:</span>
                      <span>{dataset.format}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-space-800/80 text-[11px] text-slate-400 font-sans">
                  <span className="text-slate-300 font-semibold block mb-0.5">Pipeline Status:</span>
                  <span className={dataset.integrationStatus.includes('Processed') ? 'text-emerald-400' : 'text-amber-400'}>
                    {dataset.integrationStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Mathematical Formulations & ML Models */}
      <div className="bg-space-900/90 rounded-2xl p-6 border border-space-700/80 shadow-panel space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-space-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Machine Learning Baseline & Forecasting Formulations
            </h3>
            <p className="text-xs text-slate-400">
              Rigorous mathematical specs of baselines (Persistence, Climatology) and regularized Ridge regression.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {TECHNICAL_CATALOG.models.map((model, idx) => {
            const isExpanded = expandedModel === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-space-850/80 border border-space-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedModel(isExpanded ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-space-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-space-950 border border-space-700 flex items-center justify-center text-xs font-mono font-bold text-cyan-400">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {model.name}
                        <span className="text-xs font-normal font-mono text-slate-400">({model.type})</span>
                      </h4>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-space-800/80 space-y-3 text-xs leading-relaxed animate-fadeIn">
                    <div className="p-3 rounded-lg bg-space-950 font-mono text-cyan-300 border border-space-750">
                      <span className="text-slate-400 text-[10px] block mb-1">Mathematical Objective:</span>
                      <code>{model.formula}</code>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                      <div>
                        <strong className="text-white block mb-0.5">Physical / Statistical Assumption:</strong>
                        <p className="text-slate-400">{model.assumptions}</p>
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">Evaluation Strengths:</strong>
                        <p className="text-slate-400">{model.strengths}</p>
                      </div>
                    </div>

                    {model.features && (
                      <div className="p-2.5 rounded-lg bg-space-900 border border-space-800 font-mono text-[11px]">
                        <strong className="text-cyan-300 block mb-1">Feature Engineering Vector:</strong>
                        <span className="text-slate-300">{model.features}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Training & Validation Split Protocol */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-space-900/90 rounded-2xl p-6 border border-space-700/80 shadow-panel space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-space-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              Train / Test Validation Protocol
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-space-850 border border-space-800">
              <div className="flex items-center justify-between font-mono mb-1">
                <span className="text-cyan-300 font-bold">1. Training Archive (2015 – 2021)</span>
                <span className="text-slate-400">7 Full Years (2,557 days)</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Used to estimate Climatology day-of-year means and optimize Ridge regression weights (alpha=10).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-space-850 border border-amber-500/20">
              <div className="flex items-center justify-between font-mono mb-1">
                <span className="text-amber-300 font-bold">2. Purge / Buffer Period (2022)</span>
                <span className="text-slate-400">1 Year Embargo</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Temporal purge window to strictly eliminate lookahead bias and prevent autocorrelation leakage from 30-day rolling windows.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-space-850 border border-emerald-500/30">
              <div className="flex items-center justify-between font-mono mb-1">
                <span className="text-emerald-400 font-bold">3. Out-of-Sample Test Window (2023 – 2024)</span>
                <span className="text-slate-400">Strict Holdout Evaluation</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Rigorous benchmark on completely unseen monsoon and post-monsoon cycles. All MAE/RMSE/Skill scores reported in this dashboard originate from this test split.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Python Backend API Integration Spec */}
        <div className="bg-space-900/90 rounded-2xl p-6 border border-space-700/80 shadow-panel space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-space-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                Python Backend API Schema
              </h3>
              <p className="text-xs text-slate-400">
                Ready-to-wire REST/JSON contract for Python backend.
              </p>
            </div>

            {/* Toggle Schema */}
            <div className="flex bg-space-850 p-1 rounded-lg border border-space-800 text-xs font-mono">
              <button
                onClick={() => setActiveSchemaTab('forecastApi')}
                className={`px-2.5 py-1 rounded ${activeSchemaTab === 'forecastApi' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
              >
                Forecast Endpoint
              </button>
              <button
                onClick={() => setActiveSchemaTab('gridApi')}
                className={`px-2.5 py-1 rounded ${activeSchemaTab === 'gridApi' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
              >
                Grid GeoJSON
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 font-bold">POST</span>
              <code>{apiSchemas[activeSchemaTab].endpoint}</code>
            </div>
            <p className="text-slate-400 text-xs">{apiSchemas[activeSchemaTab].description}</p>

            <div className="bg-space-950 p-3 rounded-xl border border-space-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56">
              <pre>{apiSchemas[activeSchemaTab].exampleResponse}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

