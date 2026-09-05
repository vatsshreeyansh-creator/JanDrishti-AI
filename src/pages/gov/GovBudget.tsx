import { useState, useEffect } from 'react';
import { simulateBudget } from '../../api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, Zap, TrendingUp, Loader2 } from 'lucide-react';

const GovBudget = () => {
  const [budget, setBudget] = useState(250);
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const runSim = async () => {
      setLoading(true);
      try {
        const data = await simulateBudget(budget);
        setSimulationData(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    
    const timeoutId = setTimeout(() => {
      runSim();
    }, 500); // debounce

    return () => clearTimeout(timeoutId);
  }, [budget]);

  const totalImpact = simulationData.reduce((acc, curr) => acc + curr.citizens_benefited, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 text-slate-200">
      <div className="flex justify-between items-end border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Smart Budget Simulator</h1>
          <p className="text-slate-400 mt-1">Simulate ROI and infrastructure gap reduction across sectors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              Adjust Total Available Budget (Cr)
            </h3>
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-3 text-slate-400 font-medium">
                <span>₹50 Cr</span>
                <span className="text-emerald-400 font-bold text-2xl">₹{budget} Cr</span>
                <span>₹1000 Cr</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="1000" 
                step="10"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
            
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Simulation Status</div>
              <div className="flex items-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 text-brand-500 animate-spin" /> : <TrendingUp className="w-5 h-5 text-brand-500" />}
                <span className="text-sm font-medium text-slate-300">{loading ? 'Recalculating Allocations...' : 'Optimized for Maximum ROI'}</span>
              </div>
            </div>
          </div>

          <div className="bg-brand-900/20 p-6 rounded-2xl border border-brand-500/30 shadow-xl">
            <h3 className="font-bold text-brand-400 mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Projected Citizen Impact
            </h3>
            <div className="text-4xl font-extrabold text-white mb-2">
              {loading ? '...' : totalImpact.toLocaleString()}
            </div>
            <p className="text-sm text-brand-300/70 font-medium">Citizens directly benefited by these allocations.</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col">
           <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Recommended Allocation by Sector
            </h3>
            <div className="flex-1 min-h-[350px] w-full">
              {simulationData.length > 0 && !loading ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={simulationData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip 
                      cursor={{fill: '#1e293b'}}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc' }}
                      formatter={(value: any) => [`₹${value} Cr`, 'Allocation']}
                    />
                    <Bar dataKey="recommended_allocation" radius={[4, 4, 0, 0]}>
                      {simulationData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#0ea5e9'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                   <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
                </div>
              )}
            </div>
            <p className="text-xs text-center text-slate-500 mt-4 font-medium">
              Funds are distributed proportionally based on AI Priority Scores and spatial demand hotspots.
            </p>
        </div>
      </div>
    </div>
  );
};

export default GovBudget;
