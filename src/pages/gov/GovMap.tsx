import { useEffect, useState } from 'react';
import { UnifiedMapView } from '../../components/map/UnifiedMapView';
import { fetchHotspots, fetchReports } from '../../api/client';
import { Loader2, Sparkles, Filter } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { JHARKHAND_CENTER, JHARKHAND_ZOOM } from '../../constants/jharkhandDistricts';

const GovMap = () => {
  const { theme } = useTheme();
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    Promise.all([
      fetchHotspots().catch(() => []),
      fetchReports(1000, 'recent').catch(() => [])
    ]).then(([hotspotsData, reportsData]) => {
      setHotspots(hotspotsData || []);
      setReports(reportsData || []);
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

  const hotspotMarkers = filteredHotspots.map(hotspot => ({
    id: `hotspot-${hotspot.id}`,
    lat: hotspot.lat,
    lng: hotspot.lng,
    category: hotspot.category,
    title: hotspot.name,
    priorityScore: hotspot.priority_score,
    citizensAffected: hotspot.citizens_affected,
    reportCount: hotspot.report_count,
    actionUrl: '/gov/recommendations',
    actionText: 'VIEW AI RECOMMENDATIONS →',
    markerColor: getMarkerColor(hotspot.priority_score),
    fillColor: getMarkerColor(hotspot.priority_score),
    radius: Math.max(8, Math.min(24, (hotspot.citizens_affected || 500) / 1200)),
  }));

  const reportMarkers = reports
    .filter(r => (categoryFilter === 'All' || r.category === categoryFilter) && typeof r.lat === 'number' && typeof r.lng === 'number')
    .map(r => {
      const priority = r.priority_score || 50;
      const radius = Math.max(7, Math.min(22, Math.round(priority * 0.22)));
      return {
        id: `report-${r.id}`,
        lat: r.lat,
        lng: r.lng,
        category: r.category,
        title: `#JD-${r.id}: ${r.category} (${r.location_name || 'Jharkhand'})`,
        description: r.translated_text || r.text,
        priorityScore: priority,
        status: r.status,
        markerColor: '#ef4444',
        fillColor: '#ef4444',
        radius: radius,
        actionUrl: '/gov',
        actionText: 'VIEW IN GOV OVERVIEW →'
      };
    });

  const combinedMarkers = [...hotspotMarkers, ...reportMarkers];

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
            <span className="font-mono text-xs text-[#56685c] dark:text-[#9ab0a2]">Jharkhand 24-District Grid</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1d2620] dark:text-[#e8ede9]">
            Geospatial Hotspots & Infrastructure Map
          </h1>
          <p className="text-xs text-[#56685c] dark:text-[#9ab0a2] mt-0.5">
            Spatial failure clusters and citizen grievance telemetry across Jharkhand.
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
            <span className="flex items-center gap-1.5 text-[#ef4444] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-ping"></span>
              Grievances ({reportMarkers.length})
            </span>
            <span className="text-[#d8e2dc] dark:text-[#27342c]">|</span>
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
            Red dots highlight registered citizen complaints scaled by intensity. Colored clusters represent multi-citizen hotspot zones.
          </p>
          <div className="font-mono text-[10px] text-[#4a7c59] dark:text-[#8cd7a0] flex items-center justify-between border-t border-[#d8e2dc] dark:border-[#27342c] pt-2">
            <span>REGION: JHARKHAND (24 D)</span>
            <span>DOTS: {reportMarkers.length} ACTIVE</span>
          </div>
        </div>

        {loading ? (
          <div className="flex h-full items-center justify-center text-[#4a7c59] dark:text-[#8cd7a0] font-mono text-xs">
            <Loader2 className="w-8 h-8 animate-spin text-[#5da673] mr-2" />
            <span>Loading Geospatial Telemetry...</span>
          </div>
        ) : (
          <UnifiedMapView
            center={JHARKHAND_CENTER} 
            zoom={JHARKHAND_ZOOM} 
            scrollWheelZoom={true}
            className="w-full h-full z-0"
            markers={combinedMarkers}
          />
        )}
      </div>

    </div>
  );
};

export default GovMap;
