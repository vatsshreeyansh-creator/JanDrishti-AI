import { mockImpactMetrics } from '../data/mockData';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Clock, TrendingDown, Users, CheckCircle } from 'lucide-react';

const ImpactTracker = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Impact Measurement</h1>
          <p className="text-slate-500 mt-1">Tracking real-world outcomes of intelligence-driven governance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-brand-50 rounded-lg text-brand-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-slate-500 font-medium">Avg Resolution Time</div>
            <div className="text-2xl font-bold text-slate-800">8 Days</div>
            <div className="text-xs text-green-600 font-medium flex items-center mt-1">
              <TrendingDown className="w-3 h-3 mr-1" /> -75% from 32 days
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-slate-500 font-medium">Issues Resolved</div>
            <div className="text-2xl font-bold text-slate-800">14,205</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">In last 6 months</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-slate-500 font-medium">Repeat Complaints</div>
            <div className="text-2xl font-bold text-slate-800">12%</div>
            <div className="text-xs text-green-600 font-medium flex items-center mt-1">
              <TrendingDown className="w-3 h-3 mr-1" /> Down from 45%
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-slate-500 font-medium">Citizen Satisfaction</div>
            <div className="text-2xl font-bold text-slate-800">4.2/5</div>
            <div className="text-xs text-green-600 font-medium mt-1">
              Up from 2.1/5
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6">Resolution Time Trend (Days)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockImpactMetrics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBefore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorWith" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="beforeJanDrishti" 
                name="Traditional Portal" 
                stroke="#94a3b8" 
                fillOpacity={1} 
                fill="url(#colorBefore)" 
                strokeWidth={2} 
                strokeDasharray="5 5"
              />
              <Area 
                type="monotone" 
                dataKey="withJanDrishti" 
                name="JanDrishti Intelligence" 
                stroke="#0d9488" 
                fillOpacity={1} 
                fill="url(#colorWith)" 
                strokeWidth={3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ImpactTracker;
