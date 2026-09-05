import { useState } from 'react';
import { regionScores } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, Zap, TrendingUp } from 'lucide-react';

const BudgetSimulator = () => {
  const [budget, setBudget] = useState(250);
  const totalNeeded = regionScores.reduce((acc, curr) => acc + curr.budgetNeeded, 0);

  // Simple simulation logic
  const simulatedData = regionScores.map(region => {
    const allocation = (budget / totalNeeded) * region.budgetNeeded;
    const funded = Math.min(allocation, region.budgetNeeded);
    const percentFunded = funded / region.budgetNeeded;
    const impactAchieved = Math.floor(region.citizenImpact * percentFunded);
    
    return {
      name: region.region.split(' ')[0],
      needed: region.budgetNeeded,
      allocated: Math.floor(funded),
      impact: impactAchieved,
      score: region.score
    };
  });

  const totalImpact = simulatedData.reduce((acc, curr) => acc + curr.impact, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Budget & Impact Simulator</h1>
          <p className="text-slate-500 mt-1">Data-driven resource allocation based on geospatial intelligence.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-brand-500" />
              Adjust City Budget (Cr)
            </h3>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2 text-slate-600 font-medium">
                <span>₹50 Cr</span>
                <span className="text-brand-600 font-bold text-lg">₹{budget} Cr</span>
                <span>₹500 Cr</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="500" 
                step="10"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Total Needed vs Available</div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-rose-600">₹{totalNeeded}</span>
                <span className="text-sm text-slate-500 mb-1">vs</span>
                <span className="text-xl font-bold text-slate-800">₹{budget}</span>
              </div>
            </div>
          </div>

          <div className="bg-brand-50 p-6 rounded-xl border border-brand-200 shadow-sm">
            <h3 className="font-bold text-brand-900 mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-600" />
              Projected ROI
            </h3>
            <div className="text-3xl font-extrabold text-brand-700 mb-1">
              {totalImpact.toLocaleString()}
            </div>
            <p className="text-sm text-brand-600 font-medium">Citizens Positively Impacted</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-500" />
              Smart Allocation by District
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={simulatedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="needed" name="Needed (Cr)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="allocated" name="Allocated (Cr)" radius={[4, 4, 0, 0]}>
                    {simulatedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.allocated >= entry.needed ? '#10b981' : '#0d9488'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-slate-500 mt-4 font-medium">
              Funds are distributed proportionally based on AI Priority Scores and spatial demand.
            </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetSimulator;
