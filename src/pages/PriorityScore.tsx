import { mockComplaints } from '../data/mockData';
import { Target, ArrowUpRight, ArrowDownRight, AlertOctagon } from 'lucide-react';

const PriorityScore = () => {
  // Sort complaints by AI priority
  const sortedComplaints = [...mockComplaints].sort((a, b) => b.aiPriority - a.aiPriority);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Priority Engine</h1>
          <p className="text-slate-500 mt-1">Stop treating all complaints equally. Resolve highest-impact issues first.</p>
        </div>
        <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2">
          <Target className="w-4 h-4 text-brand-500" />
          Scoring Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Traditional Model</div>
          <div className="text-2xl font-bold text-slate-800">Chronological</div>
          <p className="text-xs text-rose-500 flex items-center mt-2 font-medium">
            <ArrowDownRight className="w-3 h-3 mr-1" /> High-impact issues delayed
          </p>
        </div>
        <div className="bg-brand-50 p-5 rounded-xl border border-brand-200 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <Target className="w-24 h-24 text-brand-700" />
          </div>
          <div className="text-sm text-brand-700 font-medium mb-1 relative z-10">JanDrishti Model</div>
          <div className="text-2xl font-bold text-brand-900 relative z-10">Impact-Based</div>
          <p className="text-xs text-brand-700 flex items-center mt-2 font-medium relative z-10">
            <ArrowUpRight className="w-3 h-3 mr-1" /> Maximize citizen ROI
          </p>
        </div>
        <div className="bg-slate-900 p-5 rounded-xl shadow-sm text-white">
           <div className="text-sm text-slate-400 mb-1">Scoring Factors</div>
           <ul className="text-xs text-slate-300 space-y-1 mt-2">
             <li>• AI Severity Detection (40%)</li>
             <li>• Spatial Density (30%)</li>
             <li>• Demographic Impact (30%)</li>
           </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="p-4 font-semibold">JanDrishti Score</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Evidence / Intent</th>
              <th className="p-4 font-semibold">Traditional Rank</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedComplaints.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`text-lg font-bold w-12 text-center rounded py-1 ${
                      item.aiPriority > 85 ? 'bg-rose-100 text-rose-700' :
                      item.aiPriority > 70 ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {item.aiPriority}
                    </div>
                    {item.aiPriority > 90 && <AlertOctagon className="w-4 h-4 text-rose-500" />}
                  </div>
                </td>
                <td className="p-4 font-medium text-slate-800">{item.category}</td>
                <td className="p-4">
                  <div className="text-xs text-slate-500 mb-1 max-w-xs truncate">{item.text}</div>
                  <div className="flex gap-1 flex-wrap">
                    {item.aiTags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-slate-400 font-medium">
                  #{item.id.replace('C', '')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriorityScore;
