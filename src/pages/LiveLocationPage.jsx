import React, { useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { useEmergency } from '../context/EmergencyContext';
import { LiveMap } from '../components/common/LiveMap';
import { 
  MapPin, 
  Radio, 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle, 
  Copy, 
  Check, 
  Compass, 
  Gauge, 
  Clock, 
  Share2 
} from 'lucide-react';

export const LiveLocationPage = () => {
  const { 
    location, 
    permissionStatus, 
    isSharingLocation, 
    isLoading, 
    error, 
    lastRefreshed, 
    fetchLocation, 
    toggleLiveSharing 
  } = useLocation();

  const { activeEmergency } = useEmergency();
  const [copied, setCopied] = useState(false);

  const googleMapsUrl = location?.googleMapsUrl || (location ? `https://maps.google.com/?q=${location.latitude},${location.longitude}` : '#');

  const handleCopyCoords = () => {
    if (!location) return;
    const text = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-red-600" />
            Live GPS Location & Geonavigation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time Browser Geolocation API streaming with interactive telemetry.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={fetchLocation}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            <span>Refresh GPS</span>
          </button>

          <button
            onClick={toggleLiveSharing}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 ${
              isSharingLocation 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-navy-950 hover:bg-navy-900 text-white'
            }`}
          >
            <Radio className={`w-4 h-4 ${isSharingLocation ? 'animate-pulse' : ''}`} />
            <span>{isSharingLocation ? 'Stop Live Broadcast' : 'Start Live Broadcast'}</span>
          </button>
        </div>
      </div>

      {/* Permission Warning if Denied */}
      {permissionStatus === 'denied' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <strong className="block font-bold text-sm mb-0.5">Location Access Denied</strong>
            Your browser is blocking GPS access. To restore real-time tracking, click the padlock/tune icon in your browser address bar and set <strong>Location</strong> to <strong>Allow</strong>, then click Refresh GPS.
          </div>
        </div>
      )}

      {/* Interactive Map Component */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
        <LiveMap
          location={location}
          isLoading={isLoading}
          isLiveTracking={isSharingLocation}
          isEmergency={Boolean(activeEmergency)}
          onRefresh={fetchLocation}
          onToggleLive={toggleLiveSharing}
          height="h-[420px]"
        />
      </div>

      {/* Detailed GPS Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Latitude & Longitude */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Coordinates</span>
            <button
              onClick={handleCopyCoords}
              disabled={!location}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              title="Copy Coordinates"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="text-lg font-black text-slate-800 font-mono">
            {location ? `${location.latitude.toFixed(5)}° N` : '--'}
          </div>
          <div className="text-xs text-slate-500 font-mono mt-0.5">
            {location ? `${location.longitude.toFixed(5)}° E` : '--'}
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">GPS Accuracy</span>
            <Gauge className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-lg font-black text-slate-800 font-mono">
            {location?.accuracy ? `±${Math.round(location.accuracy)} meters` : 'Acquiring...'}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-0.5">
            {location?.accuracy && location.accuracy < 20 ? 'High Precision Fix' : 'Standard Resolution'}
          </div>
        </div>

        {/* Speed & Heading */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Velocity / Heading</span>
            <Compass className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-lg font-black text-slate-800 font-mono">
            {location?.speed !== null && location?.speed !== undefined 
              ? `${(location.speed * 3.6).toFixed(1)} km/h` 
              : 'Stationary (0 km/h)'}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {location?.heading !== null && location?.heading !== undefined 
              ? `${Math.round(location.heading)}° Heading` 
              : 'Heading N/A'}
          </div>
        </div>

        {/* Last Timestamp */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Last Broadcast</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-base font-bold text-slate-800">
            {location?.timestamp ? new Date(location.timestamp).toLocaleTimeString() : 'Awaiting Fix'}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {isSharingLocation ? 'Auto-syncing every 5s' : 'Static Snapshot'}
          </div>
        </div>

      </div>

      {/* Reverse Geocoded Address & Google Maps Direct Link */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block mb-1">
            Current Physical Landmark
          </span>
          <p className="text-sm font-semibold text-slate-200 max-w-2xl leading-relaxed">
            {location?.address || 'Detecting landmark and nearby campus location...'}
          </p>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 flex-shrink-0"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Open in Google Maps App</span>
        </a>
      </div>

    </div>
  );
};
