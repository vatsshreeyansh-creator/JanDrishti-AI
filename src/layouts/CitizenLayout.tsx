import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  PlusCircle, 
  List, 
  AlertTriangle,
  ArrowLeft,
  Bell,
  Clock
} from 'lucide-react';
import { fetchNotifications, markNotificationRead } from '../api/client';

const DisclaimerBanner = () => (
  <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 flex items-center justify-center text-amber-800 text-sm font-medium z-50">
    <AlertTriangle className="w-4 h-4 mr-2" />
    HACKATHON PROTOTYPE: All data is synthetic. Does not reflect real citizens, actual government integration, or production use.
  </div>
);

const CitizenNavbar = () => {
  const location = useLocation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

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
    { path: '/citizen', label: 'My Community', icon: Home },
    { path: '/citizen/report', label: 'Report Issue', icon: PlusCircle },
    { path: '/citizen/my-reports', label: 'My Reports', icon: List },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="inline-flex items-center text-slate-500 hover:text-brand-600 mr-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
            </Link>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              JanDrishti <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">Citizen</span>
            </h1>
          </div>
          <div className="flex space-x-1 sm:space-x-4 items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (location.pathname === '/citizen/' && item.path === '/citizen');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-brand-50 text-brand-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1.5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="ml-2 p-2 text-slate-400 hover:text-slate-600 relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 rounded-full bg-rose-500 items-center justify-center text-[9px] font-bold text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden z-50">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                    <span className="text-xs text-brand-600 font-medium">{unreadCount} unread</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-slate-500 text-sm">No notifications yet.</div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${notif.is_read ? 'opacity-60' : 'bg-brand-50/30'}`}
                          onClick={() => {
                            handleRead(notif.id);
                            setShowDropdown(false);
                          }}
                        >
                          <p className="text-sm text-slate-800 font-medium">{notif.message}</p>
                          <div className="flex justify-between mt-2">
                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Just now
                            </span>
                            {!notif.is_read && <span className="w-2 h-2 rounded-full bg-brand-500"></span>}
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
  <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
    <DisclaimerBanner />
    <CitizenNavbar />
    <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
      {children}
    </main>
  </div>
);
