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
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
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
    <aside className="w-[280px] bg-white dark:bg-[#151d19] border-r border-[#d8e2dc] dark:border-[#27342c] h-full flex flex-col justify-between py-4 shadow-xl z-30 shrink-0 transition-colors duration-200">
      <div className="flex flex-col gap-4 px-4">
        
        {/* Brand Header with Theme Switch */}
        <div className="flex items-center justify-between px-1 py-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#eff1eb] dark:bg-[#5da673]/20 border border-[#d8e2dc] dark:border-[#5da673]/40 flex items-center justify-center text-[#4a7c59] dark:text-[#8cd7a0] shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm text-[#1d2620] dark:text-[#e8ede9] font-bold uppercase tracking-wider">Jan Drishti AI</span>
              <span className="font-mono text-[10px] text-[#4a7c59] dark:text-[#8cd7a0] tracking-wider uppercase font-semibold">GovOS Sovereign Rail</span>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-[#f5f6f0] dark:bg-[#1a241f] border border-[#d8e2dc] dark:border-[#27342c] text-[#1d2620] dark:text-[#e8ede9] hover:border-[#5da673] transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Light and Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#ffb693]" /> : <Moon className="w-3.5 h-3.5 text-[#4a7c59]" />}
          </button>
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
                    ? 'bg-[#4a7c59] dark:bg-[#5da673] text-white dark:text-[#00381a] font-bold shadow-sm'
                    : 'text-[#56685c] dark:text-[#9ab0a2] hover:bg-[#f5f6f0] dark:hover:bg-[#1a241f] hover:text-[#1d2620] dark:hover:text-[#e8ede9]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white dark:text-[#00381a]' : 'text-[#4a7c59] dark:text-[#8cd7a0]'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Switch Portal */}
      <div className="px-4 space-y-3">
        <div className="bg-[#f5f6f0] dark:bg-[#1a241f] border border-[#d8e2dc] dark:border-[#27342c] rounded-lg p-2.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#56685c] dark:text-[#9ab0a2] mb-1">
            <span>TELEMETRY STREAM</span>
            <span className="text-[#4a7c59] dark:text-[#8cd7a0]">24.79°N, 85.00°E</span>
          </div>
          <div className="h-1 bg-[#d8e2dc] dark:bg-[#27342c] rounded-full overflow-hidden">
            <div className="h-full bg-[#5da673] w-3/4 rounded-full"></div>
          </div>
        </div>

        <div className="bg-[#fbeae2] dark:bg-[#773208]/20 border border-[#d8e2dc] dark:border-[#d47a4c]/40 rounded-lg p-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-[#c85a32] dark:text-[#ffb693] font-bold text-[11px] mb-1">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>OPERATIONAL DEMO</span>
          </div>
          <p className="text-[#56685c] dark:text-[#ffb693]/70 text-[10px] leading-relaxed">
            Connected to sovereign FastAPI backend. Real-time NLP vectorization enabled.
          </p>
        </div>

        <Link 
          to="/" 
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-[#f5f6f0] dark:bg-[#1a241f] hover:bg-[#e6e9e1] dark:hover:bg-[#242c27] text-xs font-mono uppercase tracking-wider text-[#56685c] dark:text-[#9ab0a2] hover:text-[#1d2620] dark:hover:text-[#e8ede9] border border-[#d8e2dc] dark:border-[#27342c] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Switch Portal
        </Link>
      </div>
    </aside>
  );
};

export const GovLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen overflow-hidden bg-[#fbfbf7] dark:bg-[#0d1511] text-[#1d2620] dark:text-[#e8ede9] font-sans antialiased transition-colors duration-200">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
      <main className="flex-1 overflow-y-auto p-6 md:p-8 relative custom-scrollbar bg-[#fbfbf7] dark:bg-[#0d1511]">
        {children}
      </main>
    </div>
  </div>
);
