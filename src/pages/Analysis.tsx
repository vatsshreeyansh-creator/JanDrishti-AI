import { useState } from 'react';
import { mockComplaints } from '../data/mockData';
import { Brain, Tag } from 'lucide-react';

const Analysis = () => {
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  const simulateAnalysis = (id: string) => {
    setAnalyzing(id);
    setTimeout(() => {
      setAnalyzing(null);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Citizen Voice Analysis</h1>
          <p className="text-slate-500 mt-1">AI-powered extraction of intent, severity, and entities from raw text.</p>
        </div>
        <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2">
          <Brain className="w-4 h-4 text-brand-500" />
          NLP Engine Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockComplaints.map((complaint) => (
          <div key={complaint.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">Ticket: {complaint.id}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  complaint.sentiment === 'critical' ? 'bg-rose-100 text-rose-700' :
                  complaint.sentiment === 'high' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  Sentiment: {complaint.sentiment.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-800 text-lg mb-4 italic">"{complaint.text}"</p>
              
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1">
                  <Brain className="w-3 h-3" /> Extracted Entities
                </h4>
                {analyzing === complaint.id ? (
                  <div className="flex items-center gap-2 text-brand-600 text-sm">
                    <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                    Processing NLP...
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {complaint.aiTags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 text-sm bg-brand-50 text-brand-700 px-2 py-1 rounded border border-brand-100">
                        <Tag className="w-3 h-3" /> {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="bg-slate-50 border-t px-5 py-3 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <span className="text-sm font-medium text-slate-600">Auto-Category:</span>
                 <span className="text-sm font-bold text-slate-800">{complaint.category}</span>
               </div>
               <button 
                  onClick={() => simulateAnalysis(complaint.id)}
                  className="text-brand-600 text-sm font-medium hover:text-brand-700 flex items-center gap-1"
               >
                 Re-Analyze
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analysis;
