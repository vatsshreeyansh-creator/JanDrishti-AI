import { Link } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  ArrowRight, 
  Sparkles, 
  Radio, 
  Layers, 
  Cpu, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0d1511] text-[#e8ede9] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden font-sans">
      
      {/* Architectural Background Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#5da673_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Subtle Atmospheric Glows */}
      <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] bg-[#5da673]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] bg-[#ffb693]/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Telemetry Strip */}
      <div className="relative z-10 flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#151d19] border border-[#27342c] mb-8 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#5da673] animate-ping"></span>
        <span className="font-mono text-xs uppercase tracking-widest text-[#8cd7a0] font-bold">
          Sovereign Civic Operating System v4.2
        </span>
        <span className="text-[#27342c]">|</span>
        <span className="font-mono text-xs text-[#9ab0a2]">Bodh Gaya District Node</span>
      </div>

      {/* Hero Title Header */}
      <div className="relative z-10 text-center max-w-4xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a241f] border border-[#5da673]/40 text-[#8cd7a0] font-mono text-xs uppercase tracking-wider mb-4 shadow-[0_0_12px_rgba(93,166,115,0.2)]">
          <Sparkles className="w-3.5 h-3.5" />
          Neural Multi-Modal Civic Redressal
        </div>

        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#e8ede9] mb-4">
          Jan <span className="text-[#5da673]">Drishti</span> AI
        </h1>

        <p className="font-sans text-base sm:text-xl text-[#9ab0a2] max-w-2xl mx-auto leading-relaxed">
          The sovereign civic intelligence platform transforming grassroots vernacular citizen voice into prioritized spatial infrastructure decisions and algorithmic budget allocations.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#151d19] border border-[#27342c] text-xs font-mono text-[#9ab0a2]">
            <Radio className="w-3.5 h-3.5 text-[#5da673]" /> Acoustic Vernacular Intake
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#151d19] border border-[#27342c] text-xs font-mono text-[#9ab0a2]">
            <Layers className="w-3.5 h-3.5 text-[#ffb693]" /> Geospatial Clustering
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#151d19] border border-[#27342c] text-xs font-mono text-[#9ab0a2]">
            <Cpu className="w-3.5 h-3.5 text-[#aacfb7]" /> Capex Optimization
          </span>
        </div>
      </div>

      {/* Dual Persona Portal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full relative z-10">
        
        {/* Citizen Portal Card */}
        <Link 
          to="/citizen" 
          className="group bg-[#151d19] border border-[#27342c] hover:border-[#5da673] p-8 rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(93,166,115,0.15)] flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#5da673]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-[#5da673]/20 border border-[#5da673]/40 text-[#8cd7a0] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#5da673] bg-[#5da673]/10 border border-[#5da673]/30 px-2.5 py-1 rounded-full font-bold">
                CITIZEN ACCESS
              </span>
            </div>

            <h2 className="font-display text-2xl font-bold text-[#e8ede9] mb-3 group-hover:text-[#8cd7a0] transition-colors">
              Citizen Voice Portal
            </h2>

            <p className="text-sm text-[#9ab0a2] mb-6 leading-relaxed">
              Report local issues via spoken voice or text in Bhojpuri, Hindi, Magahi, or English. Track your grievance through our 4-stage statutory resolution docket.
            </p>

            <ul className="space-y-2 mb-6 font-mono text-xs text-[#9ab0a2]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5da673]" /> Multi-dialect acoustic intake
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5da673]" /> Automatic GPS coordinate geotagging
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5da673]" /> Radial priority score transparency
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-[#27342c] flex items-center justify-between text-[#8cd7a0] font-bold text-sm">
            <span>Enter as Citizen</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </Link>

        {/* Government Operational Intelligence Card */}
        <Link 
          to="/gov" 
          className="group bg-[#151d19] border border-[#27342c] hover:border-[#ffb693] p-8 rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,182,147,0.15)] flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#ffb693]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-[#773208]/30 border border-[#ffb693]/40 text-[#ffb693] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="w-7 h-7" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#ffb693] bg-[#773208]/20 border border-[#ffb693]/30 px-2.5 py-1 rounded-full font-bold">
                AUTHORITY RAIL
              </span>
            </div>

            <h2 className="font-display text-2xl font-bold text-[#e8ede9] mb-3 group-hover:text-[#ffb693] transition-colors">
              Civic Command Center
            </h2>

            <p className="text-sm text-[#9ab0a2] mb-6 leading-relaxed">
              District Magistrate and Executive Engineer intelligence dashboard. Cluster multi-voice grievances, simulate Capex budget ROI, and audit infrastructure delivery.
            </p>

            <ul className="space-y-2 mb-6 font-mono text-xs text-[#9ab0a2]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ffb693]" /> Live citizen signal pulse & triage
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ffb693]" /> Spatial intelligence & GIS failure maps
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ffb693]" /> Quadratic convex Capex optimizer
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-[#27342c] flex items-center justify-between text-[#ffb693] font-bold text-sm">
            <span>Access Command Center</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </Link>

      </div>

      {/* Footer Info */}
      <div className="mt-12 text-center text-xs font-mono text-[#9ab0a2] flex flex-wrap items-center justify-center gap-4">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#5da673]" /> Sovereign Civic Architecture
        </span>
        <span className="text-[#27342c]">•</span>
        <span>Connected to Live Python Backend</span>
        <span className="text-[#27342c]">•</span>
        <span>Hackathon Demonstration Prototype</span>
      </div>

    </div>
  );
};

export default Landing;
