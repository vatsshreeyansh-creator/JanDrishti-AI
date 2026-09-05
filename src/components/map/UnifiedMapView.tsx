import React, { useEffect, useRef, useState, useId } from 'react';
import { MapContainer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ShieldAlert, ExternalLink, Loader2 } from 'lucide-react';
import { getActiveMapProvider, getMapApiKey, getMapplsSdkUrl } from '../../config/mapConfig';
import { AppMapTileLayer } from './AppMapTileLayer';

export interface UnifiedMapMarker {
  id: string | number;
  lat: number;
  lng: number;
  category?: string;
  title?: string;
  description?: string;
  status?: string;
  priorityScore?: number;
  citizensAffected?: number;
  reportCount?: number;
  actionUrl?: string;
  actionText?: string;
  markerColor?: string;
  fillColor?: string;
  radius?: number;
}

export interface UnifiedMapViewProps {
  center: [number, number];
  zoom: number;
  className?: string;
  markers?: UnifiedMapMarker[];
  scrollWheelZoom?: boolean;
}

/**
 * Sub-component for rendering MapmyIndia using the official Mappls Web Maps JS SDK v3.0.
 * Strictly adheres to provider transparency: if Mappls authentication fails (e.g. 401 domain whitelist error),
 * the actual error is rendered in place. No automatic fallback to Carto or OSM is performed.
 */
const MapplsMapView: React.FC<UnifiedMapViewProps> = ({
  center,
  zoom,
  className = 'w-full h-full',
  markers = [],
  scrollWheelZoom = true,
}) => {
  const containerId = useId().replace(/:/g, '_') + '_mappls_map';
  const mapInstanceRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [sdkReady, setSdkReady] = useState(false);
  const [errorState, setErrorState] = useState<{
    code: string;
    message: string;
    details: string;
  } | null>(null);

  const apiKey = getMapApiKey();
  const centerLat = center[0];
  const centerLng = center[1];

  // Effect 1: Validate and Load SDK (depends strictly on apiKey)
  useEffect(() => {
    if (!apiKey) {
      setErrorState({
        code: 'MISSING_API_KEY',
        message: 'MapmyIndia API Key is not configured',
        details: 'Please add VITE_MAPMYINDIA_KEY=<your_static_key> to your .env.local file.',
      });
      return;
    }

    let active = true;
    const sdkUrl = getMapplsSdkUrl(apiKey);

    // If already loaded globally
    if ((window as any).mappls && (window as any).mappls.Map) {
      setSdkReady(true);
      return;
    }

    // Pre-flight check against Mappls SDK endpoint to catch exact HTTP 401/403 errors
    fetch(sdkUrl, { mode: 'cors' })
      .then(async (res) => {
        if (!active) return;

        if (!res.ok) {
          let errorData: any = null;
          try {
            errorData = await res.json();
          } catch {
            // response was not JSON
          }

          const errorCode = errorData?.error_code || `HTTP_${res.status}`;
          const errorDesc = errorData?.error_description || errorData?.error || `HTTP ${res.status}: ${res.statusText}`;

          let resolutionAdvice = 'Please verify your Mappls credentials.';
          if (errorCode === 'ASSET_ACCESS_DENIED' || errorDesc.includes('Domain validation failed')) {
            resolutionAdvice =
              `Mappls Domain/IP Validation Error. The current origin (${window.location.origin}) ` +
              `is not whitelisted for this Static Key in the Mappls Developer Console (https://auth.mappls.com/console). ` +
              `Add "${window.location.origin}" to your Key's Domain Whitelist, or whitelist your IP address.`;
          } else if (errorCode === 'CLIENT_CREDENTIAL_EXPIRED') {
            resolutionAdvice = 'The supplied Mappls credential has expired or does not exist in Mappls Console.';
          }

          setErrorState({
            code: errorCode,
            message: `MapmyIndia API Access Denied: ${errorDesc}`,
            details: resolutionAdvice,
          });
          return;
        }

        // Endpoint accepted key; inject script
        const existingScript = document.querySelector(`script[src*="sdk.mappls.com"]`) as HTMLScriptElement;
        if (existingScript) {
          existingScript.addEventListener('load', () => {
            if (active) setSdkReady(true);
          });
          return;
        }

        const script = document.createElement('script');
        script.src = sdkUrl;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (active) setSdkReady(true);
        };
        script.onerror = () => {
          if (!active) return;
          setErrorState({
            code: 'SCRIPT_LOAD_ERROR',
            message: 'Mappls Web Maps JS script failed to load',
            details: 'The browser failed to load the Mappls Web Maps JavaScript SDK.',
          });
        };
        document.head.appendChild(script);
      })
      .catch((err) => {
        if (!active) return;
        setErrorState({
          code: 'NETWORK_ERROR',
          message: 'Failed to reach MapmyIndia (Mappls) servers',
          details: `Connection error: ${err.message || err}. Check network connectivity.`,
        });
      });

    return () => {
      active = false;
    };
  }, [apiKey]);

  // Effect 2: Initialize Map and Mount Markers once SDK is ready
  useEffect(() => {
    if (!sdkReady || !(window as any).mappls || !(window as any).mappls.Map) return;

    try {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      const map = new (window as any).mappls.Map(containerId, {
        center: { lat: centerLat, lng: centerLng },
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: scrollWheelZoom,
      });

      mapInstanceRef.current = map;

      markers.forEach((marker) => {
        const markerColor = marker.markerColor || (marker.status === 'Resolved' ? '#4a7c59' : '#c85a32');
        const fillColor = marker.fillColor || markerColor;
        const diameter = (marker.radius || 8) * 2;

        const pinHtml = `
          <div style="
            width: ${diameter}px;
            height: ${diameter}px;
            border-radius: 50%;
            background: ${fillColor};
            border: 2px solid ${markerColor};
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            cursor: pointer;
          "></div>
        `;

        const popupHtml = `
          <div style="padding: 8px; font-family: system-ui, -apple-system, sans-serif; min-width: 200px; color: #1d2620;">
            ${marker.category ? `<div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #c85a32; letter-spacing: 0.05em;">${marker.category} ${marker.id ? '#' + marker.id : ''}</div>` : ''}
            ${marker.title ? `<div style="font-size: 14px; font-weight: bold; margin-top: 2px; color: #111827;">${marker.title}</div>` : ''}
            ${marker.description ? `<div style="font-size: 12px; margin-top: 4px; color: #4b5563; font-style: italic;">"${marker.description}"</div>` : ''}
            ${marker.priorityScore !== undefined ? `<div style="font-size: 12px; font-weight: bold; color: #f59e0b; margin-top: 6px;">Priority Score: ${marker.priorityScore}/100</div>` : ''}
            ${marker.citizensAffected !== undefined ? `<div style="font-size: 11px; color: #6b7280; margin-top: 2px;">Affected Citizens: ${marker.citizensAffected.toLocaleString()}</div>` : ''}
            ${marker.reportCount !== undefined ? `<div style="font-size: 11px; color: #6b7280;">Grievance Pings: ${marker.reportCount}</div>` : ''}
            ${marker.status ? `<div style="font-size: 11px; font-weight: bold; color: ${marker.status === 'Resolved' ? '#16a34a' : '#c85a32'}; margin-top: 6px;">Status: ${marker.status}</div>` : ''}
            ${marker.actionUrl ? `<a href="${marker.actionUrl}" style="display: block; margin-top: 8px; text-align: center; background: #5da673; color: #00381a; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: bold; text-decoration: none;">${marker.actionText || 'VIEW DETAILS →'}</a>` : ''}
          </div>
        `;

        new (window as any).mappls.Marker({
          map: map,
          position: { lat: marker.lat, lng: marker.lng },
          html: pinHtml,
          popupHtml: popupHtml,
        });
      });
    } catch (err: any) {
      setErrorState({
        code: 'INITIALIZATION_ERROR',
        message: 'Failed to initialize Mappls Map',
        details: err.message || String(err),
      });
    }

    return () => {
      if (mapInstanceRef.current && typeof mapInstanceRef.current.remove === 'function') {
        try {
          mapInstanceRef.current.remove();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [sdkReady, centerLat, centerLng, zoom, scrollWheelZoom]);

  // Error State: Display explicit MapmyIndia error with zero silent fallback
  if (errorState) {
    return (
      <div className={`relative flex flex-col items-center justify-center p-6 text-center bg-[#151d19] border border-red-500/30 rounded-xl ${className}`}>
        <div className="max-w-md space-y-3 bg-[#0d1411]/90 backdrop-blur-md p-6 rounded-2xl border border-red-500/40 shadow-2xl">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 mb-1">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="inline-block px-2.5 py-1 rounded bg-red-500/20 text-red-300 font-mono text-[11px] font-bold tracking-wide uppercase">
            Provider Error: MapmyIndia (Mappls)
          </div>

          <h3 className="text-base font-bold text-white tracking-tight">
            {errorState.message}
          </h3>

          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            {errorState.details}
          </p>

          <div className="pt-2 text-left bg-black/40 p-3 rounded-lg border border-white/5 space-y-1 font-mono text-[11px] text-gray-400">
            <div><span className="text-gray-500">Error Code:</span> <span className="text-amber-400">{errorState.code}</span></div>
            <div><span className="text-gray-500">Provider:</span> <span className="text-emerald-400">MapmyIndia Mappls Web SDK v3.0</span></div>
            <div><span className="text-gray-500">Policy:</span> <span className="text-blue-400">Zero Silent Fallback (Platform Enforcement)</span></div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <a
              href="https://auth.mappls.com/console"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5da673] hover:bg-[#4a7c59] text-[#00381a] font-mono text-xs font-bold transition-colors shadow"
            >
              Mappls Console <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!sdkReady && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#151d19]/80 backdrop-blur-sm text-[#8cd7a0] font-mono text-xs">
          <Loader2 className="w-6 h-6 animate-spin mr-2 text-[#5da673]" />
          <span>Connecting to MapmyIndia Telemetry...</span>
        </div>
      )}
      <div id={containerId} ref={containerRef} className="w-full h-full" />
    </div>
  );
};

/**
 * Sub-component for rendering standard Leaflet maps for alternative providers (OSM, CartoDB, Mapbox, Custom).
 */
const LeafletMapView: React.FC<UnifiedMapViewProps> = ({
  center,
  zoom,
  className = 'w-full h-full z-0',
  markers = [],
  scrollWheelZoom = false,
}) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={scrollWheelZoom}
      className={className}
    >
      <AppMapTileLayer />
      {markers.map((marker) => {
        const markerColor = marker.markerColor || (marker.status === 'Resolved' ? '#4a7c59' : '#c85a32');
        const fillColor = marker.fillColor || markerColor;

        return (
          <CircleMarker
            key={marker.id}
            center={[marker.lat, marker.lng]}
            radius={marker.radius || 8}
            pathOptions={{
              fillColor: fillColor,
              color: markerColor,
              weight: 2,
              fillOpacity: 0.7,
            }}
          >
            <Popup>
              <div className="p-1 min-w-[200px] font-sans">
                {marker.category && (
                  <div className="font-mono text-[10px] uppercase text-[#c85a32] dark:text-[#ffb693] font-bold mb-1">
                    {marker.category} {marker.id ? `#${marker.id}` : ''}
                  </div>
                )}
                {marker.title && (
                  <div className="font-display font-bold text-base text-gray-900 dark:text-[#e8ede9] mb-1">
                    {marker.title}
                  </div>
                )}
                {marker.description && (
                  <div className="text-xs text-gray-600 dark:text-[#9ab0a2] italic line-clamp-2 mb-2">
                    "{marker.description}"
                  </div>
                )}

                {(marker.priorityScore !== undefined || marker.citizensAffected !== undefined || marker.reportCount !== undefined) && (
                  <div className="space-y-1 mb-2 font-mono text-xs">
                    {marker.priorityScore !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-[#9ab0a2]">Priority Score:</span>
                        <span className="font-bold text-amber-500 dark:text-[#ffb693]">{marker.priorityScore}/100</span>
                      </div>
                    )}
                    {marker.citizensAffected !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-[#9ab0a2]">Affected Pop:</span>
                        <span className="font-bold text-gray-800 dark:text-[#e8ede9]">{marker.citizensAffected.toLocaleString()}</span>
                      </div>
                    )}
                    {marker.reportCount !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-[#9ab0a2]">Grievance Pings:</span>
                        <span className="font-bold text-gray-800 dark:text-[#e8ede9]">{marker.reportCount}</span>
                      </div>
                    )}
                  </div>
                )}

                {marker.status && (
                  <div className="text-[11px] font-mono font-bold text-[#4a7c59] dark:text-[#8cd7a0] pt-1">
                    Status: {marker.status}
                  </div>
                )}

                {marker.actionUrl && (
                  <a
                    href={marker.actionUrl}
                    className="block text-center w-full mt-2 bg-[#5da673] hover:bg-[#4a7c59] text-[#00381a] py-1.5 rounded-lg text-xs font-mono font-bold transition-colors"
                  >
                    {marker.actionText || 'VIEW DETAILS →'}
                  </a>
                )}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

/**
 * UnifiedMapView:
 * The single, provider-agnostic interactive map component for JanDrishti AI.
 * When VITE_MAP_PROVIDER=mapmyindia, renders the official Mappls Web Maps JS SDK.
 * When set to carto, osm, mapbox, or custom, renders the standard Leaflet map engine.
 * Never performs silent fallbacks.
 */
export const UnifiedMapView: React.FC<UnifiedMapViewProps> = (props) => {
  const activeProvider = getActiveMapProvider();

  if (activeProvider === 'mapmyindia') {
    return <MapplsMapView {...props} />;
  }

  return <LeafletMapView {...props} />;
};

export default UnifiedMapView;
