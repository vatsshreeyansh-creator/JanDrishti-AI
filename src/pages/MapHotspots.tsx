import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { mockComplaints } from '../data/mockData';
import { Layers } from 'lucide-react';

const MapHotspots = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getMarkerColor = (sentiment: string) => {
    switch (sentiment) {
      case 'critical': return '#ef4444'; // rose-500
      case 'high': return '#f59e0b'; // amber-500
      default: return '#3b82f6'; // blue-500
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-10rem)] flex flex-col space-y-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Spatial Hotspot Analysis</h1>
          <p className="text-slate-500 mt-1">Identify systemic failures by mapping complaint clusters.</p>
        </div>
        <div className="flex gap-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span> Critical
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span> High Risk
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span> Standard
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-200 rounded-xl overflow-hidden border border-slate-300 relative">
        <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur p-4 rounded-lg shadow-lg border border-slate-200 max-w-xs">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-brand-600" /> Map Intelligence
          </h3>
          <p className="text-xs text-slate-600 mb-2">
            This map highlights demand concentration. A single pothole report is an incident; 15 reports in a 500m radius is an infrastructure failure.
          </p>
        </div>

        {isMounted && (
          <MapContainer 
            center={[28.6139, 77.2090]} // New Delhi coordinates as mock
            zoom={13} 
            scrollWheelZoom={false}
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" // Clean light map
            />
            
            {mockComplaints.map(complaint => (
              <CircleMarker
                key={complaint.id}
                center={[complaint.location[0], complaint.location[1]]}
                radius={complaint.sentiment === 'critical' ? 12 : complaint.sentiment === 'high' ? 8 : 6}
                pathOptions={{ 
                  fillColor: getMarkerColor(complaint.sentiment), 
                  color: getMarkerColor(complaint.sentiment),
                  weight: 2,
                  fillOpacity: 0.6
                }}
              >
                <Popup className="rounded-lg">
                  <div className="p-1">
                    <div className="font-bold text-slate-800 mb-1">{complaint.category}</div>
                    <div className="text-xs text-slate-600 mb-2">{complaint.text}</div>
                    <div className="text-xs font-semibold text-brand-600">AI Priority Score: {complaint.aiPriority}</div>
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

export default MapHotspots;
