# AI-Powered Digital Twin of India's Climate Using National Data
### ISRO Bharatiya Antariksh Hackathon 2026 – Problem Statement 5
**PoC Scope:** Mumbai MMR (Konkan Coast) & Pune PMC (Deccan Plateau), Maharashtra

---

## 🛰️ Project Overview
This project is an advanced, scientific climate intelligence frontend developed for the **ISRO Bharatiya Antariksh Hackathon 2026 (Problem Statement 5)**. It provides a real-time, interactive digital twin interface for monitoring, forecasting, and stress-testing climate variables across Maharashtra using India's national observational datasets and satellite remote sensing products.

### Primary Data Sources:
- **IMD High-Resolution Gridded Daily Rainfall:** `0.25° × 0.25°` (~27.5 km)
- **IMD Gridded Daily Maximum & Minimum Temperature:** `1.0° × 1.0°` (~110 km)
- **ISRO SAC MOSDAC Geostationary Satellite Products (INSAT-3DR / 3D):**
  - `3RIMG_L2B_LST`: Land Surface Temperature (4 km Thermal Infrared)
  - `3RIMG_L2B_SST`: Sea Surface Temperature (4 km Arabian Sea Split-Window)
  - `3RIMG_L2B_IMC`: Multi-Spectral Rain Rate / Cloud Microphysics

---

## 🖥️ Interactive Application Pages

1. **Overview Dashboard:**
   - Real-time KPI cards for Daily Rainfall, Tmax, Tmin, and INSAT LST/SST with climatological anomaly departures.
   - Region selector: Mumbai MMR vs Pune PMC.
   - 7-Day synoptic outlook forecast strip with IMD color-coded weather warning levels (Green, Yellow, Amber).
   - 10-Year historical decadal trends (2015–2024) comparing Mumbai monsoonal extremes against Pune rain-shadow.
   - National climate data pipeline ingestion status matrix.

2. **Geospatial Climate Explorer:**
   - High-fidelity interactive Leaflet map in dark-navy cartographic mode.
   - Multi-layer toggles for IMD 0.25° rainfall sub-grids, IMD 1.0° temperature cells, INSAT LST thermal envelope, INSAT SST coastal transect, and IMD Automatic Weather Stations (AWS).
   - Interactive spatial inspector: probe any grid cell or station to view coordinates, primary observations, elevation, and data provenance.
   - Scientific precipitation and temperature gradient color ramps.

3. **Forecasting Engine:**
   - Multi-horizon forecast evaluation: 1-Day Ahead ($h=1$) and 3-Day Ahead ($h=3$).
   - Dual variable selector: Daily Maximum Temperature ($T_{\max}$) and Precipitation ($\text{mm}$).
   - Observed vs. Predicted interactive time-series with zoom brush.
   - Statistical baselines (Persistence, Climatology) compared against L2-regularized Ridge Regression ($\alpha=10$).
   - Evaluation metrics: MAE, RMSE, Skill Score vs. Persistence (\%), and Skill Score vs. Climatology (\%).
   - IMD Categorical Wet-Day Verification Table (Threshold = 2.5 mm) with POD (Probability of Detection), FAR (False Alarm Ratio), and CSI (Critical Success Index).

4. **Scenario Simulator (Sensitivity Sandbox):**
   - Interactive counterfactual perturbation controls: Temperature shift ($\Delta T$ from $-2.0^\circ\text{C}$ to $+5.0^\circ\text{C}$) and Rainfall anomaly ($\Delta P$ from $-50\%$ to $+100\%$).
   - Quick-load IPCC presets: SSP2-4.5 Mid-Century, Severe El Niño Drought, Cloudburst Surge, and Urban Heat Island (UHI).
   - Dynamic impact calculators: Projected extreme heat days ($>38^\circ\text{C}$), heavy downpour events ($>64.5\text{ mm}$ IMD criteria), UHI excess, and agricultural water deficit.
   - Baseline vs. Simulated scenario comparative time-series and area charts.

5. **Data & Models Architecture:**
   - Complete technical catalog of IMD and INSAT MOSDAC products.
   - Mathematical formulations, feature vectors, and physical assumptions.
   - Strict temporal split protocol: Train (2015–2021), 1-Year Purge/Buffer (2022) to prevent autocorrelation leakage, and Test (2023–2024).
   - Ready-to-wire JSON REST API schemas for future Python (FastAPI/Flask) backend integration.

---

## 🗂️ Project Directory Structure

```
c:\Users\hp\Desktop\twin1\
└── frontend\
    ├── index.html                  # HTML entry point with Leaflet & Google Fonts
    ├── package.json                # React 18, Vite 6, Tailwind CSS, Leaflet, Recharts
    ├── postcss.config.js           # PostCSS configuration
    ├── tailwind.config.js          # Custom scientific navy/cyan/amber design tokens
    ├── vite.config.js              # Vite server & build configuration
    ├── public\
    │   └── satellite.svg           # ISRO BAH satellite favicon
    └── src\
        ├── main.jsx                # React DOM root entry
        ├── App.jsx                 # Application layout coordinator
        ├── index.css               # Tailwind directives & dark Leaflet styles
        ├── components\
        │   ├── Header.jsx          # ISRO BAH 2026 header, live IST clock, region toggle
        │   ├── Navbar.jsx          # 5-page tab navigation bar
        │   ├── KpiCard.jsx         # Scientific metric card with anomaly badges
        │   └── DisclaimerBanner.jsx# Prominent DEMO / baseline validation disclosure banner
        ├── data\
        │   └── climateData.js      # IMD & INSAT datasets, baseline results & grid points
        └── pages\
            ├── Overview.jsx           # Page 1: KPIs, 7-day outlook, decadal trends
            ├── GeospatialExplorer.jsx # Page 2: Leaflet 0.25°/1.0° interactive map
            ├── Forecasting.jsx        # Page 3: 1d/3d forecasts, skill metrics & wet-day table
            ├── ScenarioSimulator.jsx  # Page 4: Interactive climate perturbation sandbox
            └── DataModels.jsx         # Page 5: Datasets catalog, math formulations, API spec
```

---

## 🚀 How to Run Locally (Windows Command Prompt)

### 1. Open Windows Command Prompt (`cmd.exe`)
Navigate to the `frontend/` directory:
```cmd
cd c:\Users\hp\Desktop\twin1\frontend
```

### 2. Ensure Node.js is in your PATH (if not globally registered)
```cmd
set PATH=C:\Program Files\nodejs;%PATH%
```

### 3. Start the Vite Development Server
```cmd
npm run dev
```
The application will launch at:
```
http://localhost:3000/
```
Open this URL in Google Chrome, Microsoft Edge, or any modern web browser.

### 4. Optional: Run Production Build / Preview
To compile an optimized static production bundle:
```cmd
npm run build
npm run preview
```

---

## 🔒 Data Provenance & Academic Integrity Notice
- **Ground-Truth Calibration:** Baseline forecast evaluation metrics (MAE, RMSE, Skill Scores, POD, FAR, CSI) are calibrated using the project's Python pipeline trained on IMD historical NetCDF archives (2015–2021) and evaluated on out-of-sample data (2023–2024).
- **INSAT/MOSDAC Feeds:** Products `3RIMG_L2B_LST`, `3RIMG_L2B_SST`, and `3RIMG_L2B_IMC` are formatted according to official ISRO SAC specifications. In this standalone frontend, they are explicitly labelled as **DEMO / SYNTHESIZED** pending live socket integration.
- **Scenario Simulator:** Serves as a counterfactual diagnostic sensitivity engine for urban resilience planning, not an operational physics-based NWP model.

