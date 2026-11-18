import React from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { AlertTriangle, CheckCircle2, ChevronRight, MapPin } from 'lucide-react';

export const ActiveEmergencyBanner = () => {
  const { activeEmergency, setShowDispatchModal, markAsSafe } = useEmergency();

  if (!activeEmergency) return null;

  return (
    <div className="bg-red-600 text-white shadow-lg sticky top-0 z-40 border-b-2 border-red-700 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        <div className="flex items-center gap-3">
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
          </span>
          <div className="flex items-center gap-2">
            <span className="font-black text-sm uppercase tracking-wider bg-black/30 px-2.5 py-0.5 rounded">
              EMERGENCY ACTIVE
            </span>
            <span className="text-xs text-red-100 hidden md:inline">
              SOS triggered via {activeEmergency.triggerType || 'Manual SOS'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowDispatchModal(true)}
            className="px-3 py-1 text-xs font-semibold rounded-lg bg-red-700 hover:bg-red-800 transition-colors flex items-center gap-1"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Tracking & Contacts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => markAsSafe('Resolved from top banner')}
            className="px-3.5 py-1 text-xs font-bold rounded-lg bg-white text-red-700 hover:bg-red-50 shadow transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Mark as Safe
          </button>
        </div>

      </div>
    </div>
  );
};
