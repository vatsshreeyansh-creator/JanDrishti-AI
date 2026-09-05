import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Target, 
  DollarSign, 
  ShieldAlert,
  ArrowLeft,
  Activity,
  BarChart,
  AlertTriangle
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/gov', label: 'Live Overview', icon: LayoutDashboard },
    { path: '/gov/map', label: 'Spatial Intelligence', icon: MapIcon },
    { path: '/gov/hotspots', label: 'Hotspot List', icon: Activity },
    { path: '/gov/recommendations', label: 'AI Recommendations', icon: Target },
    { path: '/gov/budget', label: 'Budget Simulator', icon: DollarSign },
    { path: '/gov/impact', label: 'Impact Tracker', icon: BarChart },
    { path: '/gov/risks', label: 'Risk Alerts', icon: AlertTriangle },
  ];

  return (
    <div className="w-64 bg-slate-950 text-slate-300 h-full flex flex-col border-r border-slate-800">
      <div className="p-6">
        <Link to="/" className="inline-flex items-center text-xs text-slate-500 hover:text-white mb-6 transition-colors font-medium">
          <ArrowLeft className="w-3 h-3 mr-1" /> Switch Portal
        </Link>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 mb-1">
          JanDrishti <span className="bg-brand-500/20 text-brand-400 text-[10px] px-2 py-0.5 rounded uppercase tracking-widest border border-brand-500/30">Gov</span>
        </h1>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold flex items-center gap-1">
          <Activity className="w-3 h-3 text-emerald-500" /> Operational Intelligence
        </p>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (location.pathname === '/gov/' && item.path === '/gov');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm ${
                isActive ? 'bg-slate-800 text-white font-bold border border-slate-700' : 'hover:bg-slate-900 hover:text-white text-slate-400 font-medium'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : ''}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-900">
        <div className="bg-rose-950/30 border border-rose-900/50 rounded-lg p-3 text-xs flex items-start gap-2">
           <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
           <p className="text-rose-200/70">
             <strong className="text-rose-400 block mb-1">DEMO MODE</strong>
             Using synthetic demonstration data. Connected to local Python backend.
           </p>
        </div>
      </div>
    </div>
  );
};

export const GovLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen overflow-hidden bg-slate-900 font-sans">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <main className="flex-1 overflow-y-auto p-8 relative custom-scrollbar">
        {children}
      </main>
    </div>
  </div>
);
