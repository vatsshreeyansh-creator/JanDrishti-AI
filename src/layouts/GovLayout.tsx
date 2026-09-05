import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Activity, 
  Target, 
  DollarSign, 
  BarChart3, 
  AlertTriangle,
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/gov', label: 'Civic Command Center', icon: LayoutDashboard },
    { path: '/gov/map', label: 'Geospatial Hotspots', icon: MapIcon },
    { path: '/gov/hotspots', label: 'Hotspot Intelligence', icon: Activity },
    { path: '/gov/recommendations', label: 'Multi-Voice Clusters', icon: Target },
    { path: '/gov/budget', label: 'Capex Simulator', icon: DollarSign },
    { path: '/gov/impact', label: 'Impact & SLA Audit', icon: BarChart3 },
    { path: '/gov/risks', label: 'Predictive Risk Alerts', icon: AlertTriangle },
  ];

  return (
    <aside className="w-[280px] bg-[#151d19] border-r border-[#27342c] h-full flex flex-col justify-between py-4 shadow-2xl z-30 shrink-0">
      <div className="flex flex-col gap-4 px-4">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-1 py-1">
          <div className="h-10 w-10 rounded-lg bg-[#5da673]/20 border border-[#5da673]/40 flex items-center justify-center text-[#8cd7a0] shadow-[0_0_12px_rgba(93,166,115,0.2)]">
            <Sparkles className="w-5 h-5 text-[#8cd7a0]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm text-[#e8ede9] font-bold uppercase tracking-wider">Jan Drishti AI</span>
            <span className="font-mono text-[10px] text-[#8cd7a0] tracking-wider uppercase font-semibold">GovOS Sovereign Rail</span>
          </div>
        </div>

        {/* Authority Node Card */}
        <div className="bg-[#1a241f] border border-[#27342c] rounded-xl p-3 flex flex-col gap-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#9ab0a2]">Authority Node</span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-[#8cd7a0] bg-[#5da673]/10 px-1.5 py-0.5 rounded border border-[#5da673]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5da673] animate-pulse"></span>
              LIVE
            </span>
          </div>
          <div className="flex items-center justify-between text-[#e8ede9]">
            <span className="font-sans text-xs font-semibold truncate">Gaya District Magistrate</span>
            <CheckCircle2 className="w-4 h-4 text-[#8cd7a0] shrink-0" />
          </div>
          <div className="text-[10px] font-mono text-[#9ab0a2] truncate">Jurisdiction: IN-BH-GAYA-04</div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (location.pathname === '/gov/' && item.path === '/gov');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#5da673] text-[#00381a] font-bold shadow-[0_0_15px_rgba(93,166,115,0.25)]'
                    : 'text-[#9ab0a2] hover:bg-[#1a241f] hover:text-[#e8ede9]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#00381a]' : 'text-[#8cd7a0]'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Switch Portal */}
      <div className="px-4 space-y-3">
        <div className="bg-[#1a241f] border border-[#27342c] rounded-lg p-2.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#9ab0a2] mb-1">
            <span>TELEMETRY STREAM</span>
            <span className="text-[#8cd7a0]">24.79°N, 85.00°E</span>
          </div>
          <div className="h-1 bg-[#27342c] rounded-full overflow-hidden">
            <div className="h-full bg-[#5da673] w-3/4 rounded-full"></div>
          </div>
        </div>

        <div className="bg-[#773208]/20 border border-[#d47a4c]/40 rounded-lg p-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-[#ffb693] font-bold text-[11px] mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-[#ffb693] shrink-0" />
            <span>OPERATIONAL DEMO</span>
          </div>
          <p className="text-[#ffb693]/70 text-[10px] leading-relaxed">
            Connected to sovereign FastAPI backend. Real-time NLP vectorization enabled.
          </p>
        </div>

        <Link 
          to="/" 
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-[#1a241f] hover:bg-[#242c27] text-xs font-mono uppercase tracking-wider text-[#9ab0a2] hover:text-[#e8ede9] border border-[#27342c] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Switch Portal
        </Link>
      </div>
    </aside>
  );
};

export const GovLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen overflow-hidden bg-[#0d1511] text-[#e8ede9] font-sans antialiased">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
      <main className="flex-1 overflow-y-auto p-6 md:p-8 relative custom-scrollbar bg-[#0d1511]">
        {children}
      </main>
    </div>
  </div>
);
