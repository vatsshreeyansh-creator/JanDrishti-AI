import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchHotspots } from '../../api/client';
import { Layers, Users, Activity, Loader2, Sparkles, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const GovMap = () => {
  const { theme } = useTheme();
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetchHotspots().then(data => {
      setHotspots(data);
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, []);

  const getMarkerColor = (score: number) => {
    if (score >= 80) return theme === 'dark' ? '#ffb693' : '#c85a32'; // Terracotta alert
    if (score >= 60) return '#d47a4c'; // Amber warning
    return theme === 'dark' ? '#5da673' : '#4a7c59'; // Emerald standard
  };

  const filteredHotspots = hotspots.filter(h => categoryFilter === 'All' || h.category === categoryFilter);

  const criticalCount = filteredHotspots.filter(h => h.priority_score >= 80).length;
  const warningCount = filteredHotspots.filter(h => h.priority_score >= 60 && h.priority_score < 80).length;

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col space-y-4 animate-in fade-in duration-500 font-sans">
      
      {/* Top Map Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d8e2dc] dark:border-[#27342c] pb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-[#eff1eb] dark:bg-[#5da673]/15 border border-[#d8e2dc] dark:border-[#5da673]/30 text-[#4a7c59] dark:text-[#8cd7a0] font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5da673] animate-pulse"></span>
              GIS DEMAND INTELLIGENCE
            </span>
            <span className="font-mono text-xs text-[#56685c] dark:text-[#9ab0a2]">Gaya District Grid</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1d2620] dark:text-[#e8ede9]">
            Geospatial Hotspots & Infrastructure Map
          </h1>
          <p className="text-xs text-[#56685c] dark:text-[#9ab0a2] mt-0.5">
            Spatial failure clusters synthesized from multi-citizen voice telemetry.
          </p>
        </div>

        {/* Filter and Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-[#151d19] border border-[#d8e2dc] dark:border-[#27342c] px-3 py-1.5 rounded-xl text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-[#4a7c59] dark:text-[#5da673]" />
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-[#1d2620] dark:text-[#e8ede9] outline-none font-mono text-xs cursor-pointer"
            >
              <option value="All" className="bg-white dark:bg-[#151d19]">All Sectors</option>
              <option value="Road Infrastructure" className="bg-white dark:bg-[#151d19]">Road Infrastructure</option>
              <option value="Water Supply" className="bg-white dark:bg-[#151d19]">Water Supply</option>
              <option value="Healthcare" className="bg-white dark:bg-[#151d19]">Healthcare</option>
              <option value="Education" className="bg-white dark:bg-[#151d19]">Education</option>
              <option value="Digital Connectivity" className="bg-white dark:bg-[#151d19]">Digital Connectivity</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-[#151d19] px-3 py-1.5 rounded-xl border border-[#d8e2dc] dark:border-[#27342c] font-mono text-xs">
            <span className="flex items-center gap-1.5 text-[#c85a32] dark:text-[#ffb693] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#c85a32] dark:bg-[#ffb693]"></span>
              Critical ({criticalCount})
            </span>
            <span className="text-[#d8e2dc] dark:text-[#27342c]">|</span>
            <span className="flex items-center gap-1.5 text-[#d47a4c]">
              <span className="w-2 h-2 rounded-full bg-[#d47a4c]"></span>
              Warning ({warningCount})
            </span>
          </div>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="flex-1 bg-[#f5f6f0] dark:bg-[#08100c] rounded-2xl overflow-hidden border border-[#d8e2dc] dark:border-[#27342c] relative shadow-xl dark:shadow-2xl min-h-[400px]">
        
        {/* Floating HUD Intelligence Dock */}
        <div className="absolute top-4 left-4 z-[1000] bg-white/95 dark:bg-[#151d19]/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-[#d8e2dc] dark:border-[#27342c] max-w-xs text-[#1d2620] dark:text-[#e8ede9]">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-[#4a7c59] dark:text-[#8cd7a0]" />
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#1d2620] dark:text-[#e8ede9]">
              Spatial Demand HUD
            </h3>
          </div>
          <p className="text-[11px] text-[#56685c] dark:text-[#9ab0a2] leading-relaxed mb-3">
            Marker radii scale with affected population size. Terracotta badges indicate P1 urgent clusters.
          </p>
          <div className="font-mono text-[10px] text-[#4a7c59] dark:text-[#8cd7a0] flex items-center justify-between border-t border-[#d8e2dc] dark:border-[#27342c] pt-2">
            <span>LAYERS: VECTOR GIS</span>
            <span>NODE: IN-BH-04</span>
          </div>
        </div>

        {loading ? (
          <div className="flex h-full items-center justify-center text-[#4a7c59] dark:text-[#8cd7a0] font-mono text-xs">
            <Loader2 className="w-8 h-8 animate-spin text-[#5da673] mr-2" />
            <span>Loading Geospatial Telemetry...</span>
          </div>
        ) : (
          <MapContainer 
            center={[24.7914, 85.0002]} 
            zoom={6} 
            scrollWheelZoom={true}
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">Carto</a>'
              url={theme === 'dark' ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
            />
            
            {filteredHotspots.map(hotspot => {
              const markerColor = getMarkerColor(hotspot.priority_score);
              return (
                <CircleMarker
                  key={hotspot.id}
                  center={[hotspot.lat, hotspot.lng]}
                  radius={Math.max(8, Math.min(24, hotspot.citizens_affected / 1200))}
                  pathOptions={{ 
                    fillColor: markerColor, 
                    color: markerColor,
                    weight: 2,
                    fillOpacity: 0.65
                  }}
                >
                  <Popup>
                    <div className="p-1 min-w-[220px] font-sans">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-[#ffb693] font-bold mb-1">
                        {hotspot.category}
                      </div>
                      <div className="font-display font-bold text-base text-[#e8ede9] mb-3">
                        {hotspot.name}
                      </div>
                      
                      <div className="space-y-1.5 mb-4 font-mono text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[#9ab0a2] flex items-center gap-1">
                            <Activity className="w-3 h-3 text-[#5da673]"/> Priority Score:
                          </span>
                          <span className="font-bold text-[#ffb693]">{hotspot.priority_score}/100</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#9ab0a2] flex items-center gap-1">
                            <Users className="w-3 h-3 text-[#5da673]"/> Affected Pop:
                          </span>
                          <span className="font-bold text-[#e8ede9]">{hotspot.citizens_affected.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#9ab0a2] flex items-center gap-1">
                            <Layers className="w-3 h-3 text-[#5da673]"/> Grievance Pings:
                          </span>
                          <span className="font-bold text-[#e8ede9]">{hotspot.report_count}</span>
                        </div>
                      </div>
                      
                      <Link 
                        to="/gov/recommendations"
                        className="block text-center w-full bg-[#5da673] hover:bg-[#4a7c59] text-[#00381a] py-2 rounded-lg text-xs font-mono font-bold transition-colors"
                      >
                        VIEW AI RECOMMENDATIONS →
                      </Link>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        )}
      </div>

    </div>
  );
};

export default GovMap;
