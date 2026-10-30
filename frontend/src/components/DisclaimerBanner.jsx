import React, { useState } from 'react';
import { AlertTriangle, Info, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { DATA_DISCLAIMER } from '../data/climateData';

export default function DisclaimerBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  if (isDismissed) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-amber-950/40 via-blue-950/40 to-cyan-950/40 border-b border-amber-500/30 px-4 py-2.5 text-xs text-amber-200/90 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold uppercase tracking-wider text-[10px] border border-amber-500/40">
            <AlertTriangle className="w-3 h-3 text-amber-400 animate-pulse" />
            {DATA_DISCLAIMER.label}
          </span>
          <span className="text-slate-300">
            PoC frontend running on <strong className="text-white">calibrated IMD 2015–2025 baseline models</strong>.
            INSAT-3DR MOSDAC feeds and scenario simulations are synthetic/demo representations.
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setShowDetailsModal(true)}
            className="flex items-center gap-1 text-cyan-300 hover:text-cyan-200 underline underline-offset-2 transition-colors font-medium"
          >
            <Info className="w-3 h-3" />
            View Data & Pipeline Disclosures
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss banner"
            className="text-slate-400 hover:text-slate-200 p-0.5 rounded hover:bg-white/5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-space-900 border border-cyan-500/30 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-cyan-500/10 rounded-lg border border-cyan-500/30 text-cyan-400">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">Data Source & Model Integrity Notice</h3>
                <p className="text-xs text-cyan-300 font-mono">ISRO Bharatiya Antariksh Hackathon 2026 – Problem Statement 5</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              <div className="p-3 bg-space-850 rounded-lg border border-slate-800">
                <h4 className="font-semibold text-white mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Real Processed Baseline Data (IMD):
                </h4>
                <p className="text-slate-400">
                  Model verification metrics (MAE, RMSE, Skill Scores, POD, FAR, CSI) are derived from the project's Python pipeline evaluating IMD 0.25° daily rainfall and 1.0° daily Tmax/Tmin datasets (2015–2021 training, 2023–2024 out-of-sample test).
                </p>
              </div>

              <div className="p-3 bg-space-850 rounded-lg border border-slate-800">
                <h4 className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> INSAT-3DR MOSDAC Staged Integration:
                </h4>
                <p className="text-slate-400">
                  Products <code className="text-cyan-300 font-mono">3RIMG_L2B_LST</code>, <code className="text-cyan-300 font-mono">3RIMG_L2B_SST</code>, and <code className="text-cyan-300 font-mono">3RIMG_L2B_IMC</code> are cataloged and structured according to ISRO SAC specs. In this standalone frontend PoC, live satellite feeds are simulated for visualization and are labelled as <strong>DEMO</strong>.
                </p>
              </div>

              <div className="p-3 bg-space-850 rounded-lg border border-slate-800">
                <h4 className="font-semibold text-cyan-300 mb-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" /> Scenario Simulator Nature:
                </h4>
                <p className="text-slate-400">
                  The Scenario Simulator performs counterfactual statistical sensitivity perturbations based on historical distribution shifts. It is an experimental analytical tool for risk stress-testing, not an operational physics-based numerical weather prediction (NWP) model.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-glow-cyan"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

