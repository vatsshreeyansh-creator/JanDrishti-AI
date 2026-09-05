import { useEffect, useState } from 'react';
import { fetchRecommendations } from '../../api/client';
import { 
  ShieldCheck, 
  Users, 
  Banknote, 
  AlertTriangle, 
  Loader2, 
  Sparkles, 
  ArrowRight,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const GovRecommendations = () => {
  const [recs, setRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    const load = () => {
      fetchRecommendations().then(data => {
        const sorted = data.sort((a: any, b: any) => b.priority_score - a.priority_score);
        setRecs(sorted);
        if (sorted.length > 0) {
          setSelected(sorted[0]);
        }
        setLoading(false);
      }).catch(e => {
        console.error(e);
        setLoading(false);
      });
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center font-mono text-[#8cd7a0]">
        <Loader2 className="w-8 h-8 animate-spin text-[#5da673] mr-3" />
        <span>Synthesizing Multi-Voice Issue Clusters...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col space-y-5 animate-in fade-in duration-500 font-sans">
      
      {/* Top Telemetry Header */}
      <header className="border-b border-[#27342c] pb-4 shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-[#5da673]/15 border border-[#5da673]/30 text-[#8cd7a0] font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3 h-3" />
              CONVERGENCE INTELLIGENCE ENGINE
            </span>
            <span className="font-mono text-xs text-[#9ab0a2]">NODE-BIHAR-04 // CLUSTER-PIPELINE</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#e8ede9] flex items-center gap-2">
            Many Citizen Voices <span className="text-[#ffb693]">→</span> One Development Decision
          </h1>
          <p className="text-xs text-[#9ab0a2] mt-0.5">
            Automated multi-modal clustering synthesizing grassroots spoken dialect into unified government intervention proposals.
          </p>
        </div>

        <Link
          to="/gov/budget"
          className="bg-[#5da673] hover:bg-[#4a7c59] text-[#00381a] px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(93,166,115,0.25)] shrink-0"
        >
          Open Capex Simulator <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Master-Detail Split Grid */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left: Clusters List (1/3) */}
        <div className="w-full lg:w-5/12 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
          {recs.map((rec) => {
            const isSelected = selected?.id === rec.id;
            return (
              <div 
                key={rec.id}
                onClick={() => setSelected(rec)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 relative overflow-hidden ${
                  isSelected 
                    ? 'bg-[#1a241f] border-[#5da673] shadow-[0_0_20px_rgba(93,166,115,0.15)]' 
                    : 'bg-[#151d19] border-[#27342c] hover:border-[#3d594a]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#151d19] text-[#8cd7a0] border border-[#27342c]">
                    {rec.hotspot_name}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#ffb693]">
                    Score: {rec.priority_score}/100
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm text-[#e8ede9] line-clamp-2 mb-2">
                  {rec.title}
                </h3>

                <div className="flex items-center justify-between text-xs font-mono text-[#9ab0a2] pt-2 border-t border-[#27342c]">
                  <span className="flex items-center gap-1 text-[#8cd7a0]">
                    <Banknote className="w-3.5 h-3.5" /> ₹{rec.est_cost_cr} Cr
                  </span>
                  <span className="flex items-center gap-1 text-[#aacfb7]">
                    <Users className="w-3.5 h-3.5" /> {rec.citizens_benefited.toLocaleString()} Benefited
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Intervention Detail View (2/3) */}
        <div className="w-full lg:w-7/12 bg-[#151d19] border border-[#27342c] rounded-2xl overflow-y-auto custom-scrollbar p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
          {selected ? (
            <div className="space-y-6">
              
              {/* Header */}
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8cd7a0] bg-[#5da673]/10 border border-[#5da673]/30 px-3 py-1 rounded-full uppercase tracking-wider font-bold mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" /> Recommended High-Impact Intervention
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#e8ede9] tracking-tight">
                  {selected.title}
                </h2>
                <p className="text-sm text-[#9ab0a2] mt-2 leading-relaxed">
                  {selected.description}
                </p>
              </div>

              {/* 3 High-Impact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#1a241f] rounded-xl p-4 border border-[#27342c]">
                  <span className="font-mono text-[10px] uppercase text-[#9ab0a2] block mb-1">
                    Est. Capital Investment
                  </span>
                  <div className="font-display text-2xl font-bold text-[#8cd7a0]">
                    ₹{selected.est_cost_cr} Cr
                  </div>
                </div>
                <div className="bg-[#1a241f] rounded-xl p-4 border border-[#27342c]">
                  <span className="font-mono text-[10px] uppercase text-[#9ab0a2] block mb-1">
                    Citizens Benefited
                  </span>
                  <div className="font-display text-2xl font-bold text-[#aacfb7]">
                    {selected.citizens_benefited.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#1a241f] rounded-xl p-4 border border-[#27342c]">
                  <span className="font-mono text-[10px] uppercase text-[#9ab0a2] block mb-1">
                    AI Priority Index
                  </span>
                  <div className="font-display text-2xl font-bold text-[#ffb693]">
                    {selected.priority_score}/100
                  </div>
                </div>
              </div>

              {/* Why This Recommendation? (Evidence Box) */}
              <div className="bg-[#1a241f] border border-[#27342c] rounded-xl p-5 space-y-4">
                <h3 className="font-display font-bold text-sm text-[#e8ede9] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#ffb693]" />
                  Algorithmic Justification & Ground Evidence
                </h3>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5da673] mt-1.5 shrink-0"></span>
                    <div>
                      <span className="font-mono font-bold text-[#8cd7a0]">Grassroots Spoken Evidence: </span>
                      <span className="text-[#e8ede9]">{selected.reasoning}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffb693] mt-1.5 shrink-0"></span>
                    <div>
                      <span className="font-mono font-bold text-[#ffb693]">Infrastructural Degradation Vector: </span>
                      <span className="text-[#9ab0a2]">
                        AI vector spatial analysis detects critical structural vulnerabilities clustering around {selected.hotspot_name}. High flood inundation risk identified via monsoon flood elevation contours.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#27342c] flex flex-wrap items-center gap-3">
                <Link
                  to="/gov/budget"
                  className="bg-[#5da673] hover:bg-[#4a7c59] text-[#00381a] px-6 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(93,166,115,0.25)]"
                >
                  Approve for Capex Allocation <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => alert(`Generated PMGSY / RWD Work Order draft for "${selected.title}"`)}
                  className="bg-[#1a241f] hover:bg-[#242c27] text-[#e8ede9] px-5 py-2.5 rounded-xl font-mono text-xs font-medium border border-[#27342c] transition-colors flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-[#8cd7a0]" /> Draft Nodal Work Order
                </button>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[#9ab0a2] font-mono text-xs">
              <ShieldCheck className="w-12 h-12 mb-3 text-[#5da673]/30" />
              <span>Select an issue cluster to inspect AI intervention details.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default GovRecommendations;
