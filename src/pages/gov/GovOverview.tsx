import { useEffect, useState } from 'react';
import { fetchDashboardStats, fetchReports, updateReportStatus } from '../../api/client';
import { Target, TrendingUp, Activity, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const GovOverview = () => {
  const [stats, setStats] = useState<any>(null);
  const [feed, setFeed] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<number>(0);
  const [newSignal, setNewSignal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [feedSort, setFeedSort] = useState<'recent' | 'priority'>('recent');

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
        console.error("Failed to load data", e);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000); // Poll every 5 seconds
    const timer = setInterval(() => setLastUpdated(prev => prev + 1), 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [feedSort]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateReportStatus(id, newStatus);
      // Optimistically update the feed locally
      setFeed(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  if (!stats) return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Live Intelligence Overview</h1>
          <p className="text-slate-400 mt-1">Palantir-style operational intelligence center.</p>
        </div>
        <div className="flex items-center gap-4">
          {newSignal && (
            <span className="flex items-center gap-2 text-rose-400 bg-rose-400/10 px-3 py-1 rounded-full text-xs font-bold animate-pulse border border-rose-400/20">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              NEW CITIZEN SIGNAL
            </span>
          )}
          <div className="text-xs font-mono text-slate-500 bg-slate-800 px-3 py-1.5 rounded border border-slate-700">
            Last updated: {lastUpdated}s ago
          </div>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
            <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">Total Reports</div>
            <div className="text-2xl font-bold text-white">{stats.total_reports.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800 border border-emerald-900/50 p-4 rounded-xl relative overflow-hidden">
            <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">Resolved Reports</div>
            <div className="text-2xl font-bold text-emerald-400">{stats.resolved_reports.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800 border border-amber-900/50 p-4 rounded-xl relative overflow-hidden">
            <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">Active Reports</div>
            <div className="text-2xl font-bold text-amber-400">{stats.active_reports.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800 border border-rose-900/50 p-4 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10"><Target className="w-12 h-12 text-rose-500" /></div>
            <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">Active Hotspots</div>
            <div className="text-2xl font-bold text-rose-400">{stats.active_hotspots}</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
            <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">High Priority</div>
            <div className="text-2xl font-bold text-orange-400">{stats.high_priority_issues}</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
            <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">Affected</div>
            <div className="text-2xl font-bold text-blue-400">{(stats.citizens_affected / 1000).toFixed(1)}k</div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live Feed */}
        <div className="lg:col-span-1 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col h-[500px]">
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center z-10">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-500" />
              Live Citizen Signals
            </h3>
            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
              <button 
                onClick={() => setFeedSort('recent')}
                className={`text-xs px-3 py-1 font-bold rounded-md transition-colors ${feedSort === 'recent' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Recent
              </button>
              <button 
                onClick={() => setFeedSort('priority')}
                className={`text-xs px-3 py-1 font-bold rounded-md transition-colors ${feedSort === 'priority' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Priority
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {feed.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-700 p-3 rounded-lg relative overflow-hidden group cursor-pointer hover:border-slate-500 transition-colors" onClick={() => setSelectedReport(item)}>
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.severity === 'CRITICAL' ? 'bg-rose-500' : item.severity === 'HIGH' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                <div className="flex justify-between items-start mb-1 pl-2">
                  <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded flex items-center gap-2">
                    {item.category} 
                    <span className="text-[10px] text-slate-500 font-normal">#{item.id}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <div className="pl-2">
                  <p className="text-sm text-slate-200 line-clamp-3 mt-1 italic">
                    "{item.translated_text || item.text}"
                  </p>
                  <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                    <span>📍 {item.location_name}</span>
                    <span className={item.severity === 'CRITICAL' ? 'text-rose-400 font-bold' : ''}>{item.severity}</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-xs text-slate-400">Action Status:</span>
                    <select 
                      value={item.status} 
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className={`text-xs font-bold px-2 py-1 rounded outline-none border cursor-pointer
                        ${item.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          item.status === 'Under Investigation' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                          'bg-slate-800 text-slate-300 border-slate-700'}
                      `}
                    >
                      <option value="Under Review">Under Review</option>
                      <option value="Under Investigation">Under Investigation</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Placeholder for Quick Actions/Charts */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 h-64 flex flex-col justify-center items-center text-slate-500">
             <TrendingUp className="w-12 h-12 mb-4 opacity-50" />
             <p>Select a Hotspot or Module to view deep analytics.</p>
             <Link to="/gov/map" className="mt-4 text-brand-400 hover:text-brand-300 text-sm font-semibold border border-brand-500/50 px-4 py-2 rounded-lg">
               Open Spatial Map &rarr;
             </Link>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h4 className="text-white font-bold mb-1">Budget Readiness</h4>
                <p className="text-slate-400 text-sm mb-4">Simulate allocations across districts.</p>
                <Link to="/gov/budget" className="text-sm text-blue-400 font-medium">Launch Simulator &rarr;</Link>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h4 className="text-white font-bold mb-1">Issue Clusters</h4>
                <p className="text-slate-400 text-sm mb-4">View AI-generated infrastructure groupings.</p>
                <Link to="/gov/priority" className="text-sm text-emerald-400 font-medium">View Priority Engine &rarr;</Link>
              </div>
           </div>
        </div>

      </div>

      {selectedReport && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative">
              <button onClick={() => setSelectedReport(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-xl">&times;</button>
              
              <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-bold text-white">REPORT #JD-{selectedReport.id}</h2>
              </div>
              
              <div className="mb-6">
                <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">English Summary</h3>
                <p className="text-white text-lg italic border-l-4 border-emerald-500 pl-4 py-2 bg-slate-800/30 rounded-r-lg">
                  "{selectedReport.translated_text || selectedReport.text}"
                </p>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6 border-b border-slate-800 pb-6">
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Category</span>
                  <span className="text-sm text-white font-semibold">{selectedReport.category}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Location</span>
                  <span className="text-sm text-white font-semibold">{selectedReport.location_name}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Severity</span>
                  <span className={`text-sm font-semibold ${selectedReport.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'}`}>{selectedReport.severity}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Urgency</span>
                  <span className={`text-sm font-semibold ${selectedReport.urgency === 'HIGH' ? 'text-rose-400' : 'text-amber-400'}`}>{selectedReport.urgency}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                 <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 relative">
                   <div className="absolute top-0 right-0 px-3 py-1 bg-slate-800 text-[10px] text-slate-300 font-bold uppercase rounded-bl-lg rounded-tr-xl">
                     Original Input
                   </div>
                   <div className="text-slate-500 text-xs font-bold uppercase mb-2">Language: {selectedReport.language || 'Unknown'}</div>
                   <p className="text-slate-300 text-sm font-mono mt-2">"{selectedReport.text}"</p>
                 </div>
                 
                 <div className="space-y-4">
                   <div className="flex justify-between items-center bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-xs text-slate-400 uppercase font-bold">Priority Score</span>
                     <span className="text-lg font-bold text-rose-400">{selectedReport.priority_score}/100</span>
                   </div>
                   <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                      <span className="text-xs text-slate-400 uppercase font-bold block mb-2">AI Analysis (Formula)</span>
                      <ul className="text-xs text-slate-300 space-y-1 font-mono">
                        <li className="flex justify-between"><span>Citizen Demand</span> <span>{Math.round(selectedReport.priority_score * 0.3)} pts</span></li>
                        <li className="flex justify-between"><span>Infrastructure Gap</span> <span>{Math.round(selectedReport.priority_score * 0.25)} pts</span></li>
                        <li className="flex justify-between"><span>Affected Population</span> <span>{Math.round(selectedReport.priority_score * 0.2)} pts</span></li>
                        <li className="flex justify-between"><span>Urgency</span> <span>{Math.round(selectedReport.priority_score * 0.15)} pts</span></li>
                        <li className="flex justify-between"><span>Location Risk</span> <span>{Math.round(selectedReport.priority_score * 0.1)} pts</span></li>
                      </ul>
                   </div>
                 </div>
              </div>

            <div className="flex items-center gap-4 border-t border-slate-800 pt-6">
              <span className="text-sm font-bold text-slate-400 uppercase">Change Status:</span>
              <select 
                value={selectedReport.status} 
                onChange={(e) => {
                  handleStatusChange(selectedReport.id, e.target.value);
                  setSelectedReport({...selectedReport, status: e.target.value});
                }}
                className="bg-slate-800 text-white font-bold p-2 rounded border border-slate-700 outline-none"
              >
                <option value="Under Review">Under Review</option>
                <option value="Under Investigation">Under Investigation</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovOverview;
