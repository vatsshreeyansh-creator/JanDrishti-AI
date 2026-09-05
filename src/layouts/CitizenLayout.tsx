import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  PlusCircle, 
  List, 
  ArrowLeft, 
  Bell, 
  Clock, 
  CheckCircle,
  Radio
} from 'lucide-react';
import { fetchNotifications, markNotificationRead } from '../api/client';

const LiveTickerRibbon = () => {
  return (
    <div className="w-full bg-[#151d19] border-b border-[#27342c] px-4 py-1.5 text-xs text-[#9ab0a2]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#5da673] text-[#00391b]">
            <Radio className="w-2.5 h-2.5" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#5da673] font-bold whitespace-nowrap">
            Live Redressal Stream:
          </span>
          <p className="text-xs truncate text-[#e8ede9]">
            ✓ RWD Unit #12 patched 3.2km Gaya-Bodhgaya feeder road • Redressal confirmed via Sentinel-2 Satellite audit (Ward 09)
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-[#9ab0a2]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb693] animate-ping"></span>
            Ingestion Node: <strong className="text-[#e8ede9]">IN-BH-GAYA-04</strong>
          </span>
          <span className="text-[#27342c]">|</span>
          <span className="text-[#9ab0a2]">
            SLA Compliance: <strong className="text-[#5da673] font-bold">96.8%</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

const CitizenNavbar = () => {
  const location = useLocation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (e) {}
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleRead = async (id: number) => {
    try {
      await markNotificationRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (e) {}
  };

  const navItems = [
    { path: '/citizen', label: 'Citizen Home', icon: Home },
    { path: '/citizen/report', label: '+ Report Issue', icon: PlusCircle },
    { path: '/citizen/my-reports', label: 'Docket / My Reports', icon: List },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#0d1511]/90 backdrop-blur-xl border-b border-[#27342c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Node */}
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              title="Return to Portal Selection" 
              className="p-2 rounded-lg bg-[#151d19] border border-[#27342c] text-[#9ab0a2] hover:text-[#e8ede9] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-[#5da673] tracking-tight">Jan Drishti AI</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#1a241f] text-[#8cd7a0] border border-[#27342c]">
                  Citizen Portal
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#9ab0a2]">
                Constituency: Bodh Gaya (AC-229)
              </span>
            </div>

            <div className="hidden xl:flex items-center gap-2 bg-[#151d19] border border-[#27342c] px-3 py-1 rounded-full text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb693] animate-pulse"></span>
              <span className="text-[#9ab0a2]">Node #441:</span>
              <span className="text-[#8cd7a0] font-semibold">Active</span>
            </div>
          </div>

          {/* Nav Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 bg-[#151d19] p-1 rounded-xl border border-[#27342c]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (location.pathname === '/citizen/' && item.path === '/citizen');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive 
                        ? 'bg-[#5da673] text-[#00381a] font-bold shadow-sm' 
                        : 'text-[#9ab0a2] hover:text-[#e8ede9] hover:bg-[#1a241f]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Language Selector */}
            <div className="relative hidden sm:block">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-[#151d19] text-[#e8ede9] border border-[#27342c] rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-[#5da673] cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="bho">भोजपुरी (Bhojpuri)</option>
                <option value="mag">मगही (Magahi)</option>
              </select>
            </div>

            {/* UIDAI Token Pill */}
            <div className="hidden lg:flex items-center gap-2 bg-[#151d19] border border-[#27342c] px-2.5 py-1 rounded-lg">
              <CheckCircle className="w-3.5 h-3.5 text-[#5da673]" />
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase text-[#9ab0a2]">UIDAI Token</span>
                <span className="font-mono text-[11px] font-bold text-[#e8ede9]">#JD-CITIZEN-402</span>
              </div>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 rounded-lg bg-[#151d19] border border-[#27342c] text-[#9ab0a2] hover:text-[#e8ede9] relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 rounded-full bg-[#ffb693] text-[#351000] items-center justify-center text-[9px] font-mono font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#151d19] border border-[#27342c] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 bg-[#1a241f] border-b border-[#27342c] flex justify-between items-center">
                    <h3 className="font-display font-bold text-[#e8ede9] text-xs uppercase tracking-wider">
                      Sovereign Telemetry Feeds
                    </h3>
                    <span className="text-[10px] font-mono text-[#5da673] bg-[#5da673]/10 px-2 py-0.5 rounded border border-[#5da673]/30">
                      {unreadCount} UNREAD
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar divide-y divide-[#27342c]/50">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-[#9ab0a2] text-xs">No notifications yet.</div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`p-3.5 cursor-pointer hover:bg-[#1a241f] transition-colors ${notif.is_read ? 'opacity-60' : 'bg-[#151d19]'}`}
                          onClick={() => {
                            handleRead(notif.id);
                            setShowDropdown(false);
                          }}
                        >
                          <p className="text-xs text-[#e8ede9] font-medium leading-relaxed">{notif.message}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-[10px] font-mono text-[#9ab0a2] flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#5da673]" /> Live Action Update
                            </span>
                            {!notif.is_read && <span className="w-2 h-2 rounded-full bg-[#ffb693]"></span>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </nav>
  );
};

export const CitizenLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#0d1511] text-[#e8ede9] font-sans flex flex-col antialiased">
    <LiveTickerRibbon />
    <CitizenNavbar />
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
      {children}
    </main>
  </div>
);
