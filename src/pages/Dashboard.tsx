import { ArrowRight, BrainCircuit, Map, ShieldAlert, BarChart3, Crosshair } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
          Beyond Complaints. <span className="text-brand-600">Towards Intelligence.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Traditional portals only tell governments <strong>WHAT</strong> citizens complained about. <br/>
          JanDrishti transforms raw civic voices into actionable geospatial intelligence.
        </p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-4">The JanDrishti Paradigm Shift</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldAlert className="w-24 h-24 text-slate-900" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Old Way: The "What"</h3>
            <ul className="space-y-3 text-slate-600 relative z-10">
              <li className="flex items-center gap-2">❌ Text-heavy ticket lists</li>
              <li className="flex items-center gap-2">❌ "First-in, first-out" response</li>
              <li className="flex items-center gap-2">❌ Siloed department data</li>
              <li className="flex items-center gap-2">❌ Reactive firefighting</li>
            </ul>
          </div>

          <div className="bg-brand-50 p-6 rounded-xl border border-brand-100 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Crosshair className="w-24 h-24 text-brand-700" />
            </div>
            <h3 className="text-lg font-bold text-brand-900 mb-2">JanDrishti: The "Why & Where"</h3>
             <ul className="space-y-3 text-brand-800 relative z-10">
              <li className="flex items-center gap-2">✅ <strong>WHERE:</strong> Precise Hotspot Mapping</li>
              <li className="flex items-center gap-2">✅ <strong>WHY:</strong> AI Context & Sentiment Analysis</li>
              <li className="flex items-center gap-2">✅ <strong>WHO:</strong> Citizen Impact Radius</li>
              <li className="flex items-center gap-2">✅ <strong>HOW MUCH:</strong> Data-driven Budgeting</li>
            </ul>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-6 text-slate-800">Explore the Intelligence Pipeline</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Link to="/gov/analysis" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all group">
          <BrainCircuit className="w-8 h-8 text-brand-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-slate-900 mb-2">1. AI Analysis</h3>
          <p className="text-sm text-slate-600 mb-4">Extracting intent, severity, and entities from raw unstructured voice.</p>
          <span className="text-brand-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            View Module <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        <Link to="/gov/map" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all group">
          <Map className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-slate-900 mb-2">2. Spatial Hotspots</h3>
          <p className="text-sm text-slate-600 mb-4">Plotting demand geographically to find systemic infrastructure failures.</p>
          <span className="text-brand-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            View Module <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        <Link to="/gov/priority" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all group">
          <Crosshair className="w-8 h-8 text-rose-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-slate-900 mb-2">3. Priority Engine</h3>
          <p className="text-sm text-slate-600 mb-4">Ranking issues by citizen impact, not just chronological order.</p>
          <span className="text-brand-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            View Module <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        <Link to="/gov/budget" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all group">
          <BarChart3 className="w-8 h-8 text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-slate-900 mb-2">4. Smart Budgets</h3>
          <p className="text-sm text-slate-600 mb-4">Simulating how targeted investments maximize citizen satisfaction.</p>
          <span className="text-brand-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            View Module <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

      </div>
    </div>
  );
};

export default Dashboard;
