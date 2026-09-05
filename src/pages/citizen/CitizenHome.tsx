import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, CheckCircle2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchReports } from '../../api/client';

const CitizenHome = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchReports(1000, 'recent');
        setReports(data);
      } catch (e) {} finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter to only show issues in the most recent report's location (e.g. user's current city)
  const localLocation = reports.length > 0 ? reports[0].location_name : '';
  const localIssues = reports.filter(r => r.location_name === localLocation);
  
  const resolvedCount = localIssues.filter(r => r.status === 'Resolved').length;
  const unresolved = localIssues.length - resolvedCount;

  if (loading) return null;

  // Find center
  const centerLat = localIssues.length > 0 ? localIssues[0].lat : 28.6139;
  const centerLng = localIssues.length > 0 ? localIssues[0].lng : 77.2090;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Community: {localIssues.length > 0 ? localIssues[0].district : 'Local Area'}</h1>
          <p className="text-slate-500 mt-1">Stay updated on local infrastructure and community reports.</p>
        </div>
        <Link 
          to="/citizen/report" 
          className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm inline-flex items-center justify-center gap-2"
        >
          <AlertCircle className="w-5 h-5" />
          Report an Issue
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-slate-500 font-medium">Active Issues Near You</div>
            <div className="text-2xl font-bold text-slate-800">{unresolved}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-slate-500 font-medium">Resolved in Area</div>
            <div className="text-2xl font-bold text-slate-800">{resolvedCount}</div>
          </div>
        </div>
        <div className={`bg-gradient-to-br from-brand-500 to-brand-700 p-6 rounded-xl shadow-sm text-white flex items-center gap-4`}>
          <div className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="text-white/80 text-sm font-medium">Total Area Reports</div>
            <div className="text-3xl font-bold">{localIssues.length}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-500" />
            Neighborhood Map
          </h2>
          <div className="bg-slate-200 rounded-xl overflow-hidden border border-slate-300 h-96 relative">
            <MapContainer 
              center={[centerLat, centerLng]} 
              zoom={13} 
              scrollWheelZoom={false}
              className="w-full h-full z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              {localIssues.map(complaint => (
                <CircleMarker
                  key={complaint.id}
                  center={[complaint.lat, complaint.lng]}
                  radius={8}
                  pathOptions={{ 
                    fillColor: complaint.status === 'Resolved' ? '#10b981' : '#ef4444', 
                    color: complaint.status === 'Resolved' ? '#10b981' : '#ef4444',
                    weight: 2,
                    fillOpacity: 0.6
                  }}
                >
                  <Popup className="rounded-lg">
                    <div className="p-1">
                      <div className="font-bold text-slate-800 mb-1">{complaint.category}</div>
                      <div className="text-xs text-slate-600">"{complaint.text}"</div>
                      <div className="text-xs font-bold text-brand-600 mt-2">{complaint.status}</div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Recent Reports</h2>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100 h-96 overflow-y-auto custom-scrollbar">
            {localIssues.slice(0, 5).map((issue) => (
              <div key={issue.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {issue.category}
                  </span>
                </div>
                <p className="text-sm text-slate-700 line-clamp-3">"{issue.text}"</p>
                <div className={`mt-3 text-xs font-bold inline-block px-2 py-1 rounded ${
                  issue.status === 'Resolved' ? 'text-emerald-600 bg-emerald-50' :
                  issue.status === 'Under Investigation' ? 'text-amber-600 bg-amber-50' :
                  'text-slate-600 bg-slate-100'
                }`}>
                  Status: {issue.status}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default CitizenHome;
