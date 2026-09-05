import { useEffect, useState } from 'react';
import { fetchImpacts } from '../../api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2, Target, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

const GovImpact = () => {
  const [impacts, setImpacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImpacts().then(data => {
      setImpacts(data);
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
        <span>Loading Historical Impact & SLA Redressal Audit...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 font-sans pb-12">
      
      {/* Top Header Strip */}
      <header className="border-b border-[#27342c] pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-[#5da673]/15 border border-[#5da673]/30 text-[#8cd7a0] font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3 h-3" />
              SATELLITE-VERIFIED IMPACT AUDIT
            </span>
            <span className="font-mono text-xs text-[#9ab0a2]">NODE BIHAR-IN-04</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#e8ede9] flex items-center gap-2">
            <Target className="w-7 h-7 text-[#5da673]" />
            Impact Tracker & Historical Redressal Audit
          </h1>
          <p className="text-xs sm:text-sm text-[#9ab0a2] mt-0.5 max-w-2xl">
            Objective Before/After delivery auditing comparing raw complaint volumes, commute times, and accessibility indices post-intervention.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-[#8cd7a0] bg-[#151d19] border border-[#27342c] px-3.5 py-1.5 rounded-xl shrink-0">
          <span>Audit Cycle: <strong className="text-[#e8ede9]">FY 2024-Q3</strong></span>
          <span className="text-[#27342c]">|</span>
          <span>Sentinel-2 Synced: <strong className="text-[#5da673]">100%</strong></span>
        </div>
      </header>

      {/* Projects Impact Feed */}
      <div className="grid grid-cols-1 gap-6">
        {impacts.map((impact) => {
          const complaintDelta = Math.round(((impact.before_complaints - impact.after_complaints) / impact.before_complaints) * 100);

          return (
            <div 
              key={impact.id} 
              className="bg-[#151d19] border border-[#27342c] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs text-[#8cd7a0] mb-1 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#5da673]" />
                    <span>COMPLETED & SATELLITE AUDITED</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-[#e8ede9]">
                    {impact.project_name}
                  </h2>
                  <div className="text-xs font-mono text-[#9ab0a2] flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#5da673]" /> {impact.location}
                  </div>
                </div>

                <div className="text-left sm:text-right bg-[#1a241f] border border-[#27342c] p-3 rounded-xl">
                  <div className="font-mono text-[10px] uppercase text-[#9ab0a2] tracking-wider mb-0.5">
                    Overall Impact Score
                  </div>
                  <div className="font-display text-3xl font-bold text-[#8cd7a0]">
                    {impact.overall_impact_score}/100
                  </div>
                </div>
              </div>

              {/* 3 Metric Comparison Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                
                {/* Citizen Complaints */}
                <div className="bg-[#1a241f] rounded-xl p-4 border border-[#27342c]">
                  <div className="flex items-center justify-between text-xs font-mono text-[#9ab0a2] mb-2 font-bold">
                    <span>Citizen Grievance Volume</span>
                    <span className="text-[#8cd7a0]">-{complaintDelta}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-[10px] font-mono text-[#ffb693]">BEFORE</div>
                      <div className="text-xl font-bold font-display text-[#ffb693]">
                        {impact.before_complaints}
                      </div>
                    </div>
                    <span className="text-[#9ab0a2] font-mono">→</span>
                    <div>
                      <div className="text-[10px] font-mono text-[#8cd7a0]">AFTER</div>
                      <div className="text-xl font-bold font-display text-[#8cd7a0]">
                        {impact.after_complaints}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Travel Time */}
                <div className="bg-[#1a241f] rounded-xl p-4 border border-[#27342c]">
                  <div className="flex items-center justify-between text-xs font-mono text-[#9ab0a2] mb-2 font-bold">
                    <span>Avg Transit Time</span>
                    <span className="text-[#8cd7a0]">Improved</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-[10px] font-mono text-[#ffb693]">BEFORE</div>
                      <div className="text-xl font-bold font-display text-[#ffb693]">
                        {impact.before_travel_time_min}m
                      </div>
                    </div>
                    <span className="text-[#9ab0a2] font-mono">→</span>
                    <div>
                      <div className="text-[10px] font-mono text-[#8cd7a0]">AFTER</div>
                      <div className="text-xl font-bold font-display text-[#8cd7a0]">
                        {impact.after_travel_time_min}m
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accessibility Score */}
                <div className="bg-[#1a241f] rounded-xl p-4 border border-[#27342c]">
                  <div className="flex items-center justify-between text-xs font-mono text-[#9ab0a2] mb-2 font-bold">
                    <span>Accessibility Metric</span>
                    <span className="text-[#8cd7a0]">Elevated</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-[10px] font-mono text-[#ffb693]">BEFORE</div>
                      <div className="text-xl font-bold font-display text-[#ffb693]">
                        {impact.before_accessibility_score}
                      </div>
                    </div>
                    <span className="text-[#9ab0a2] font-mono">→</span>
                    <div>
                      <div className="text-[10px] font-mono text-[#8cd7a0]">AFTER</div>
                      <div className="text-xl font-bold font-display text-[#8cd7a0]">
                        {impact.after_accessibility_score}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Comparative Recharts Visualizer */}
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Complaints', Before: impact.before_complaints, After: impact.after_complaints },
                      { name: 'Travel Time (min)', Before: impact.before_travel_time_min, After: impact.after_travel_time_min },
                      { name: 'Accessibility Index', Before: impact.before_accessibility_score, After: impact.after_accessibility_score }
                    ]}
                    margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#27342c" />
                    <XAxis dataKey="name" stroke="#9ab0a2" tick={{ fill: '#9ab0a2', fontSize: 11 }} />
                    <YAxis stroke="#9ab0a2" tick={{ fill: '#9ab0a2', fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#151d19', 
                        borderColor: '#27342c', 
                        borderRadius: '0.75rem',
                        color: '#e8ede9',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '12px'
                      }} 
                    />
                    <Legend 
                      wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '11px', paddingTop: '10px' }} 
                    />
                    <Bar dataKey="Before" fill="#d47a4c" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="After" fill="#5da673" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default GovImpact;
