import { Link } from 'react-router-dom';
import { Building2, Users, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
          JanDrishti
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          The Geospatial Intelligence Platform bridging the gap between citizen voices and proactive governance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full relative z-10">
        
        {/* Citizen Portal Card */}
        <Link 
          to="/citizen" 
          className="group bg-slate-800 border border-slate-700 hover:border-blue-500 p-8 rounded-2xl transition-all hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Users className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Citizen Portal</h2>
          <p className="text-slate-400 mb-6 flex-1">
            Report local infrastructure issues, track resolutions, and see the impact of community voices in your neighborhood.
          </p>
          <div className="text-blue-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
            Enter as Citizen <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Government Portal Card */}
        <Link 
          to="/gov" 
          className="group bg-slate-800 border border-slate-700 hover:border-brand-500 p-8 rounded-2xl transition-all hover:shadow-2xl hover:shadow-brand-500/10 flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-brand-500/10 text-brand-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Building2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Government Dashboard</h2>
          <p className="text-slate-400 mb-6 flex-1">
            Transform raw complaints into geospatial intelligence. Analyze hotspots, prioritize by impact, and simulate budget ROI.
          </p>
          <div className="text-brand-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
            Enter as Government <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

      </div>
      
      <div className="mt-16 text-slate-500 text-sm">
        Hackathon Prototype • Synthetic Data
      </div>
    </div>
  );
};

export default Landing;
