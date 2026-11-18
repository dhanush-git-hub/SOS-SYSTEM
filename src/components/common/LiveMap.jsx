import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ExternalLink, MapPin, RefreshCw, Radio, AlertCircle } from 'lucide-react';

// Custom SVG Pulse Marker for real Leaflet rendering
const createCustomIcon = (isEmergency = false) => {
  const color = isEmergency ? '#DC2626' : '#2563EB';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
      <circle cx="12" cy="10" r="3" fill="#ffffff"/>
    </svg>
  `;
  return L.divIcon({
    html: `<div class="transform -translate-x-1/2 -translate-y-full">${svg}</div>`,
    className: 'custom-leaflet-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36]
  });
};

// Helper component to center map smoothly when coordinates update
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export const LiveMap = ({ 
  location, 
  isLoading = false, 
  isLiveTracking = false, 
  isEmergency = false, 
  onRefresh, 
  onToggleLive, 
  height = 'h-96' 
}) => {
  const lat = location?.latitude || 12.9716;
  const lng = location?.longitude || 77.5946;
  const hasCoordinates = Boolean(location?.latitude && location?.longitude);
  const accuracy = location?.accuracy || 15;
  const googleMapsUrl = location?.googleMapsUrl || `https://maps.google.com/?q=${lat},${lng}`;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex flex-col">
      
      {/* Top Map Toolbar */}
      <div className="bg-white/95 backdrop-blur-sm px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isLiveTracking ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}></div>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Radio className={`w-4 h-4 ${isLiveTracking ? 'text-emerald-600' : 'text-slate-500'}`} />
            {isLiveTracking ? 'Live GPS Stream Active' : 'Static Snapshot'}
          </span>
          {location?.timestamp && (
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              • Updated: {new Date(location.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onToggleLive && (
            <button
              onClick={onToggleLive}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isLiveTracking 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              {isLiveTracking ? 'Stop Sharing' : 'Start Live Stream'}
            </button>
          )}

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Refresh GPS Coordinates"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          )}

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Google Maps</span>
          </a>
        </div>
      </div>

      {/* Map Content */}
      <div className={`relative w-full ${height} z-10`}>
        {hasCoordinates ? (
          <MapContainer
            center={[lat, lng]}
            zoom={16}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            <ChangeView center={[lat, lng]} zoom={16} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Accuracy radius ring */}
            <Circle
              center={[lat, lng]}
              radius={accuracy}
              pathOptions={{
                color: isEmergency ? '#DC2626' : '#2563EB',
                fillColor: isEmergency ? '#EF4444' : '#3B82F6',
                fillOpacity: 0.15,
                weight: 1.5
              }}
            />
            <Marker position={[lat, lng]} icon={createCustomIcon(isEmergency)}>
              <Popup>
                <div className="p-1 text-slate-800 text-xs">
                  <strong className="block font-bold text-sm mb-1">
                    {isEmergency ? '🚨 Emergency Location' : '📍 Current Position'}
                  </strong>
                  <div>Lat: {lat.toFixed(6)}</div>
                  <div>Lng: {lng.toFixed(6)}</div>
                  <div>Accuracy: ±{Math.round(accuracy)}m</div>
                  <div className="mt-1 text-slate-600">{location.address || ''}</div>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          /* Graceful GPS Pending / Denied fallback state */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-1">Awaiting Location Authorization</h4>
            <p className="text-xs text-slate-600 max-w-sm mb-4">
              Please click "Allow" when prompted by your browser to view your live GPS position on the interactive map.
            </p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs shadow-md hover:bg-slate-800 transition-colors"
              >
                Request GPS Access
              </button>
            )}
          </div>
        )}

        {/* Live Coordinate Overlay Pill */}
        {hasCoordinates && (
          <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-0.5 max-w-md">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <span className="font-mono font-bold text-slate-100">
                {lat.toFixed(6)}, {lng.toFixed(6)}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                ±{Math.round(accuracy)}m
              </span>
            </div>
            {location.address && (
              <p className="text-[11px] text-slate-300 truncate pl-5">
                {location.address}
              </p>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
