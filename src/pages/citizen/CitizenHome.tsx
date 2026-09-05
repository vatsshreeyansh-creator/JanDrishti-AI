import { useEffect, useState } from 'react';
import { MapContainer, CircleMarker, Popup } from 'react-leaflet';
import { AppMapTileLayer } from '../../components/map/AppMapTileLayer';
import 'leaflet/dist/leaflet.css';
import { 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  PlusCircle, 
  Layers, 
  Radio, 
  List,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchReports } from '../../api/client';
const CitizenHome = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchReports(1000, 'recent');
        setReports(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const localLocation = reports.length > 0 ? reports[0].location_name : 'Gaya, Bihar';
  const localIssues = reports.filter(r => !localLocation || r.location_name === localLocation || reports.length < 5);
  
  const displayList = localIssues.length > 0 ? localIssues : reports;
  const resolvedCount = displayList.filter(r => r.status === 'Resolved').length;
  const unresolved = displayList.length - resolvedCount;

  // Center coordinate (Gaya default)
  const centerLat = displayList.length > 0 && displayList[0].lat ? displayList[0].lat : 24.7914;
  const centerLng = displayList.length > 0 && displayList[0].lng ? displayList[0].lng : 85.0002;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      
      {/* Hero Intake Header */}
      <section className="bg-white dark:bg-[#151d19] border border-[#d8e2dc] dark:border-[#27342c] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm dark:shadow-xl transition-colors">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5da673]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f6f0] dark:bg-[#1a241f] border border-[#d8e2dc] dark:border-[#27342c] text-[#c85a32] dark:text-[#ffb693] font-mono text-xs uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Sovereign Civic Multi-Modal Intake Engine
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1d2620] dark:text-[#e8ede9] mb-2">
            Good morning, Citizen.
            <span className="block text-[#4a7c59] dark:text-[#8cd7a0] text-xl sm:text-2xl font-medium mt-1">
              What does your community need today?
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#56685c] dark:text-[#9ab0a2] max-w-2xl mt-2 leading-relaxed">
            <span className="text-[#1d2620] dark:text-[#e8ede9] font-medium">“रउआ का चाहीं, हमनी के बताईं”</span> — Report infrastructure grievances in Bhojpuri, Hindi, Magahi, or English. Visual photos and voice audio are vectorized in sub-second latency directly to executive nodal engineers.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-6">
            <Link 
              to="/citizen/report" 
              className="bg-[#4a7c59] dark:bg-[#5da673] hover:bg-[#365c42] dark:hover:bg-[#4a7c59] text-white dark:text-[#00381a] px-6 py-3 rounded-xl font-bold text-sm shadow-md dark:shadow-[0_0_20px_rgba(93,166,115,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Report an Infrastructure Issue
            </Link>

            <Link 
              to="/citizen/my-reports" 
              className="bg-[#f5f6f0] dark:bg-[#1a241f] hover:bg-[#e6e9e1] dark:hover:bg-[#242c27] text-[#1d2620] dark:text-[#e8ede9] border border-[#d8e2dc] dark:border-[#27342c] px-5 py-3 rounded-xl font-medium text-sm transition-all inline-flex items-center gap-2"
            >
              <List className="w-4 h-4 text-[#4a7c59] dark:text-[#8cd7a0]" />
              Track Citizen Docket
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Telemetry KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Active Grievances */}
        <div className="bg-white dark:bg-[#151d19] border border-[#d8e2dc] dark:border-[#27342c] p-5 rounded-2xl shadow-sm dark:shadow-md flex items-center gap-4 relative overflow-hidden transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#fbeae2] dark:bg-[#773208]/30 border border-[#d8e2dc] dark:border-[#ffb693]/30 text-[#c85a32] dark:text-[#ffb693] flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#56685c] dark:text-[#9ab0a2]">Active Area Issues</div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-[#c85a32] dark:text-[#ffb693] mt-0.5">
              {loading ? '...' : unresolved}
            </div>
            <div className="text-[11px] font-mono text-[#56685c] dark:text-[#9ab0a2] mt-0.5">Awaiting / Under Triage</div>
          </div>
        </div>

        {/* Resolved in Area */}
        <div className="bg-white dark:bg-[#151d19] border border-[#d8e2dc] dark:border-[#27342c] p-5 rounded-2xl shadow-sm dark:shadow-md flex items-center gap-4 relative overflow-hidden transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#eff1eb] dark:bg-[#5da673]/20 border border-[#d8e2dc] dark:border-[#5da673]/40 text-[#4a7c59] dark:text-[#8cd7a0] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#56685c] dark:text-[#9ab0a2]">Resolved in Area</div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-[#4a7c59] dark:text-[#8cd7a0] mt-0.5">
              {loading ? '...' : resolvedCount}
            </div>
            <div className="text-[11px] font-mono text-[#4a7c59] dark:text-[#5da673] mt-0.5">Audited via Satellite & Field</div>
          </div>
        </div>

        {/* Total Area Telemetry Reports */}
        <div className="bg-white dark:bg-[#151d19] border border-[#d8e2dc] dark:border-[#27342c] p-5 rounded-2xl shadow-sm dark:shadow-md flex items-center gap-4 relative overflow-hidden transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#f5f6f0] dark:bg-[#1a241f] border border-[#d8e2dc] dark:border-[#27342c] text-[#1d2620] dark:text-[#e8ede9] flex items-center justify-center shrink-0">
            <Radio className="w-6 h-6 text-[#4a7c59] dark:text-[#5da673]" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#56685c] dark:text-[#9ab0a2]">Total Area Ingestion</div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-[#1d2620] dark:text-[#e8ede9] mt-0.5">
              {loading ? '...' : displayList.length}
            </div>
            <div className="text-[11px] font-mono text-[#56685c] dark:text-[#9ab0a2] mt-0.5">Constituency: Gaya Node</div>
          </div>
        </div>

      </div>

      {/* Main Grid: Geospatial Map + Recent Reports Docket */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Neighborhood GIS Map (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#151d19] border border-[#d8e2dc] dark:border-[#27342c] rounded-2xl p-5 shadow-sm dark:shadow-xl flex flex-col gap-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#4a7c59] dark:text-[#5da673]" />
              <h2 className="font-display font-bold text-base text-[#1d2620] dark:text-[#e8ede9]">
                Neighborhood Telemetry Map
              </h2>
            </div>
            <span className="font-mono text-[10px] text-[#4a7c59] dark:text-[#8cd7a0] bg-[#eff1eb] dark:bg-[#5da673]/10 border border-[#d8e2dc] dark:border-[#5da673]/30 px-2 py-0.5 rounded">
              Gaya Sub-Ward Grid
            </span>
          </div>

          <div className="rounded-xl overflow-hidden border border-[#d8e2dc] dark:border-[#27342c] h-[380px] relative bg-[#f5f6f0] dark:bg-[#08100c]">
            <MapContainer 
              center={[centerLat, centerLng]} 
              zoom={12} 
              scrollWheelZoom={false}
              className="w-full h-full z-0"
            >
              <AppMapTileLayer />
              {displayList.map(complaint => (
                <CircleMarker
                  key={complaint.id}
                  center={[complaint.lat || 24.7914, complaint.lng || 85.0002]}
                  radius={8}
                  pathOptions={{ 
                    fillColor: complaint.status === 'Resolved' ? '#4a7c59' : '#c85a32', 
                    color: complaint.status === 'Resolved' ? '#8cd7a0' : '#ffb693',
                    weight: 2,
                    fillOpacity: 0.7
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-1">
                      <div className="font-mono text-[10px] uppercase text-[#c85a32] dark:text-[#ffb693] font-bold">
                        {complaint.category} • #{complaint.id}
                      </div>
                      <div className="text-xs text-[#1d2620] dark:text-[#e8ede9] italic line-clamp-2">
                        "{complaint.translated_text || complaint.text}"
                      </div>
                      <div className="text-[11px] font-mono font-bold text-[#4a7c59] dark:text-[#8cd7a0] pt-1">
                        Status: {complaint.status}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Recent Area Reports (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#151d19] border border-[#d8e2dc] dark:border-[#27342c] rounded-2xl p-5 shadow-sm dark:shadow-xl flex flex-col gap-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#c85a32] dark:text-[#ffb693]" />
              <h2 className="font-display font-bold text-base text-[#1d2620] dark:text-[#e8ede9]">
                Recent Community Docket
              </h2>
            </div>
            <Link 
              to="/citizen/my-reports" 
              className="text-xs font-mono text-[#4a7c59] dark:text-[#5da673] hover:text-[#365c42] dark:hover:text-[#8cd7a0] flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-[#d8e2dc] dark:divide-[#27342c] max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
            {displayList.slice(0, 5).map((issue) => (
              <div key={issue.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[10px] font-bold text-[#4a7c59] dark:text-[#8cd7a0] bg-[#f5f6f0] dark:bg-[#1a241f] border border-[#d8e2dc] dark:border-[#27342c] px-2 py-0.5 rounded">
                    {issue.category}
                  </span>
                  <span className="font-mono text-[10px] text-[#56685c] dark:text-[#9ab0a2]">
                    #{issue.id}
                  </span>
                </div>
                
                <p className="text-xs text-[#1d2620] dark:text-[#e8ede9] line-clamp-2 mt-1.5 leading-relaxed">
                  "{issue.translated_text || issue.text}"
                </p>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] font-mono text-[#56685c] dark:text-[#9ab0a2] flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-[#4a7c59] dark:text-[#5da673]" /> {issue.location_name || 'Gaya'}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    issue.status === 'Resolved' 
                      ? 'text-[#4a7c59] dark:text-[#8cd7a0] bg-[#eff1eb] dark:bg-[#5da673]/15 border border-[#d8e2dc] dark:border-[#5da673]/30' 
                      : issue.status === 'Under Investigation' 
                      ? 'text-[#c85a32] dark:text-[#ffb693] bg-[#fbeae2] dark:bg-[#773208]/30 border border-[#d8e2dc] dark:border-[#ffb693]/30' 
                      : 'text-[#56685c] dark:text-[#9ab0a2] bg-[#f5f6f0] dark:bg-[#1a241f] border border-[#d8e2dc] dark:border-[#27342c]'
                  }`}>
                    {issue.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default CitizenHome;
