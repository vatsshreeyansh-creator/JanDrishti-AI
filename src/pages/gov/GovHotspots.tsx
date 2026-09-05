import { useEffect, useState } from 'react';
import { fetchHotspots } from '../../api/client';
import { Flame, Loader2 } from 'lucide-react';

const GovHotspots = () => {
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      fetchHotspots().then(data => {
        setHotspots(data.sort((a: any, b: any) => b.priority_score - a.priority_score));
        setLoading(false);
      });
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 text-slate-200">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Flame className="w-8 h-8 text-rose-500" />
          Hotspot Intelligence
        </h1>
        <p className="text-slate-400 mt-1">Aggregated failure clusters prioritized by AI.</p>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800">
              <th className="p-4 text-slate-400 font-bold uppercase text-xs tracking-wider">Hotspot Name</th>
              <th className="p-4 text-slate-400 font-bold uppercase text-xs tracking-wider">Category</th>
              <th className="p-4 text-slate-400 font-bold uppercase text-xs tracking-wider">Active Reports</th>
              <th className="p-4 text-slate-400 font-bold uppercase text-xs tracking-wider">Affected Population</th>
              <th className="p-4 text-slate-400 font-bold uppercase text-xs tracking-wider">Priority Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {hotspots.map((hotspot) => (
              <tr key={hotspot.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-bold text-white">{hotspot.name}</td>
                <td className="p-4">
                  <span className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-xs font-bold text-brand-400">
                    {hotspot.category}
                  </span>
                </td>
                <td className="p-4 font-mono text-slate-300">{hotspot.report_count}</td>
                <td className="p-4 font-mono text-slate-300">{hotspot.citizens_affected.toLocaleString()}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${hotspot.priority_score >= 80 ? 'bg-rose-500' : hotspot.priority_score >= 60 ? 'bg-amber-500' : 'bg-brand-500'}`}
                        style={{ width: `${hotspot.priority_score}%` }}
                      ></div>
                    </div>
                    <span className={`font-bold ${hotspot.priority_score >= 80 ? 'text-rose-400' : 'text-slate-300'}`}>
                      {hotspot.priority_score}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GovHotspots;
