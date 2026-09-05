import { useEffect, useState } from 'react';
import { fetchRisks } from '../../api/client';
import { AlertTriangle, Loader2, ShieldAlert, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

const GovRisks = () => {
  const [risks, setRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRisks().then(data => {
      setRisks(data.sort((a: any, b: any) => b.risk_score - a.risk_score));
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center font-mono text-[#8cd7a0]">
        <Loader2 className="w-8 h-8 animate-spin text-[#5da673] mr-3" />
        <span>Evaluating Multi-Factor Infrastructure Risk Models...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 font-sans pb-12">
      
      {/* Top Header Strip */}
      <header className="border-b border-[#27342c] pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-[#773208]/30 border border-[#ffb693]/30 text-[#ffb693] font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3 h-3" />
              ANOMALY DETECTION & PREDICTIVE MITIGATION
            </span>
            <span className="font-mono text-xs text-[#9ab0a2]">NODE BIHAR-IN-04</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#e8ede9] flex items-center gap-2">
            <AlertTriangle className="w-7 h-7 text-[#ffb693]" />
            Predictive Infrastructure Risk Alerts
          </h1>
          <p className="text-xs sm:text-sm text-[#9ab0a2] mt-0.5 max-w-2xl">
            Proactive failure forecasting: Identifying structural collapse and inundation vectors before disasters occur via multi-variable spatial analysis.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-[#8cd7a0] bg-[#151d19] border border-[#27342c] px-3.5 py-1.5 rounded-xl shrink-0">
          <span>Vectors Tracked: <strong className="text-[#e8ede9]">{risks.length}</strong></span>
          <span className="text-[#27342c]">|</span>
          <span>Alert Severity: <strong className="text-[#ffb693]">CRITICAL</strong></span>
        </div>
      </header>

      {/* Grid of Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {risks.map((risk) => (
          <div 
            key={risk.id} 
            className="bg-[#151d19] border border-[#773208]/40 hover:border-[#ffb693]/60 rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden transition-all duration-200 flex flex-col justify-between"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#ffb693]/5 rounded-full blur-2xl pointer-events-none"></div>

            <div>
              {/* Card Header Strip */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <span className="text-[#ffb693] text-[10px] font-mono font-bold tracking-wider uppercase bg-[#773208]/30 px-2.5 py-1 rounded border border-[#ffb693]/40 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  HIGH INFRASTRUCTURE RISK
                </span>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-[#9ab0a2] uppercase">Composite Risk</div>
                  <div className="text-2xl font-bold font-display text-[#ffb693]">
                    {risk.risk_score}/100
                  </div>
                </div>
              </div>

              <h2 className="font-display text-xl font-bold text-[#e8ede9] mb-1">
                {risk.risk_type}
              </h2>

              <div className="text-xs font-mono text-[#9ab0a2] flex items-center gap-1.5 mb-4">
                <MapPin className="w-3.5 h-3.5 text-[#5da673]" /> {risk.location}
              </div>

              <p className="text-xs text-[#e8ede9] bg-[#1a241f] border border-[#27342c] p-3.5 rounded-xl leading-relaxed mb-4">
                {risk.description}
              </p>

              {/* Model Factors */}
              <div className="mb-4">
                <span className="font-mono text-[10px] uppercase text-[#9ab0a2] block mb-2 font-bold">
                  Predictive Model Vectors:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Monsoon Rainfall Matrix', 'Culvert Silt Drainage', 'Historical Ground Stress', 'Complaint Density Surge', 'Pop Vulnerability'].map((factor) => (
                    <span 
                      key={factor} 
                      className="bg-[#1a241f] text-[#aacfb7] text-[10px] font-mono px-2 py-0.5 rounded border border-[#27342c]"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendation & Action Box */}
            <div className="mt-4 pt-4 border-t border-[#27342c] space-y-3">
              <div className="bg-[#773208]/20 border border-[#ffb693]/30 rounded-xl p-3.5">
                <div className="text-[#ffb693] font-mono text-[10px] uppercase font-bold mb-1">
                  AI Mitigating Recommendation
                </div>
                <p className="text-xs text-[#e8ede9] leading-relaxed">
                  {risk.recommendation}
                </p>
              </div>

              <button
                onClick={() => alert(`Dispatched Pre-emptive Engineering Team to: ${risk.location}`)}
                className="w-full bg-[#1a241f] hover:bg-[#242c27] text-[#8cd7a0] border border-[#5da673]/40 hover:border-[#5da673] py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5da673]" />
                Dispatch Pre-emptive Field Triage
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default GovRisks;
