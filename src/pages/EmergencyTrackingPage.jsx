import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { emergencyService } from '../services/emergencyService';
import { LiveMap } from '../components/common/LiveMap';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  ShieldAlert, 
  MapPin, 
  ExternalLink, 
  Phone, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  ArrowLeft 
} from 'lucide-react';

export const EmergencyTrackingPage = () => {
  const { emergencyId } = useParams();
  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (emergencyId) {
      const data = emergencyService.getEmergencyById(emergencyId);
      setEmergency(data);
      setLoading(false);
    }
  }, [emergencyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wider text-slate-300">RETRIEVING EMERGENCY BEACON...</p>
      </div>
    );
  }

  if (!emergency) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-200">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Emergency Record Not Found</h2>
          <p className="text-xs text-slate-500 mb-6">
            The emergency tracking link may have expired or was disarmed by the user.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to SafeZone</span>
          </Link>
        </div>
      </div>
    );
  }

  const isEmergencyActive = emergency.status === 'Active';
  const lat = emergency.location?.latitude || 12.9716;
  const lng = emergency.location?.longitude || 77.5946;
  const googleMapsUrl = emergency.googleMapsUrl || `https://maps.google.com/?q=${lat},${lng}`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      
      {/* Top Emergency Status Header */}
      <div className={`${isEmergencyActive ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'} p-4 shadow-lg sticky top-0 z-30`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isEmergencyActive ? 'bg-white/20 animate-pulse' : 'bg-slate-800'
            }`}>
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-wider font-bold">
                  SAFEZONE BEACON
                </span>
                <StatusBadge status={emergency.status} size="sm" />
              </div>
              <h1 className="text-base sm:text-lg font-black tracking-tight">
                {isEmergencyActive ? 'Active Live Emergency Distress Feed' : 'Resolved Emergency Broadcast'}
              </h1>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors hidden sm:inline-block"
          >
            SafeZone Portal
          </Link>
        </div>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Distress Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Target Identity</div>
              <div className="text-xl font-black text-slate-900 mt-0.5">
                {emergency.userName || 'SafeZone User'}
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                Beacon Ref: {emergency.id}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Trigger Event</div>
              <div className="text-sm font-bold text-slate-800 mt-0.5">
                {emergency.triggerType || 'Manual SOS Protocol'}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 sm:justify-end">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(emergency.createdAt || emergency.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Direct Responder Hotline Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <a
              href="tel:112"
              className="py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider text-center shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call Emergency Dispatch (112 / 911)</span>
            </a>

            {emergency.userPhone && (
              <a
                href={`tel:${emergency.userPhone.replace(/[^0-9+]/g, '')}`}
                className="py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider text-center shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call {emergency.userName?.split(' ')[0] || 'User'} Directly</span>
              </a>
            )}
          </div>
        </div>

        {/* Live Map Display */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <h2 className="font-bold text-slate-900 text-base">Last Known GPS Position</h2>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Google Maps</span>
            </a>
          </div>

          <LiveMap
            location={emergency.location}
            isLoading={false}
            isLiveTracking={isEmergencyActive}
            isEmergency={isEmergencyActive}
            height="h-[380px]"
          />
        </div>

        {/* Instructions for First Responders */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white text-xs space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            First Responder & Contact Instructions
          </h3>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
            <li>Review the GPS coordinates above to determine the exact location and physical landmark.</li>
            <li>Attempt immediate telephone contact with the user via the direct call button above.</li>
            <li>If the user does not respond and distress is suspected, contact 112 / 911 or Campus Security with the GPS coordinates.</li>
          </ol>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        SAFEZONE Live Incident Tracking • CEC-HACKSTORM-2026 Emergency Platform
      </footer>

    </div>
  );
};
