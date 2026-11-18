import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { useLocation } from '../../context/LocationContext';
import { 
  AlertTriangle, 
  MapPin, 
  ExternalLink, 
  Phone, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Share2, 
  Users,
  X
} from 'lucide-react';

export const SimulatedDispatchModal = () => {
  const { 
    showDispatchModal, 
    setShowDispatchModal, 
    activeEmergency, 
    lastDispatchedEmergency, 
    markAsSafe 
  } = useEmergency();
  
  const emergency = activeEmergency || lastDispatchedEmergency;
  const [copied, setCopied] = useState(false);
  const [safeNote, setSafeNote] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  if (!showDispatchModal || !emergency) return null;

  const shareUrl = `${window.location.origin}/#/track/${emergency.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResolve = async () => {
    setIsResolving(true);
    await markAsSafe(safeNote || 'All clear - user marked themselves safe.');
    setIsResolving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/20 uppercase tracking-wider font-semibold">
                  STATUS: ACTIVE
                </span>
                <span className="text-xs bg-black/25 px-2 py-0.5 rounded text-amber-200">
                  DEMO MODE SIMULATION
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">Emergency Protocol Dispatched</h2>
            </div>
          </div>
          <button 
            onClick={() => setShowDispatchModal(false)}
            className="p-2 rounded-xl hover:bg-white/20 transition-colors text-white/80 hover:text-white"
            title="Minimize"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Demo Mode Notice Box */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <span className="text-amber-600 text-lg">⚠️</span>
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong>Demo Mode Transparency:</strong> Real GPS coordinates and Google Maps links are generated. Live external carrier SMS dispatch is simulated for hackathon presentation to prevent unpaid telecommunication carrier charges.
            </div>
          </div>

          {/* Location Captured */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-600" />
                Live GPS Coordinates Captured
              </span>
              <span className="text-xs font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                ±{Math.round(emergency.location?.accuracy || 10)}m accuracy
              </span>
            </div>
            <div className="font-mono text-base font-bold text-slate-800">
              {emergency.location?.latitude?.toFixed(6) || '12.971600'}° N, {emergency.location?.longitude?.toFixed(6) || '77.594600'}° E
            </div>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
              {emergency.location?.address || 'Near Campus Central Zone'}
            </p>
            
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={emergency.googleMapsUrl || `https://maps.google.com/?q=${emergency.location?.latitude},${emergency.location?.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open in Google Maps
              </a>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                {copied ? 'Link Copied!' : 'Copy Emergency Tracking Link'}
              </button>
            </div>
          </div>

          {/* Contacts Simulated Dispatch */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-navy-600" />
                Alerted Trusted Contacts ({emergency.notifiedContacts?.length || 0})
              </h3>
            </div>
            <div className="space-y-2">
              {emergency.notifiedContacts?.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div>
                    <div className="font-semibold text-sm text-slate-900">{c.name}</div>
                    <div className="text-xs text-slate-500 font-mono">{c.phone}</div>
                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-1">
                      ✓ Simulated Dispatch Sent
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${c.phone?.replace(/[^0-9+]/g, '')}`}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                      title="Direct Call"
                    >
                      <Phone className="w-4 h-4 text-emerald-600" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Hotline Actions */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href="tel:112"
              className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-center transition-colors flex flex-col items-center justify-center gap-1"
            >
              <Phone className="w-5 h-5 text-red-400" />
              <span className="text-xs font-bold">Call Emergency (112 / 911)</span>
            </a>
            <button
              onClick={() => {
                const primary = emergency.notifiedContacts?.[0];
                if (primary?.phone) {
                  window.location.href = `tel:${primary.phone.replace(/[^0-9+]/g, '')}`;
                }
              }}
              className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-center transition-colors flex flex-col items-center justify-center gap-1"
            >
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold">Call Primary Contact</span>
            </button>
          </div>

          {/* Resolution Section */}
          <div className="pt-4 border-t border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Safety Resolution Note (Optional)
            </label>
            <input
              type="text"
              value={safeNote}
              onChange={(e) => setSafeNote(e.target.value)}
              placeholder="e.g. Arrived safely at security kiosk / False alarm."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-3"
            />
            <button
              onClick={handleResolve}
              disabled={isResolving}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-98"
            >
              <CheckCircle2 className="w-5 h-5" />
              {isResolving ? 'Resolving Alert...' : "I'M SAFE – RESOLVE EMERGENCY"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
