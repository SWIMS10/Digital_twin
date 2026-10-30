import React, { useState, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Rectangle, 
  CircleMarker, 
  Popup, 
  Tooltip as LeafletTooltip, 
  useMap,
  Polygon
} from 'react-leaflet';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Satellite, 
  CloudRain, 
  Thermometer, 
  Eye, 
  Info, 
  Crosshair, 
  Maximize2,
  Droplets,
  Wind
} from 'lucide-react';
import { 
  REGIONS_CONFIG, 
  RAIN_GRID_CELLS, 
  TEMP_CELLS_1DEG 
} from '../data/climateData';

// Component to handle map view transitions
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  return null;
}

export default function GeospatialExplorer({ selectedRegion, setSelectedRegion }) {
  const [activeLayers, setActiveLayers] = useState({
    rainfallGrid: true,
    tempCells: true,
    insatLst: true,
    insatSst: true,
    stations: true
  });

  const [selectedEntity, setSelectedEntity] = useState(null);
  const currentRegion = REGIONS_CONFIG[selectedRegion];

  // Map center and zoom
  const [mapCenter, setMapCenter] = useState([18.85, 73.3]);
  const [mapZoom, setMapZoom] = useState(9);

  // Zoom to specific preset
  const handleZoomTo = (target) => {
    if (target === 'mumbai') {
      setSelectedRegion('mumbai');
      setMapCenter(REGIONS_CONFIG.mumbai.center);
      setMapZoom(10);
    } else if (target === 'pune') {
      setSelectedRegion('pune');
      setMapCenter(REGIONS_CONFIG.pune.center);
      setMapZoom(11);
    } else {
      // Entire PoC Maharashtra belt
      setMapCenter([18.85, 73.3]);
      setMapZoom(8);
    }
  };

  // Precipitation color generator
  const getRainColor = (mm) => {
    if (mm >= 25) return '#0284c7'; // dark cyan/blue
    if (mm >= 15) return '#06b6d4'; // cyan
    if (mm >= 8)  return '#38bdf8'; // light sky
    if (mm >= 3)  return '#67e8f9'; // soft cyan
    return '#bae6fd'; // very light
  };

  // Temperature color generator
  const getTempColor = (c) => {
    if (c >= 34) return '#ef4444'; // intense red
    if (c >= 33) return '#f97316'; // orange
    if (c >= 31) return '#f59e0b'; // amber
    return '#fbbf24'; // warm yellow
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Controls & Disclosures */}
      <div className="bg-space-900/90 rounded-2xl p-5 border border-space-700/80 shadow-panel">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Spatial Domain
              </span>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Geospatial Climate Explorer
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              Interactive multi-layer canvas overlaying IMD 0.25° rainfall sub-grids, 1.0° temperature cells, and INSAT-3DR MOSDAC remote sensing simulation.
            </p>
          </div>

          {/* Quick Domain Bounds Nav */}
          <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
            <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
              <Crosshair className="w-3.5 h-3.5" /> Domain Focus:
            </span>
            <button
              onClick={() => handleZoomTo('mumbai')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRegion === 'mumbai'
                  ? 'bg-cyan-600 text-white shadow-glow-cyan'
                  : 'bg-space-800 text-slate-300 hover:bg-space-750'
              }`}
            >
              Mumbai MMR (Konkan)
            </button>
            <button
              onClick={() => handleZoomTo('pune')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRegion === 'pune'
                  ? 'bg-blue-600 text-white shadow-glow-blue'
                  : 'bg-space-800 text-slate-300 hover:bg-space-750'
              }`}
            >
              Pune PMC (Deccan)
            </button>
            <button
              onClick={() => handleZoomTo('all')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-space-800 text-slate-300 hover:bg-space-750"
            >
              Full Maharashtra PoC
            </button>
          </div>
        </div>

        {/* Layer Toggle Strip */}
        <div className="mt-4 pt-3 border-t border-space-800 flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-mono">
          <span className="text-slate-400 text-[11px] font-sans font-medium">Layer Filters:</span>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={activeLayers.rainfallGrid}
              onChange={(e) => setActiveLayers({ ...activeLayers, rainfallGrid: e.target.checked })}
              className="rounded bg-space-950 border-space-700 text-cyan-500 focus:ring-0"
            />
            <span className="text-cyan-300">IMD 0.25° Rain Grids</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={activeLayers.tempCells}
              onChange={(e) => setActiveLayers({ ...activeLayers, tempCells: e.target.checked })}
              className="rounded bg-space-950 border-space-700 text-amber-500 focus:ring-0"
            />
            <span className="text-amber-300">IMD 1.0° T-Cells</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={activeLayers.insatLst}
              onChange={(e) => setActiveLayers({ ...activeLayers, insatLst: e.target.checked })}
              className="rounded bg-space-950 border-space-700 text-purple-500 focus:ring-0"
            />
            <span className="text-purple-300">INSAT LST 3RIMG_L2B</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={activeLayers.insatSst}
              onChange={(e) => setActiveLayers({ ...activeLayers, insatSst: e.target.checked })}
              className="rounded bg-space-950 border-space-700 text-blue-500 focus:ring-0"
            />
            <span className="text-blue-300">INSAT SST Coastal</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={activeLayers.stations}
              onChange={(e) => setActiveLayers({ ...activeLayers, stations: e.target.checked })}
              className="rounded bg-space-950 border-space-700 text-emerald-500 focus:ring-0"
            />
            <span className="text-emerald-300">AWS Synoptic Stations</span>
          </label>
        </div>
      </div>

      {/* Main Map + Inspector Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-3 bg-space-950 rounded-2xl border border-space-700/80 overflow-hidden shadow-panel relative h-[600px] z-10">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', zIndex: 10 }}
          >
            <ChangeMapView center={mapCenter} zoom={mapZoom} />

            {/* Dark Basemap CartoDB */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              maxZoom={19}
            />

            {/* 1.0° Temperature Grid Cells */}
            {activeLayers.tempCells &&
              TEMP_CELLS_1DEG.map((cell) => (
                <Rectangle
                  key={cell.id}
                  bounds={cell.bounds}
                  pathOptions={{
                    color: '#f59e0b',
                    weight: 1.5,
                    dashArray: '4, 4',
                    fillColor: getTempColor(cell.tmax),
                    fillOpacity: 0.12
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedEntity({
                        type: '1.0° Temperature Cell',
                        id: cell.id,
                        name: cell.name,
                        lat: cell.lat,
                        lon: cell.lon,
                        resolution: '1.0° × 1.0° (~110 km)',
                        primaryVar: `Tmax: ${cell.tmax} °C`,
                        secondaryVar: `Tmin: ${cell.tmin} °C`,
                        climatology: `Climatology: ${cell.climatologyTmax} °C`,
                        source: 'IMD Gridded Daily Temperature Archive',
                        status: cell.status
                      });
                    }
                  }}
                >
                  <LeafletTooltip direction="center" opacity={0.9} permanent={false}>
                    <div className="text-xs font-mono font-bold text-amber-300">
                      {cell.name}
                      <div className="text-[10px] text-white">Tmax: {cell.tmax}°C | Tmin: {cell.tmin}°C</div>
                    </div>
                  </LeafletTooltip>
                </Rectangle>
              ))}

            {/* 0.25° Rainfall Grid Cells */}
            {activeLayers.rainfallGrid &&
              RAIN_GRID_CELLS.map((grid) => {
                const half = 0.125;
                const bounds = [
                  [grid.lat - half, grid.lon - half],
                  [grid.lat + half, grid.lon + half]
                ];
                return (
                  <Rectangle
                    key={grid.id}
                    bounds={bounds}
                    pathOptions={{
                      color: '#06b6d4',
                      weight: 1.5,
                      fillColor: getRainColor(grid.rainMm),
                      fillOpacity: 0.45
                    }}
                    eventHandlers={{
                      click: () => {
                        setSelectedEntity({
                          type: '0.25° IMD Rainfall Grid',
                          id: grid.id,
                          name: grid.name,
                          lat: grid.lat,
                          lon: grid.lon,
                          resolution: '0.25° × 0.25° (~27.5 km)',
                          primaryVar: `Precipitation: ${grid.rainMm} mm/day`,
                          secondaryVar: `Est. Tmax: ${grid.tmax} °C`,
                          climatology: `Region: ${grid.region.toUpperCase()}`,
                          source: 'IMD Daily High Resolution Gridded Rainfall',
                          status: 'Operational Real Grid Point'
                        });
                      }
                    }}
                  >
                    <LeafletTooltip direction="top" opacity={0.9}>
                      <div className="text-xs font-mono text-cyan-200">
                        <strong>{grid.name}</strong>
                        <div>Rain: {grid.rainMm} mm | Lat: {grid.lat}° Lon: {grid.lon}°</div>
                      </div>
                    </LeafletTooltip>
                  </Rectangle>
                );
              })}

            {/* INSAT-3DR MOSDAC LST Thermal Representation */}
            {activeLayers.insatLst && (
              <>
                <CircleMarker
                  center={[19.07, 72.95]}
                  radius={28}
                  pathOptions={{
                    color: '#c084fc',
                    weight: 1,
                    fillColor: '#8b5cf6',
                    fillOpacity: 0.22,
                    dashArray: '3, 3'
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedEntity({
                        type: 'INSAT MOSDAC 3RIMG_L2B_LST',
                        id: 'INSAT_LST_MUMBAI_UHI',
                        name: 'Mumbai Urban Heat Island (UHI) Thermal Envelope',
                        lat: 19.07,
                        lon: 72.95,
                        resolution: '4 km at Nadir (Thermal IR Split Window)',
                        primaryVar: 'LST: 35.2 °C (308.35 K)',
                        secondaryVar: 'Surface-Air Gradient: +1.6 °C UHI',
                        climatology: 'Revisit: 30 minutes',
                        source: 'ISRO Space Applications Centre (SAC) MOSDAC',
                        status: 'DEMO / Synthesized for PoC Benchmark'
                      });
                    }
                  }}
                >
                  <LeafletTooltip>INSAT-3DR LST: 35.2°C (Mumbai UHI)</LeafletTooltip>
                </CircleMarker>

                <CircleMarker
                  center={[18.52, 73.85]}
                  radius={24}
                  pathOptions={{
                    color: '#c084fc',
                    weight: 1,
                    fillColor: '#8b5cf6',
                    fillOpacity: 0.20,
                    dashArray: '3, 3'
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedEntity({
                        type: 'INSAT MOSDAC 3RIMG_L2B_LST',
                        id: 'INSAT_LST_PUNE',
                        name: 'Pune Plateau Thermal Footprint',
                        lat: 18.52,
                        lon: 73.85,
                        resolution: '4 km at Nadir',
                        primaryVar: 'LST: 33.8 °C',
                        secondaryVar: 'Diurnal Range: 14.5 °C',
                        climatology: 'Revisit: 30 minutes',
                        source: 'ISRO SAC MOSDAC 3RIMG_L2B_LST',
                        status: 'DEMO / Synthesized for PoC Benchmark'
                      });
                    }
                  }}
                >
                  <LeafletTooltip>INSAT-3DR LST: 33.8°C (Pune)</LeafletTooltip>
                </CircleMarker>
              </>
            )}

            {/* INSAT-3DR MOSDAC SST Coastal Overlay */}
            {activeLayers.insatSst && (
              <CircleMarker
                center={[18.92, 72.60]}
                radius={34}
                pathOptions={{
                  color: '#3b82f6',
                  weight: 1,
                  fillColor: '#1d4ed8',
                  fillOpacity: 0.25
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedEntity({
                      type: 'INSAT MOSDAC 3RIMG_L2B_SST',
                      id: 'INSAT_SST_ARABIAN_SEA',
                      name: 'Eastern Arabian Sea Coastal Transect',
                      lat: 18.92,
                      lon: 72.60,
                      resolution: '4 km Split-Window Algorithm',
                      primaryVar: 'SST: 29.4 °C (302.55 K)',
                      secondaryVar: 'Monsoon Moist Advection: Moderate',
                      climatology: 'Marine Boundary Layer Inflow',
                      source: 'ISRO MOSDAC 3RIMG_L2B_SST',
                      status: 'DEMO / Synthesized for PoC Benchmark'
                    });
                  }
                }}
              >
                <LeafletTooltip>INSAT-3DR SST: 29.4°C (Arabian Sea Coastal)</LeafletTooltip>
              </CircleMarker>
            )}

            {/* Synoptic AWS Weather Stations */}
            {activeLayers.stations &&
              [...REGIONS_CONFIG.mumbai.stations, ...REGIONS_CONFIG.pune.stations].map((stn, idx) => (
                <CircleMarker
                  key={idx}
                  center={[stn.lat, stn.lon]}
                  radius={6}
                  pathOptions={{
                    color: '#10b981',
                    weight: 2,
                    fillColor: '#34d399',
                    fillOpacity: 0.9
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedEntity({
                        type: 'Automatic Weather Station (AWS)',
                        id: `STN_${stn.name.replace(/\s+/g, '_')}`,
                        name: stn.name,
                        lat: stn.lat,
                        lon: stn.lon,
                        resolution: 'Point Sensor Observational Ground-Truth',
                        primaryVar: `24h Rain: ${stn.rain24h} mm`,
                        secondaryVar: `Tmax: ${stn.tmax} °C | Tmin: ${stn.tmin} °C`,
                        climatology: `Station Classification: ${stn.type}`,
                        source: 'IMD Surface Observational Network',
                        status: 'Ground Validation Baseline'
                      });
                    }
                  }}
                >
                  <Popup>
                    <div className="text-xs p-1">
                      <div className="font-bold text-emerald-400">{stn.name}</div>
                      <div className="text-slate-300 text-[10px] mt-0.5">{stn.type}</div>
                      <div className="mt-1 font-mono text-[11px] text-white">
                        Rain: {stn.rain24h} mm | Tmax: {stn.tmax}°C
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
          </MapContainer>

          {/* Map Floating Scientific Legends */}
          <div className="absolute bottom-4 left-4 z-[400] bg-space-950/90 backdrop-blur-md p-3.5 rounded-xl border border-space-700/90 shadow-2xl text-[11px] font-mono space-y-2 pointer-events-auto">
            <div className="font-sans font-bold text-white text-xs flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
              Precipitation Intensity (mm/day)
            </div>
            <div className="flex items-center gap-1">
              <span className="w-5 h-3 rounded-sm bg-[#bae6fd]"></span>
              <span className="text-[10px] text-slate-400">&lt;3</span>
              <span className="w-5 h-3 rounded-sm bg-[#67e8f9]"></span>
              <span className="text-[10px] text-slate-400">8</span>
              <span className="w-5 h-3 rounded-sm bg-[#38bdf8]"></span>
              <span className="text-[10px] text-slate-400">15</span>
              <span className="w-5 h-3 rounded-sm bg-[#06b6d4]"></span>
              <span className="text-[10px] text-slate-400">25</span>
              <span className="w-5 h-3 rounded-sm bg-[#0284c7]"></span>
              <span className="text-[10px] text-slate-400">35+</span>
            </div>

            <div className="pt-2 border-t border-space-800">
              <div className="font-sans font-bold text-white text-xs flex items-center gap-1.5 mb-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                Temperature Range (°C)
              </div>
              <div className="flex items-center gap-1">
                <span className="w-5 h-3 rounded-sm bg-[#fbbf24]"></span>
                <span className="text-[10px] text-slate-400">30°</span>
                <span className="w-5 h-3 rounded-sm bg-[#f59e0b]"></span>
                <span className="text-[10px] text-slate-400">32°</span>
                <span className="w-5 h-3 rounded-sm bg-[#f97316]"></span>
                <span className="text-[10px] text-slate-400">34°</span>
                <span className="w-5 h-3 rounded-sm bg-[#ef4444]"></span>
                <span className="text-[10px] text-slate-400">&gt;35°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Entity Inspector Panel */}
        <div className="bg-space-900/90 rounded-2xl p-5 border border-space-700/80 shadow-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-space-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                Spatial Grid Inspector
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Click Map to Inspect
              </span>
            </div>

            {selectedEntity ? (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="p-3 rounded-xl bg-space-850 border border-space-750">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-0.5">
                    {selectedEntity.type}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {selectedEntity.name}
                  </h4>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    Lat: {selectedEntity.lat}°N | Lon: {selectedEntity.lon}°E
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-space-950/70 border border-space-800 flex justify-between items-center">
                    <span className="text-slate-400">Primary Observation:</span>
                    <span className="font-bold text-cyan-300">{selectedEntity.primaryVar}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-space-950/70 border border-space-800 flex justify-between items-center">
                    <span className="text-slate-400">Secondary Metric:</span>
                    <span className="text-amber-300">{selectedEntity.secondaryVar}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-space-950/70 border border-space-800 flex justify-between items-center">
                    <span className="text-slate-400">Spatial Resolution:</span>
                    <span className="text-white">{selectedEntity.resolution}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-space-950/70 border border-space-800">
                    <div className="text-slate-400 text-[10px] uppercase">Data Source:</div>
                    <div className="text-slate-200 mt-0.5">{selectedEntity.source}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-space-950/70 border border-space-800">
                    <div className="text-slate-400 text-[10px] uppercase">Telemetry State:</div>
                    <div className={`mt-0.5 font-bold ${
                      selectedEntity.status.includes('DEMO') ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {selectedEntity.status}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 flex flex-col items-center justify-center h-72 border border-dashed border-space-800 rounded-xl">
                <Crosshair className="w-8 h-8 text-cyan-400/50 mb-2 animate-spin-slow" />
                <p className="text-xs text-slate-300 font-medium">No grid or sensor selected</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                  Click on any IMD 0.25° grid box, 1.0° cell, INSAT thermal zone, or AWS marker to probe observational state.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-space-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
              <Info className="w-3.5 h-3.5" />
              Spatial Sampling Method
            </div>
            IMD 0.25° rainfall averages all active land grid cells inside bounding box. Temperature uses nearest-neighbor lookup to the 1.0° grid centroid.
          </div>
        </div>
      </div>
    </div>
  );
}

