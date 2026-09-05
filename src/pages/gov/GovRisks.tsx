import { useEffect, useState } from 'react';
import { fetchRisks } from '../../api/client';
import { AlertTriangle, Loader2, ShieldAlert } from 'lucide-react';

const GovRisks = () => {
  const [risks, setRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRisks().then(data => {
      setRisks(data.sort((a: any, b: any) => b.risk_score - a.risk_score));
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 text-slate-200">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-8 h-8 text-rose-500" />
          Predictive Risk Alerts
        </h1>
        <p className="text-slate-400 mt-1">Prototype Risk Model: Identifying infrastructure failure vectors before they happen.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {risks.map(risk => (
          <div key={risk.id} className="bg-slate-900 border border-rose-900/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldAlert className="w-24 h-24 text-rose-500" />
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="text-rose-500 text-xs font-bold tracking-widest uppercase mb-1 bg-rose-500/10 px-2 py-1 rounded inline-block border border-rose-500/20">
                  HIGH INFRASTRUCTURE RISK
                </div>
                <div className="text-right">
                  <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">Risk Score</div>
                  <div className="text-3xl font-extrabold text-rose-400">{risk.risk_score}/100</div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">{risk.risk_type}</h2>
              <div className="text-slate-400 text-sm flex items-center gap-2 mb-6 font-mono">
                📍 {risk.location}
              </div>

              <p className="text-slate-300 text-sm mb-6 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                {risk.description}
              </p>

              <div className="mb-6">
                <h4 className="text-slate-500 text-xs font-bold uppercase mb-3">Model Factors</h4>
                <div className="flex flex-wrap gap-2">
                  {['Rainfall', 'Drainage', 'Historical Damage', 'Citizen Complaints', 'Population Vulnerability'].map(factor => (
                    <span key={factor} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded border border-slate-700">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-rose-950/30 border border-rose-900/50 rounded-xl p-4">
                <h4 className="text-rose-400 text-xs font-bold uppercase mb-2">Recommendation</h4>
                <p className="text-rose-200 text-sm">{risk.recommendation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GovRisks;
