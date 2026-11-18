import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';
import { useLocation } from '../context/LocationContext';
import { useContacts } from '../context/ContactsContext';
import { storage } from '../services/storage';
import { SosButton } from '../components/common/SosButton';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  Shield, 
  MapPin, 
  Users, 
  Timer, 
  History, 
  Phone, 
  ExternalLink, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Info
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { activeEmergency, setShowDispatchModal, startSosCountdown } = useEmergency();
  const { location, permissionStatus, isSharingLocation, toggleLiveSharing, fetchLocation, isLoading: locationLoading } = useLocation();
  const { contacts, primaryContact } = useContacts();

  // Load recent emergency history
  const emergencyHistory = storage.getEmergencyHistory().slice(0, 3);

  return (
    <div className="space-y-6">
      
      {/* Personalized Welcome & Safety Header */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-navy-800 shadow-xl relative overflow-hidden">
        
        {/* Subtle decorative background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-500/30">
                SAFEZONE PROTECTED
              </span>
              <span className="text-xs text-slate-400">
                CEC-HACKSTORM-2026
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Alex Morgan'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              System standing by. Press SOS anytime to immediately broadcast your live GPS coordinates to trusted contacts.
            </p>
          </div>

          {/* Quick Status Pill Box */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="bg-navy-950/70 border border-navy-700/80 rounded-2xl px-4 py-2.5 flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${permissionStatus === 'granted' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">GPS Permission</div>
                <div className="text-xs font-bold text-white capitalize">{permissionStatus === 'granted' ? 'Online & Locked' : permissionStatus}</div>
              </div>
            </div>

            <div className="bg-navy-950/70 border border-navy-700/80 rounded-2xl px-4 py-2.5 flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${activeEmergency ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Safety Status</div>
                <div className="text-xs font-bold text-white">
                  {activeEmergency ? 'EMERGENCY ACTIVE' : 'Status Safe'}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Hero SOS Section – Prominent and Most Noticeable Element */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center relative overflow-hidden flex flex-col items-center justify-center">
        
        {/* Subtle background radar circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div className="w-[300px] h-[300px] border border-red-200 rounded-full animate-ping-slow"></div>
          <div className="w-[450px] h-[450px] border border-red-100 rounded-full"></div>
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center">
          
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            Highest Priority Emergency Action
          </div>

          {/* SOS Prominent Button Component */}
          <SosButton size="lg" subtitle={true} />

          {/* Location status summary under SOS */}
          <div className="mt-8 w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-700">
                  {location ? (
                    <span>GPS: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}</span>
                  ) : (
                    <span>GPS Location Ready to Acquire</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 truncate max-w-xs">
                  {location?.address || 'Click below to stream live location or view interactive map'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleLiveSharing}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSharingLocation
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${isSharingLocation ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
                <span>{isSharingLocation ? 'Sharing Active' : 'Share GPS'}</span>
              </button>
              <Link
                to="/location"
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <span>Full Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* Grid of Key Features: Safe Timer, Trusted Contacts, Emergency History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Safe Timer Quick Action */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Timer className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Safe Timer</h3>
              </div>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full uppercase">
                Proactive Safety
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Starting a solo walk or commute? Set a countdown timer. If you don't check in before it reaches zero, SAFEZONE triggers the SOS protocol automatically.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {['5m', '15m', '30m'].map((time) => (
                <Link
                  key={time}
                  to="/timer"
                  className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-center font-bold text-xs text-slate-700 transition-colors"
                >
                  {time} Walk
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/timer"
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Open Safe Timer</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card 2: Trusted Contacts Preview */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Emergency Contacts</h3>
              </div>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full uppercase">
                {contacts.length} Active
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {contacts.slice(0, 2).map((contact) => (
                <div key={contact.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="truncate mr-2">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{contact.name}</span>
                      {contact.isPrimary && (
                        <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold uppercase">Primary</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">{contact.phone}</div>
                  </div>
                  <a
                    href={`tel:${contact.phone?.replace(/[^0-9+]/g, '')}`}
                    className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                    title="Direct Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/contacts"
            className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Manage All Contacts</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card 3: Recent Emergency History */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <History className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Recent Activity</h3>
              </div>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full uppercase">
                Audit Trail
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {emergencyHistory.length > 0 ? (
                emergencyHistory.map((rec) => (
                  <div key={rec.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">{rec.triggerType || 'Manual SOS'}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(rec.timestamp).toLocaleDateString()} at {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <StatusBadge status={rec.status} size="sm" />
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-400">
                  No previous emergency logs recorded.
                </div>
              )}
            </div>
          </div>

          <Link
            to="/history"
            className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Full History</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </div>
  );
};
