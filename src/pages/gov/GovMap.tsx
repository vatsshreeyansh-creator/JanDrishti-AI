import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchHotspots } from '../../api/client';
import { Layers, Users, Activity, Loader2 } from 'lucide-react';

const GovMap = () => {
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetchHotspots().then(data => {
      setHotspots(data);
      setLoading(false);
    });
  }, []);

  const getMarkerColor = (score: number) => {
    if (score >= 80) return '#f43f5e';
    if (score >= 60) return '#f59e0b';
    return '#3b82f6';
  };

  const filteredHotspots = hotspots.filter(h => categoryFilter === 'All' || h.category === categoryFilter);

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-10rem)] flex flex-col space-y-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Spatial Intelligence Map</h1>
          <p className="text-slate-400 mt-1">Live infrastructure failure clusters across the state.</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg outline-none text-sm font-bold"
          >
            <option value="All">All Categories</option>
            <option value="Road Infrastructure">Road</option>
            <option value="Water Supply">Water</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Digital Connectivity">Digital</option>
          </select>
          <div className="flex gap-4 bg-slate-900 p-2.5 rounded-lg border border-slate-700 shadow-sm text-slate-300">
            <div className="flex items-center gap-2 text-sm font-bold">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span> Critical ({filteredHotspots.filter(h => h.priority_score >= 80).length})
            </div>
            <div className="flex items-center gap-2 text-sm font-bold">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span> Warning ({filteredHotspots.filter(h => h.priority_score >= 60 && h.priority_score < 80).length})
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 relative">
        <div className="absolute top-4 left-4 z-[1000] bg-slate-900/95 backdrop-blur p-4 rounded-lg shadow-lg border border-slate-700 max-w-xs text-white">
          <h3 className="font-bold flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-brand-400" /> Map Intelligence
          </h3>
          <p className="text-xs text-slate-400 mb-2">
            Circles represent AI-clustered hotspots. Radius indicates affected population size.
          </p>
        </div>

        {loading ? (
          <div className="flex h-full items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <MapContainer 
            center={[20.0, 78.0]} 
            zoom={5} 
            scrollWheelZoom={true}
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">Carto</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            {filteredHotspots.map(hotspot => (
              <CircleMarker
                key={hotspot.id}
                center={[hotspot.lat, hotspot.lng]}
                radius={Math.max(6, Math.min(20, hotspot.citizens_affected / 1000))}
                pathOptions={{ 
                  fillColor: getMarkerColor(hotspot.priority_score), 
                  color: getMarkerColor(hotspot.priority_score),
                  weight: 2,
                  fillOpacity: 0.6
                }}
              >
                <Popup className="rounded-lg bg-slate-900 border border-slate-700 text-white p-0 overflow-hidden">
                  <div className="p-4 bg-slate-900 text-white min-w-[200px]">
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">{hotspot.category}</div>
                    <div className="font-bold text-lg mb-3">{hotspot.name}</div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 flex items-center gap-1"><Activity className="w-3 h-3"/> Score</span>
                        <span className="font-bold text-rose-400">{hotspot.priority_score}/100</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 flex items-center gap-1"><Users className="w-3 h-3"/> Affected</span>
                        <span className="font-bold">{hotspot.citizens_affected.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 flex items-center gap-1"><Layers className="w-3 h-3"/> Reports</span>
                        <span className="font-bold">{hotspot.report_count}</span>
                      </div>
                    </div>
                    
                    <button className="w-full bg-brand-600 hover:bg-brand-500 text-white py-2 rounded text-xs font-bold transition-colors">
                      VIEW INTELLIGENCE
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default GovMap;
