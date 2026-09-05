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
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#fbfbf7] dark:bg-[#0d1511] text-[#1d2620] dark:text-[#e8ede9] flex flex-col justify-between p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans transition-colors duration-200">
      
      {/* Architectural Background Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 dark:opacity-20 bg-[radial-gradient(#5da673_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Atmospheric Glows */}
      <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] bg-[#5da673]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] bg-[#ffb693]/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Bar with Sovereign Badge & Interactive Light/Dark Mode Switcher */}
      <header className="relative z-20 max-w-6xl w-full mx-auto flex items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#151d19] border border-[#d8e2dc] dark:border-[#27342c] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#5da673] animate-ping"></span>
          <span className="font-mono text-xs uppercase tracking-widest text-[#4a7c59] dark:text-[#8cd7a0] font-bold">
            Sovereign Portal v4.2
          </span>
          <span className="text-[#d8e2dc] dark:text-[#27342c]">|</span>
          <span className="font-mono text-xs text-[#56685c] dark:text-[#9ab0a2]">Bodh Gaya Grid</span>
        </div>

        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          id="theme-toggle-btn"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#151d19] border border-[#d8e2dc] dark:border-[#27342c] text-[#1d2620] dark:text-[#e8ede9] hover:border-[#5da673] shadow-sm hover:shadow transition-all cursor-pointer group select-none"
          aria-label="Toggle Light and Dark Mode"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-[#ffb693] group-hover:rotate-45 transition-transform" />
              <span className="font-mono text-xs font-semibold">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-[#4a7c59] group-hover:-rotate-12 transition-transform" />
              <span className="font-mono text-xs font-semibold">Dark Mode</span>
            </>
          )}
        </button>
      </header>

      {/* Hero Content Header */}
      <div className="relative z-10 text-center max-w-4xl mx-auto my-auto py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eff1eb] dark:bg-[#1a241f] border border-[#d8e2dc] dark:border-[#5da673]/40 text-[#4a7c59] dark:text-[#8cd7a0] font-mono text-xs uppercase tracking-wider mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          Neural Multi-Modal Civic Redressal
        </div>

        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1d2620] dark:text-[#e8ede9] mb-4">
          Jan <span className="text-[#4a7c59] dark:text-[#5da673]">Drishti</span> AI
        </h1>

        <p className="font-sans text-base sm:text-xl text-[#56685c] dark:text-[#9ab0a2] max-w-2xl mx-auto leading-relaxed">
          The sovereign civic intelligence platform transforming grassroots vernacular citizen voice into prioritized spatial infrastructure decisions and algorithmic budget allocations.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-[#151d19] border border-[#d8e2dc] dark:border-[#27342c] text-xs font-mono text-[#56685c] dark:text-[#9ab0a2] shadow-xs">
            <Radio className="w-3.5 h-3.5 text-[#4a7c59] dark:text-[#5da673]" /> Acoustic Vernacular Intake
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-[#151d19] border border-[#d8e2dc] dark:border-[#27342c] text-xs font-mono text-[#56685c] dark:text-[#9ab0a2] shadow-xs">
            <Layers className="w-3.5 h-3.5 text-[#c85a32] dark:text-[#ffb693]" /> Geospatial Clustering
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-[#151d19] border border-[#d8e2dc] dark:border-[#27342c] text-xs font-mono text-[#56685c] dark:text-[#9ab0a2] shadow-xs">
            <Cpu className="w-3.5 h-3.5 text-[#705c30] dark:text-[#aacfb7]" /> Capex Optimization
          </span>
        </div>

        {/* Dual Persona Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full mt-10 text-left">
          
          {/* Citizen Portal Card */}
          <Link 
            to="/citizen" 
            className="group bg-white dark:bg-[#151d19] border border-[#d8e2dc] dark:border-[#27342c] hover:border-[#4a7c59] dark:hover:border-[#5da673] p-7 sm:p-8 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-[#eff1eb] dark:bg-[#5da673]/20 border border-[#d8e2dc] dark:border-[#5da673]/40 text-[#4a7c59] dark:text-[#8cd7a0] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a7c59] dark:text-[#5da673] bg-[#eff1eb] dark:bg-[#5da673]/10 border border-[#d8e2dc] dark:border-[#5da673]/30 px-2.5 py-1 rounded-full font-bold">
                  CITIZEN ACCESS
                </span>
              </div>

              <h2 className="font-display text-2xl font-bold text-[#1d2620] dark:text-[#e8ede9] mb-3 group-hover:text-[#4a7c59] dark:group-hover:text-[#8cd7a0] transition-colors">
                Citizen Voice Portal
              </h2>

              <p className="text-sm text-[#56685c] dark:text-[#9ab0a2] mb-6 leading-relaxed">
                Report local issues via spoken voice or text in Bhojpuri, Hindi, Magahi, or English. Track your grievance through our 4-stage statutory resolution docket.
              </p>

              <ul className="space-y-2 mb-6 font-mono text-xs text-[#56685c] dark:text-[#9ab0a2]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4a7c59] dark:text-[#5da673]" /> Multi-dialect acoustic intake
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4a7c59] dark:text-[#5da673]" /> Automatic GPS coordinate geotagging
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4a7c59] dark:text-[#5da673]" /> Radial priority score transparency
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#d8e2dc] dark:border-[#27342c] flex items-center justify-between text-[#4a7c59] dark:text-[#8cd7a0] font-bold text-sm">
              <span>Enter as Citizen</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Government Operational Intelligence Card */}
          <Link 
            to="/gov" 
            className="group bg-white dark:bg-[#151d19] border border-[#d8e2dc] dark:border-[#27342c] hover:border-[#c85a32] dark:hover:border-[#ffb693] p-7 sm:p-8 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-[#fbeae2] dark:bg-[#773208]/30 border border-[#d8e2dc] dark:border-[#ffb693]/40 text-[#c85a32] dark:text-[#ffb693] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-7 h-7" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#c85a32] dark:text-[#ffb693] bg-[#fbeae2] dark:bg-[#773208]/20 border border-[#d8e2dc] dark:border-[#ffb693]/30 px-2.5 py-1 rounded-full font-bold">
                  AUTHORITY RAIL
                </span>
              </div>

              <h2 className="font-display text-2xl font-bold text-[#1d2620] dark:text-[#e8ede9] mb-3 group-hover:text-[#c85a32] dark:group-hover:text-[#ffb693] transition-colors">
                Civic Command Center
              </h2>

              <p className="text-sm text-[#56685c] dark:text-[#9ab0a2] mb-6 leading-relaxed">
                District Magistrate and Executive Engineer intelligence dashboard. Cluster multi-voice grievances, simulate Capex budget ROI, and audit infrastructure delivery.
              </p>

              <ul className="space-y-2 mb-6 font-mono text-xs text-[#56685c] dark:text-[#9ab0a2]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c85a32] dark:text-[#ffb693]" /> Live citizen signal pulse & triage
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c85a32] dark:text-[#ffb693]" /> Spatial intelligence & GIS failure maps
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c85a32] dark:text-[#ffb693]" /> Quadratic convex Capex optimizer
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#d8e2dc] dark:border-[#27342c] flex items-center justify-between text-[#c85a32] dark:text-[#ffb693] font-bold text-sm">
              <span>Access Command Center</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

        </div>
      </div>

      {/* Footer Info */}
      <footer className="relative z-10 text-center text-xs font-mono text-[#56685c] dark:text-[#9ab0a2] flex flex-wrap items-center justify-center gap-4 py-4 border-t border-[#d8e2dc]/50 dark:border-[#27342c]/50">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#4a7c59] dark:text-[#5da673]" /> Sovereign Civic Architecture
        </span>
        <span className="text-[#d8e2dc] dark:text-[#27342c]">•</span>
        <span>Connected to Live Python Backend</span>
        <span className="text-[#d8e2dc] dark:text-[#27342c]">•</span>
        <span>Hackathon Demonstration Prototype</span>
      </footer>

    </div>
  );
};

export default Landing;
