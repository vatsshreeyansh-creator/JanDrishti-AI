import { useEffect, useState } from 'react';
import { fetchRecommendations } from '../../api/client';
import { ShieldCheck, Users, Banknote, AlertTriangle, Loader2 } from 'lucide-react';

const GovRecommendations = () => {
  const [recs, setRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    const load = () => {
      fetchRecommendations().then(data => {
        setRecs(data.sort((a: any, b: any) => b.priority_score - a.priority_score));
        setLoading(false);
      });
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>;

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-6 animate-in fade-in duration-500 text-slate-200">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-white">AI Recommended Projects</h1>
        <p className="text-slate-400 mt-1">Data-driven interventions based on hotspot urgency and citizen demand.</p>
      </header>

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="w-1/3 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {recs.map(rec => (
            <div 
              key={rec.id}
              onClick={() => setSelected(rec)}
              className={`p-4 rounded-xl cursor-pointer border transition-all ${
                selected?.id === rec.id 
                ? 'bg-slate-800 border-brand-500 shadow-[0_0_15px_rgba(20,184,166,0.1)]' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-brand-400 border border-brand-900/50">
                  {rec.hotspot_name}
                </div>
                <div className="text-xs font-mono font-bold text-rose-400">Score: {rec.priority_score}</div>
              </div>
              <h3 className="font-bold text-white text-sm line-clamp-2">{rec.title}</h3>
              <div className="mt-3 flex justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1"><Banknote className="w-3 h-3"/> ₹{rec.est_cost_cr} Cr</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {rec.citizens_benefited.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="w-2/3 bg-slate-900 border border-slate-800 rounded-2xl overflow-y-auto custom-scrollbar p-8">
          {selected ? (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 text-brand-400 text-sm font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-5 h-5" /> Recommended Intervention
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">{selected.title}</h2>
              <p className="text-slate-400 text-lg mb-8">{selected.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                   <div className="text-slate-500 text-xs uppercase font-bold mb-1">Est. Investment</div>
                   <div className="text-2xl font-bold text-emerald-400">₹{selected.est_cost_cr} Cr</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                   <div className="text-slate-500 text-xs uppercase font-bold mb-1">Citizens Benefited</div>
                   <div className="text-2xl font-bold text-blue-400">{selected.citizens_benefited.toLocaleString()}</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                   <div className="text-slate-500 text-xs uppercase font-bold mb-1">Priority Score</div>
                   <div className="text-2xl font-bold text-rose-400">{selected.priority_score}/100</div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Why This Recommendation?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2"></div>
                    <div>
                      <div className="font-bold text-slate-200">Citizen Evidence</div>
                      <div className="text-sm text-slate-400">{selected.reasoning}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2"></div>
                    <div>
                      <div className="font-bold text-slate-200">Infrastructure Evidence</div>
                      <div className="text-sm text-slate-400">AI analysis indicates critical structural gaps clustering around {selected.hotspot_name}.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-lg font-bold transition-colors">
                  Approve for Budgeting
                </button>
                <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-bold transition-colors">
                  Request Detail Report
                </button>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600">
              <ShieldCheck className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg">Select a recommendation to view AI reasoning.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GovRecommendations;
