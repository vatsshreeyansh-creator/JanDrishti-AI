import { useState, useEffect } from 'react';
import { fetchReports } from '../../api/client';
import { Search, Clock, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

const MyReports = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchReports(1000, 'recent');
      setReports(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8 border-b pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Reports</h1>
          <p className="text-slate-500 mt-1">Track the status and impact of issues you've reported.</p>
        </div>
        <div>
           {isRefreshing ? (
             <span className="text-xs text-slate-400 flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Syncing...</span>
           ) : (
             <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Live</span>
           )}
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search reports by ID or keyword..." 
              className="w-full bg-white border border-slate-300 text-sm rounded-lg p-2.5 pl-10 outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>
        <div className="divide-y divide-slate-100 min-h-[200px] relative">
          {loading ? (
             <div className="absolute inset-0 flex items-center justify-center">
               <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
             </div>
          ) : reports.length === 0 ? (
             <div className="p-8 text-center text-slate-500">No reports found.</div>
          ) : reports.map((report) => (
            <div key={report.id} className="p-5 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">#{report.id}</span>
                  <span className="text-xs font-bold text-brand-600 px-2 py-0.5 rounded border border-brand-200 bg-brand-50">
                    {report.category}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-800 line-clamp-1 mt-2">{report.text}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Priority Score: {report.priority_score}/100
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 bg-white p-3 rounded-lg border border-slate-100 shadow-sm w-full">
                <div className="flex items-center w-full max-w-sm mx-auto sm:mx-0">
                  <div className={`flex flex-col items-center flex-1`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${['Under Review', 'Under Investigation', 'Resolved'].includes(report.status) ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
                    <span className="text-[10px] font-bold mt-1 text-slate-600 text-center">Review</span>
                  </div>
                  <div className={`h-1 w-full flex-1 ${['Under Investigation', 'Resolved'].includes(report.status) ? 'bg-brand-600' : 'bg-slate-200'} -mt-4`}></div>
                  <div className={`flex flex-col items-center flex-1`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${['Under Investigation', 'Resolved'].includes(report.status) ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
                    <span className="text-[10px] font-bold mt-1 text-slate-600 text-center">Investigation</span>
                  </div>
                  <div className={`h-1 w-full flex-1 ${report.status === 'Resolved' ? 'bg-brand-600' : 'bg-slate-200'} -mt-4`}></div>
                  <div className={`flex flex-col items-center flex-1`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${report.status === 'Resolved' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                       {report.status === 'Resolved' ? <CheckCircle2 className="w-4 h-4"/> : '3'}
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-slate-600 text-center">Resolved</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
        <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 text-sm">How JanDrishti Works</h4>
          <p className="text-blue-800 text-xs mt-1 leading-relaxed">
            Unlike traditional portals that just queue your request, our AI clusters your report with neighbors to identify systemic failures and assigns it a <strong>Priority Impact Score</strong>. This ensures funds are directed where they matter most, faster.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyReports;
