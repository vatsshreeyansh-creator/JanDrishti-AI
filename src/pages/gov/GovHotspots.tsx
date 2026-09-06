import { useEffect, useState } from 'react';
import { fetchHotspots } from '../../api/client';
import { Flame, Loader2, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const GovHotspots = () => {
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      fetchHotspots().then(data => {
        setHotspots(data.sort((a: any, b: any) => b.priority_score - a.priority_score));
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
        <span>Aggregating Spatial Hotspot Intelligence...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 font-sans">
      
      {/* Header */}
      <header className="border-b border-[#27342c] pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded-full bg-[#773208]/30 border border-[#ffb693]/30 text-[#ffb693] font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <Flame className="w-3.5 h-3.5" />
              HOTSPOT CONVERGENCE PIPELINE
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#e8ede9]">
            Hotspot Intelligence Matrix
          </h1>
          <p className="text-xs sm:text-sm text-[#9ab0a2] mt-0.5">
            Grassroots multi-citizen grievance clusters ranked by composite urgency and population footprint.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-[#8cd7a0] bg-[#151d19] border border-[#27342c] px-3.5 py-1.5 rounded-xl">
          <span>Clusters Analyzed: <strong className="text-[#e8ede9]">{hotspots.length}</strong></span>
          <span className="text-[#27342c]">|</span>
          <span>Highest Score: <strong className="text-[#ffb693]">{hotspots[0]?.priority_score || 94}/100</strong></span>
        </div>
      </header>

      {/* Hotspots Table Container */}
      <div className="bg-[#151d19] border border-[#27342c] rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="bg-[#1a241f] border-b border-[#27342c] font-mono text-[11px] text-[#9ab0a2] uppercase tracking-wider">
                <th className="p-4 pl-6">Hotspot Name & Node</th>
                <th className="p-4">Infrastructure Sector</th>
                <th className="p-4 text-center">Active Reports</th>
                <th className="p-4 text-center">Affected Population</th>
                <th className="p-4">Priority Gauge</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27342c] text-xs">
              {hotspots.map((hotspot) => {
                const isCritical = hotspot.priority_score >= 80;
                const isHigh = hotspot.priority_score >= 60;

                return (
                  <tr 
                    key={hotspot.id} 
                    className="hover:bg-[#1a241f]/70 transition-colors"
                  >
                    <td className="p-4 pl-6">
                      <div className="font-display font-bold text-sm text-[#e8ede9]">
                        {hotspot.name}
                      </div>
                      <div className="text-[11px] font-mono text-[#9ab0a2] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#5da673]" /> {hotspot.lat?.toFixed(4)}°N, {hotspot.lng?.toFixed(4)}°E
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-mono text-xs font-bold text-[#8cd7a0] bg-[#1a241f] border border-[#27342c] px-2.5 py-1 rounded-lg">
                        {hotspot.category}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-center text-[#e8ede9] font-bold">
                      {hotspot.report_count}
                    </td>

                    <td className="p-4 font-mono text-center text-[#aacfb7] font-semibold">
                      {hotspot.citizens_affected.toLocaleString()}
                    </td>

                    <td className="p-4 min-w-[180px]">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-[#1a241f] rounded-full overflow-hidden border border-[#27342c]">
                          <div 
                            className={`h-full rounded-full ${
                              isCritical ? 'bg-[#ffb693]' : isHigh ? 'bg-[#d47a4c]' : 'bg-[#5da673]'
                            }`}
                            style={{ width: `${hotspot.priority_score}%` }}
                          ></div>
                        </div>
                        <span className={`font-mono font-bold text-xs ${
                          isCritical ? 'text-[#ffb693]' : isHigh ? 'text-[#d47a4c]' : 'text-[#8cd7a0]'
                        }`}>
                          {hotspot.priority_score}/100
                        </span>
                      </div>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <Link
                        to="/gov/recommendations"
                        className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#8cd7a0] hover:text-[#e8ede9] bg-[#1a241f] hover:bg-[#242c27] px-3 py-1.5 rounded-lg border border-[#27342c] transition-colors"
                      >
                        Inspect <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default GovHotspots;
