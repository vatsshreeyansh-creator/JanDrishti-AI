import { useState, useEffect } from 'react';
import { fetchReports } from '../../api/client';
import { 
  Search, 
  Clock, 
  Loader2, 
  RefreshCw, 
  MapPin, 
  AlertCircle,
  ThumbsUp,
  ShieldCheck
} from 'lucide-react';

const MyReports = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [endorsedIds, setEndorsedIds] = useState<number[]>([]);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchReports(1000, 'recent');
      setReports(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleEndorse = (id: number) => {
    setEndorsedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch = 
      (r.text && r.text.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.translated_text && r.translated_text.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.category && r.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.id && r.id.toString().includes(searchQuery));
    
    if (!matchesSearch) return false;
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'RESOLVED') return r.status === 'Resolved';
    if (filterStatus === 'INVESTIGATION') return r.status === 'Under Investigation';
    if (filterStatus === 'REVIEW') return r.status === 'Under Review';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 font-sans pb-12">
      
      {/* Top Docket Tracker Header */}
      <section className="bg-[#151d19] border border-[#27342c] p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#5da673]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#9ab0a2]">
              <span className="px-2.5 py-0.5 rounded-full bg-[#5da673]/15 border border-[#5da673]/30 text-[#8cd7a0] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5da673] animate-ping"></span>
                LIVE STATUTORY REDRESSAL
              </span>
              <span className="text-[#27342c]">|</span>
              <span>SLA TARGET: 48H</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#e8ede9] tracking-tight">
              Citizen Docket Tracker
            </h1>
            <p className="text-xs sm:text-sm text-[#9ab0a2] mt-1 max-w-xl">
              Track the full statutory lifecycle of grievances from spoken intake to engineer field investigation and satellite-verified redressal.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={loadData}
              className="px-3.5 py-2 rounded-xl bg-[#1a241f] hover:bg-[#242c27] text-xs font-mono text-[#8cd7a0] border border-[#27342c] transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Syncing...' : 'Live Synced'}
            </button>
          </div>
        </div>
      </section>

      {/* Search Bar & Filter Tabs */}
      <div className="bg-[#151d19] border border-[#27342c] p-4 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dockets by keyword, category, or #ID..." 
            className="w-full bg-[#1a241f] border border-[#27342c] text-xs rounded-xl py-2.5 pl-10 pr-4 text-[#e8ede9] placeholder-[#9ab0a2]/50 outline-none focus:border-[#5da673]"
          />
          <Search className="w-4 h-4 text-[#9ab0a2] absolute left-3.5 top-3" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Dockets' },
            { id: 'REVIEW', label: 'Under Review' },
            { id: 'INVESTIGATION', label: 'Investigation' },
            { id: 'RESOLVED', label: 'Resolved' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shrink-0 ${
                filterStatus === tab.id
                  ? 'bg-[#5da673] text-[#00381a] font-bold shadow-sm'
                  : 'text-[#9ab0a2] hover:text-[#e8ede9] bg-[#1a241f] border border-[#27342c]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dockets List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-[#151d19] border border-[#27342c] rounded-2xl p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#5da673] mx-auto mb-3" />
            <p className="font-mono text-xs text-[#9ab0a2]">Loading telemetry dockets...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-[#151d19] border border-[#27342c] rounded-2xl p-12 text-center text-[#9ab0a2]">
            <AlertCircle className="w-8 h-8 text-[#9ab0a2]/40 mx-auto mb-3" />
            <p className="font-mono text-sm">No grievances found matching criteria.</p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const isResolved = report.status === 'Resolved';
            const isInvestigating = report.status === 'Under Investigation';
            const isEndorsed = endorsedIds.includes(report.id);

            return (
              <div 
                key={report.id} 
                className="bg-[#151d19] border border-[#27342c] hover:border-[#3d594a] rounded-2xl p-5 sm:p-6 shadow-xl transition-all"
              >
                {/* Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#8cd7a0] bg-[#1a241f] border border-[#27342c] px-2.5 py-0.5 rounded">
                      #{report.id}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#ffb693] bg-[#773208]/20 border border-[#ffb693]/30 px-2 py-0.5 rounded">
                      {report.category}
                    </span>
                    <span className="text-[11px] font-mono text-[#9ab0a2] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#5da673]" /> {report.location_name || 'Gaya, Bihar'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#8cd7a0] bg-[#5da673]/10 border border-[#5da673]/30 px-2.5 py-0.5 rounded">
                      Priority Score: <strong className="text-[#e8ede9]">{report.priority_score || 75}/100</strong>
                    </span>
                    <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded ${
                      isResolved 
                        ? 'text-[#8cd7a0] bg-[#5da673]/20 border border-[#5da673]/40' 
                        : isInvestigating 
                        ? 'text-[#ffb693] bg-[#773208]/30 border border-[#ffb693]/30' 
                        : 'text-[#9ab0a2] bg-[#1a241f] border border-[#27342c]'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>

                {/* Complaint Body */}
                <div className="bg-[#1a241f] border border-[#27342c] p-4 rounded-xl my-3">
                  <p className="text-xs sm:text-sm text-[#e8ede9] leading-relaxed">
                    "{report.translated_text || report.text}"
                  </p>
                  {report.translated_text && report.translated_text !== report.text && (
                    <div className="mt-2 pt-2 border-t border-[#27342c] flex items-center gap-2 text-[11px] font-mono text-[#9ab0a2]">
                      <span className="text-[#ffb693]">Original ({report.language || 'Dialect'}):</span>
                      <span className="italic truncate">"{report.text}"</span>
                    </div>
                  )}
                </div>

                {/* 4-Stage Statutory Workflow Rail */}
                <div className="mt-5 pt-4 border-t border-[#27342c]">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#9ab0a2] mb-3">
                    Statutory Redressal Progression
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-center">
                    
                    {/* Stage 1: Submitted */}
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-[#5da673] text-[#00381a] flex items-center justify-center font-mono text-xs font-bold shadow-[0_0_10px_rgba(93,166,115,0.4)]">
                        ✓
                      </div>
                      <span className="font-mono text-[11px] font-bold text-[#e8ede9] mt-1.5">Submitted</span>
                      <span className="text-[9px] font-mono text-[#9ab0a2]">Acoustic ASR</span>
                    </div>

                    {/* Stage 2: Under Review */}
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-[#5da673] text-[#00381a] flex items-center justify-center font-mono text-xs font-bold shadow-[0_0_10px_rgba(93,166,115,0.4)]">
                        ✓
                      </div>
                      <span className="font-mono text-[11px] font-bold text-[#e8ede9] mt-1.5">Under Review</span>
                      <span className="text-[9px] font-mono text-[#9ab0a2]">AI Prioritized</span>
                    </div>

                    {/* Stage 3: Field Investigation */}
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                        isInvestigating || isResolved 
                          ? 'bg-[#5da673] text-[#00381a] shadow-[0_0_10px_rgba(93,166,115,0.4)]' 
                          : 'bg-[#1a241f] text-[#9ab0a2] border border-[#27342c]'
                      }`}>
                        {isInvestigating ? '●' : isResolved ? '✓' : '3'}
                      </div>
                      <span className={`font-mono text-[11px] font-bold mt-1.5 ${isInvestigating ? 'text-[#ffb693]' : isResolved ? 'text-[#e8ede9]' : 'text-[#9ab0a2]'}`}>
                        Investigation
                      </span>
                      <span className="text-[9px] font-mono text-[#9ab0a2]">RWD Eng Assigned</span>
                    </div>

                    {/* Stage 4: Redressal */}
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                        isResolved 
                          ? 'bg-[#5da673] text-[#00381a] shadow-[0_0_10px_rgba(93,166,115,0.4)]' 
                          : 'bg-[#1a241f] text-[#9ab0a2] border border-[#27342c]'
                      }`}>
                        {isResolved ? '✓' : '4'}
                      </div>
                      <span className={`font-mono text-[11px] font-bold mt-1.5 ${isResolved ? 'text-[#8cd7a0]' : 'text-[#9ab0a2]'}`}>
                        Redressal
                      </span>
                      <span className="text-[9px] font-mono text-[#9ab0a2]">Sat-Verified</span>
                    </div>

                  </div>
                </div>

                {/* Bottom Participatory Action Strip */}
                <div className="mt-4 pt-3 border-t border-[#27342c] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs font-mono text-[#9ab0a2]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#5da673]" /> Logged in IN-BH-GAYA-04
                    </span>
                    <span>•</span>
                    <span>Audit Trail Token: #SAT-2024-{report.id}</span>
                  </div>

                  <button
                    onClick={() => toggleEndorse(report.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 ${
                      isEndorsed 
                        ? 'bg-[#5da673] text-[#00381a]' 
                        : 'bg-[#1a241f] text-[#9ab0a2] hover:text-[#e8ede9] border border-[#27342c]'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {isEndorsed ? 'Endorsed by You (+1)' : 'Endorse Repair Priority'}
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Participatory Civic Fund Allocation Info Card */}
      <div className="bg-[#151d19] border border-[#27342c] p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#5da673]/20 border border-[#5da673]/40 text-[#8cd7a0] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-sm text-[#e8ede9] uppercase tracking-wider">
            How JanDrishti Participatory Telemetry Works
          </h3>
          <p className="text-xs text-[#9ab0a2] mt-1 leading-relaxed">
            Unlike legacy complaint boxes that bury grievances in bureaucratic queues, JanDrishti mathematically aggregates individual reports into GIS Hotspots. When multiple neighbors endorse or report a corridor, the algorithm elevates its Capex Priority Index, unlocking state infrastructure funds directly for Gaya Ward nodal engineers.
          </p>
        </div>
      </div>

    </div>
  );
};

export default MyReports;
