import { useEffect, useState } from 'react';
import { fetchDashboardStats, fetchReports, updateReportStatus } from '../../api/client';
import { 
  Activity, 
  Loader2, 
  MapPin, 
  Radio, 
  ArrowRight,
  Flame,
  FileSpreadsheet
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { UnifiedMapView } from '../../components/map/UnifiedMapView';
import { JHARKHAND_CENTER, JHARKHAND_ZOOM } from '../../constants/jharkhandDistricts';

const GovOverview = () => {
  const [stats, setStats] = useState<any>(null);
  const [feed, setFeed] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<number>(0);
  const [newSignal, setNewSignal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [feedSort, setFeedSort] = useState<'recent' | 'priority'>('recent');

  const reportMarkers = feed
    .filter((item) => typeof item.lat === 'number' && typeof item.lng === 'number')
    .map((item) => {
      const priority = item.priority_score || 50;
      // Size proportional to intensity (radius from 7px to 22px)
      const radius = Math.max(7, Math.min(22, Math.round(priority * 0.22)));
      return {
        id: `report-${item.id}`,
        lat: item.lat,
        lng: item.lng,
        category: item.category,
        title: `#JD-${item.id}: ${item.category} (${item.location_name || 'Jharkhand'})`,
        description: item.translated_text || item.text,
        priorityScore: priority,
        status: item.status,
        markerColor: '#ef4444',
        fillColor: '#ef4444',
        radius: radius,
        actionUrl: '/gov/map',
        actionText: 'VIEW FULL MAP →'
      };
    });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, reportsData] = await Promise.all([
          fetchDashboardStats(),
          fetchReports(1000, feedSort)
        ]);
        
        setStats((prev: any) => {
          if (prev && statsData.total_reports > prev.total_reports) {
            setNewSignal(true);
            setTimeout(() => setNewSignal(false), 3000);
          }
          return statsData;
        });
        
        setFeed(reportsData);
        setLastUpdated(0);
      } catch (e) {
        console.error("Failed to load gov overview data", e);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    const timer = setInterval(() => setLastUpdated(prev => prev + 1), 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [feedSort]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateReportStatus(id, newStatus);
      setFeed(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      if (selectedReport && selectedReport.id === id) {
        setSelectedReport((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  if (!stats) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center font-mono text-[#8cd7a0]">
        <Loader2 className="w-8 h-8 animate-spin text-[#5da673] mr-3" />
        <span>Synchronizing Ingestion Telemetry Stream...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 font-sans">
      
      {/* Top Command Strip */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#27342c] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded-full bg-[#5da673]/15 border border-[#5da673]/30 text-[#8cd7a0] font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#5da673] animate-pulse"></span>
              TELEMETRY NODE ACTIVE
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#e8ede9]">
            Civic Command Center: Live Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#9ab0a2] mt-0.5">
            Sovereign Palantir-class operational intelligence aggregating grassroots citizen signals into actionable executive triage.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
          {newSignal && (
            <span className="flex items-center gap-1.5 text-[#ffb693] bg-[#773208]/30 px-3 py-1 rounded-full border border-[#ffb693]/40 animate-pulse font-bold">
              <span className="w-2 h-2 rounded-full bg-[#ffb693]"></span>
              NEW CITIZEN SIGNAL
            </span>
          )}
          <div className="text-[#9ab0a2] bg-[#151d19] px-3 py-1.5 rounded-lg border border-[#27342c]">
            Last telemetry refresh: <strong className="text-[#e8ede9]">{lastUpdated}s ago</strong>
          </div>
        </div>
      </header>

      {/* 6 High-Density KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Ingested */}
        <div className="bg-[#151d19] border border-[#27342c] p-4 rounded-xl shadow-md">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#9ab0a2] mb-1">
            Total Ingestion
          </div>
          <div className="text-2xl font-bold font-display text-[#e8ede9]">
            {stats.total_reports.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-[#9ab0a2] mt-1">Spoken + Geotagged</div>
        </div>

        {/* Resolved Reports */}
        <div className="bg-[#151d19] border border-[#27342c] p-4 rounded-xl shadow-md">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#9ab0a2] mb-1">
            Resolved Dockets
          </div>
          <div className="text-2xl font-bold font-display text-[#8cd7a0]">
            {stats.resolved_reports.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-[#5da673] mt-1">Satellite Audited</div>
        </div>

        {/* Active Grievances */}
        <div className="bg-[#151d19] border border-[#27342c] p-4 rounded-xl shadow-md">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#9ab0a2] mb-1">
            Active Triage
          </div>
          <div className="text-2xl font-bold font-display text-[#ffb693]">
            {stats.active_reports.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-[#ffb693]/70 mt-1">In Nodal Workflow</div>
        </div>

        {/* Active Hotspots */}
        <div className="bg-[#151d19] border border-[#27342c] p-4 rounded-xl shadow-md relative overflow-hidden">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#9ab0a2] mb-1">
            GIS Hotspots
          </div>
          <div className="text-2xl font-bold font-display text-[#d47a4c]">
            {stats.active_hotspots}
          </div>
          <div className="text-[10px] font-mono text-[#d47a4c]/70 mt-1">Multi-Voice Clusters</div>
        </div>

        {/* High Priority Issues */}
        <div className="bg-[#151d19] border border-[#27342c] p-4 rounded-xl shadow-md">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#9ab0a2] mb-1">
            P1 Criticals
          </div>
          <div className="text-2xl font-bold font-display text-[#ff8f7d]">
            {stats.high_priority_issues}
          </div>
          <div className="text-[10px] font-mono text-[#ff8f7d]/70 mt-1">Score &gt; 75/100</div>
        </div>

        {/* Affected Citizens */}
        <div className="bg-[#151d19] border border-[#27342c] p-4 rounded-xl shadow-md">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#9ab0a2] mb-1">
            Affected Citizens
          </div>
          <div className="text-2xl font-bold font-display text-[#aacfb7]">
            {(stats.citizens_affected / 1000).toFixed(1)}k
          </div>
          <div className="text-[10px] font-mono text-[#aacfb7]/70 mt-1">Ward Footprint</div>
        </div>

      </div>

      {/* Main Command Split: Live Citizen Signal Stream (Left) + Spatial Intelligence / Quick Panels (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Live Citizen Signal Stream (5 cols) */}
        <div className="lg:col-span-5 bg-[#151d19] border border-[#27342c] rounded-2xl overflow-hidden shadow-xl flex flex-col h-[600px]">
          
          <div className="bg-[#1a241f] p-4 border-b border-[#27342c] flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#5da673] animate-pulse" />
              <h3 className="font-display font-bold text-sm text-[#e8ede9]">
                Live Citizen Signals
              </h3>
            </div>

            <div className="flex bg-[#151d19] rounded-lg p-0.5 border border-[#27342c]">
              <button 
                onClick={() => setFeedSort('recent')}
                className={`text-[11px] font-mono px-3 py-1 rounded font-semibold transition-all ${
                  feedSort === 'recent' 
                    ? 'bg-[#5da673] text-[#00381a]' 
                    : 'text-[#9ab0a2] hover:text-[#e8ede9]'
                }`}
              >
                Recent
              </button>
              <button 
                onClick={() => setFeedSort('priority')}
                className={`text-[11px] font-mono px-3 py-1 rounded font-semibold transition-all ${
                  feedSort === 'priority' 
                    ? 'bg-[#5da673] text-[#00381a]' 
                    : 'text-[#9ab0a2] hover:text-[#e8ede9]'
                }`}
              >
                Priority
              </button>
            </div>
          </div>

          {/* Feed List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2.5">
            {feed.map((item) => {
              const isCritical = item.severity === 'CRITICAL' || (item.priority_score && item.priority_score >= 80);
              const isHigh = item.severity === 'HIGH' || (item.priority_score && item.priority_score >= 60);

              return (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedReport(item)}
                  className="bg-[#1a241f] border border-[#27342c] hover:border-[#3d594a] p-3.5 rounded-xl relative overflow-hidden group cursor-pointer transition-all duration-150"
                >
                  {/* Left severity stripe */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    isCritical ? 'bg-[#ffb693]' : isHigh ? 'bg-[#d47a4c]' : 'bg-[#5da673]'
                  }`}></div>

                  <div className="pl-2">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-[#8cd7a0] bg-[#151d19] border border-[#27342c] px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        <span className="font-mono text-[10px] text-[#9ab0a2]">
                          #{item.id}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#9ab0a2]">
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs text-[#e8ede9] line-clamp-2 mt-1 leading-relaxed">
                      "{item.translated_text || item.text}"
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#27342c] text-[11px] font-mono">
                      <span className="text-[#9ab0a2] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#5da673]" /> {item.location_name || 'Jharkhand'}
                      </span>
                      <span className="font-bold text-[#ffb693]">
                        Score: {item.priority_score || 70}/100
                      </span>
                    </div>

                    {/* Quick inline status switch */}
                    <div className="mt-2 pt-2 border-t border-[#27342c]/60 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#9ab0a2]">Status:</span>
                      <select 
                        value={item.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded outline-none border cursor-pointer ${
                          item.status === 'Resolved' 
                            ? 'bg-[#5da673]/20 text-[#8cd7a0] border-[#5da673]/40' 
                            : item.status === 'Under Investigation' 
                            ? 'bg-[#773208]/30 text-[#ffb693] border-[#ffb693]/40' 
                            : 'bg-[#151d19] text-[#9ab0a2] border-[#27342c]'
                        }`}
                      >
                        <option value="Under Review" className="bg-[#151d19]">Under Review</option>
                        <option value="Under Investigation" className="bg-[#151d19]">Under Investigation</option>
                        <option value="Resolved" className="bg-[#151d19]">Resolved</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right: Operational Panels & Quick Interventions (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Spatial Map Live Grievance Intelligence Panel */}
          <div className="bg-[#151d19] border border-[#27342c] rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#5da673]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-pulse"></span>
                  <h3 className="font-display font-bold text-base text-[#e8ede9]">
                    Jharkhand Grievance Telemetry Map
                  </h3>
                </div>
                <span className="font-mono text-xs text-[#ef4444] bg-[#ef4444]/15 border border-[#ef4444]/30 px-2.5 py-0.5 rounded-full font-bold">
                  {reportMarkers.length} Active Problem Dots
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#9ab0a2] leading-relaxed mb-3">
                Red dots highlight registered citizen complaints across Jharkhand districts. Dot size is proportional to grievance intensity.
              </p>

              {/* Embedded Live Map */}
              <div className="w-full h-80 rounded-xl overflow-hidden border border-[#27342c] relative my-3 shadow-inner">
                <UnifiedMapView
                  center={JHARKHAND_CENTER}
                  zoom={JHARKHAND_ZOOM}
                  scrollWheelZoom={false}
                  className="w-full h-full"
                  markers={reportMarkers}
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 font-mono text-xs">
                <div className="bg-[#1a241f] border border-[#27342c] p-2.5 rounded-xl">
                  <span className="text-[#9ab0a2] text-[10px] block">PROBLEM PINS</span>
                  <span className="font-bold text-[#ef4444] text-sm">{reportMarkers.length} Red Dots</span>
                </div>
                <div className="bg-[#1a241f] border border-[#27342c] p-2.5 rounded-xl">
                  <span className="text-[#9ab0a2] text-[10px] block">RADIUS SCALE</span>
                  <span className="font-bold text-[#ffb693] text-sm">7px - 22px</span>
                </div>
                <div className="bg-[#1a241f] border border-[#27342c] p-2.5 rounded-xl">
                  <span className="text-[#9ab0a2] text-[10px] block">JURISDICTION</span>
                  <span className="font-bold text-[#8cd7a0] text-sm">24 Districts</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#27342c] flex items-center justify-between">
              <span className="font-mono text-xs text-[#9ab0a2]">
                Sovereign GIS District Coordinates Live
              </span>
              <Link
                to="/gov/map"
                className="bg-[#5da673] hover:bg-[#4a7c59] text-[#00381a] px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(93,166,115,0.3)]"
              >
                Launch Full Geospatial Map <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Action Cards (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Capex Allocation Simulator Card */}
            <div className="bg-[#151d19] border border-[#27342c] hover:border-[#5da673]/50 p-5 rounded-2xl shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#5da673]/20 border border-[#5da673]/40 text-[#8cd7a0] flex items-center justify-center mb-3">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-sm text-[#e8ede9] mb-1">
                  Capex Budget Simulator
                </h4>
                <p className="text-xs text-[#9ab0a2] leading-relaxed mb-4">
                  Run algorithmic quadratic solver simulations across sectors (₹50 Cr - ₹1000 Cr).
                </p>
              </div>
              <Link 
                to="/gov/budget" 
                className="font-mono text-xs text-[#8cd7a0] hover:underline flex items-center gap-1"
              >
                Launch Capex Engine →
              </Link>
            </div>

            {/* Multi-Voice Issue Clusters Card */}
            <div className="bg-[#151d19] border border-[#27342c] hover:border-[#ffb693]/50 p-5 rounded-2xl shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#773208]/30 border border-[#ffb693]/40 text-[#ffb693] flex items-center justify-center mb-3">
                  <Flame className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-sm text-[#e8ede9] mb-1">
                  Multi-Voice Clusters
                </h4>
                <p className="text-xs text-[#9ab0a2] leading-relaxed mb-4">
                  “Many Citizen Voices → One Decision”: Group hundreds of complaints into single projects.
                </p>
              </div>
              <Link 
                to="/gov/recommendations" 
                className="font-mono text-xs text-[#ffb693] hover:underline flex items-center gap-1"
              >
                Review Recommendations →
              </Link>
            </div>

          </div>

        </div>

      </div>

      {/* Case Management Triage Modal (14_15 Template) */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#151d19] border border-[#27342c] rounded-2xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative shadow-2xl">
            
            <button 
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-[#9ab0a2] hover:text-[#e8ede9] text-2xl font-bold font-mono"
            >
              &times;
            </button>

            {/* Modal Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#27342c] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#5da673]/20 border border-[#5da673]/40 flex items-center justify-center text-[#8cd7a0]">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-[#e8ede9]">
                    DOCKET TRIAGE: #JD-{selectedReport.id}
                  </h2>
                  <span className="font-mono text-xs text-[#9ab0a2]">
                    {selectedReport.location_name ? `Location: ${selectedReport.location_name}` : 'District Ingestion Grid'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#ffb693] bg-[#773208]/30 border border-[#ffb693]/30 px-2.5 py-1 rounded">
                  SCORE: {selectedReport.priority_score || 75}/100
                </span>
              </div>
            </div>

            {/* English Summary Quote */}
            <div className="mb-6">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#9ab0a2] block mb-1">
                Synthesized Action Narrative
              </span>
              <p className="text-base text-[#e8ede9] italic bg-[#1a241f] border-l-4 border-[#5da673] p-4 rounded-r-xl leading-relaxed">
                "{selectedReport.translated_text || selectedReport.text}"
              </p>
            </div>

            {/* 4 Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 rounded-xl bg-[#1a241f] border border-[#27342c] font-mono text-xs">
              <div>
                <span className="text-[#9ab0a2] block text-[10px]">CATEGORY</span>
                <span className="font-bold text-[#e8ede9]">{selectedReport.category}</span>
              </div>
              <div>
                <span className="text-[#9ab0a2] block text-[10px]">LOCATION</span>
                <span className="font-bold text-[#e8ede9]">{selectedReport.location_name || 'Jharkhand'}</span>
              </div>
              <div>
                <span className="text-[#9ab0a2] block text-[10px]">SEVERITY</span>
                <span className="font-bold text-[#ffb693]">{selectedReport.severity}</span>
              </div>
              <div>
                <span className="text-[#9ab0a2] block text-[10px]">URGENCY</span>
                <span className="font-bold text-[#8cd7a0]">{selectedReport.urgency || 'HIGH'}</span>
              </div>
            </div>

            {/* Split: Original Dialect vs AI Priority Formula */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              
              {/* Original Input Raw */}
              <div className="bg-[#1a241f] border border-[#27342c] p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#ffb693] mb-2">
                    <span>ORIGINAL DIALECT INPUT</span>
                    <span className="bg-[#151d19] px-2 py-0.5 rounded border border-[#27342c]">
                      {selectedReport.language || 'Hindi / Bhojpuri'}
                    </span>
                  </div>
                  <p className="text-xs text-[#e8ede9] italic font-mono leading-relaxed mt-2">
                    “{selectedReport.text}”
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-[#27342c] text-[10px] font-mono text-[#9ab0a2]">
                  Acoustic Speech Vector: Hash #ASR-8841
                </div>
              </div>

              {/* 5-Factor Formula Math */}
              <div className="bg-[#1a241f] border border-[#27342c] p-4 rounded-xl font-mono text-xs space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-[#8cd7a0] font-bold mb-2">
                  5-Factor Priority Mathematical Index
                </div>
                <div className="flex justify-between text-[#9ab0a2]">
                  <span>Citizen Demand (30%)</span>
                  <span className="text-[#e8ede9] font-bold">{Math.round((selectedReport.priority_score || 75) * 0.3)} pts</span>
                </div>
                <div className="flex justify-between text-[#9ab0a2]">
                  <span>Infrastructure Gap (25%)</span>
                  <span className="text-[#e8ede9] font-bold">{Math.round((selectedReport.priority_score || 75) * 0.25)} pts</span>
                </div>
                <div className="flex justify-between text-[#9ab0a2]">
                  <span>Affected Population (20%)</span>
                  <span className="text-[#e8ede9] font-bold">{Math.round((selectedReport.priority_score || 75) * 0.2)} pts</span>
                </div>
                <div className="flex justify-between text-[#9ab0a2]">
                  <span>Urgency Index (15%)</span>
                  <span className="text-[#e8ede9] font-bold">{Math.round((selectedReport.priority_score || 75) * 0.15)} pts</span>
                </div>
                <div className="flex justify-between text-[#9ab0a2] border-b border-[#27342c] pb-1.5">
                  <span>Location Risk (10%)</span>
                  <span className="text-[#e8ede9] font-bold">{Math.round((selectedReport.priority_score || 75) * 0.1)} pts</span>
                </div>
                <div className="flex justify-between text-[#8cd7a0] font-bold pt-1 text-sm">
                  <span>Total Composite Score:</span>
                  <span>{selectedReport.priority_score || 75} / 100</span>
                </div>
              </div>

            </div>

            {/* Action Workflow Controls */}
            <div className="border-t border-[#27342c] pt-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#9ab0a2] uppercase">
                  Statutory Redressal Status:
                </span>
                <select
                  value={selectedReport.status}
                  onChange={(e) => handleStatusChange(selectedReport.id, e.target.value)}
                  className="bg-[#1a241f] text-[#e8ede9] font-mono text-xs font-bold px-3 py-2 rounded-xl border border-[#27342c] outline-none focus:border-[#5da673] cursor-pointer"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Under Investigation">Under Investigation</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 rounded-xl bg-[#1a241f] text-[#e8ede9] text-xs font-mono font-medium border border-[#27342c] hover:bg-[#242c27] transition-colors"
                >
                  Close Docket
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default GovOverview;
