import { useEffect, useState } from 'react';
import { fetchImpacts } from '../../api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2, Target } from 'lucide-react';

const GovImpact = () => {
  const [impacts, setImpacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImpacts().then(data => {
      setImpacts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 text-slate-200">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Target className="w-8 h-8 text-emerald-500" />
          Impact Tracker
        </h1>
        <p className="text-slate-400 mt-1">Measure the Before/After results of completed recommendations.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {impacts.map(impact => (
          <div key={impact.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-emerald-500 text-xs font-bold tracking-widest uppercase mb-1">Resolved Project</div>
                <h2 className="text-2xl font-bold text-white">{impact.project_name}</h2>
                <div className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                  📍 {impact.location}
                </div>
              </div>
              <div className="text-right">
                <div className="text-slate-500 text-xs font-bold uppercase mb-1">Overall Impact Score</div>
                <div className="text-4xl font-extrabold text-emerald-400">{impact.overall_impact_score}/100</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <h4 className="text-slate-400 text-sm font-bold mb-3">Citizen Complaints</h4>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-xs text-slate-500">Before</div>
                    <div className="text-xl font-bold text-rose-400">{impact.before_complaints}</div>
                  </div>
                  <div className="text-slate-600">→</div>
                  <div>
                    <div className="text-xs text-slate-500">After</div>
                    <div className="text-xl font-bold text-emerald-400">{impact.after_complaints}</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <h4 className="text-slate-400 text-sm font-bold mb-3">Avg Travel Time (Min)</h4>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-xs text-slate-500">Before</div>
                    <div className="text-xl font-bold text-rose-400">{impact.before_travel_time_min}m</div>
                  </div>
                  <div className="text-slate-600">→</div>
                  <div>
                    <div className="text-xs text-slate-500">After</div>
                    <div className="text-xl font-bold text-emerald-400">{impact.after_travel_time_min}m</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <h4 className="text-slate-400 text-sm font-bold mb-3">Accessibility Score</h4>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-xs text-slate-500">Before</div>
                    <div className="text-xl font-bold text-rose-400">{impact.before_accessibility_score}</div>
                  </div>
                  <div className="text-slate-600">→</div>
                  <div>
                    <div className="text-xs text-slate-500">After</div>
                    <div className="text-xl font-bold text-emerald-400">{impact.after_accessibility_score}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Complaints', Before: impact.before_complaints, After: impact.after_complaints },
                    { name: 'Travel Time (m)', Before: impact.before_travel_time_min, After: impact.after_travel_time_min },
                    { name: 'Accessibility Score', Before: impact.before_accessibility_score, After: impact.after_accessibility_score }
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Legend />
                  <Bar dataKey="Before" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="After" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GovImpact;
