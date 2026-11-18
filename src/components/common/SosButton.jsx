import React from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { ShieldAlert, AlertOctagon } from 'lucide-react';

export const SosButton = ({ size = 'lg', subtitle = true }) => {
  const { startSosCountdown, activeEmergency, setShowDispatchModal } = useEmergency();

  const handleClick = () => {
    if (activeEmergency) {
      setShowDispatchModal(true);
    } else {
      startSosCountdown('One-Tap Dashboard SOS');
    }
  };

  if (activeEmergency) {
    return (
      <div className="flex flex-col items-center">
        <button
          onClick={handleClick}
          className="relative group p-1 rounded-full focus:outline-none"
        >
          {/* Animated red wave rings */}
          <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-75"></div>
          <div className="absolute -inset-4 rounded-full bg-red-500/30 animate-pulse"></div>

          <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-br from-red-600 to-rose-700 text-white flex flex-col items-center justify-center shadow-2xl border-4 border-white transition-all transform active:scale-95 group-hover:scale-105">
            <AlertOctagon className="w-12 h-12 mb-1 animate-bounce" />
            <span className="text-2xl sm:text-3xl font-black tracking-wider">
              SOS ACTIVE
            </span>
            <span className="text-[11px] font-bold text-red-100 uppercase tracking-widest mt-1">
              Tap to View / Safe
            </span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleClick}
        className="relative group p-2 rounded-full focus:outline-none focus:ring-8 focus:ring-red-200 transition-all"
        title="Press to trigger Emergency SOS"
      >
        {/* Subtle breathing glow */}
        <div className="absolute inset-0 rounded-full bg-red-500/20 group-hover:bg-red-500/40 blur-xl transition-all"></div>
        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-red-500 to-rose-600 opacity-20 group-hover:opacity-40 animate-pulse"></div>

        {/* SOS Button Body */}
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-rose-700 text-white flex flex-col items-center justify-center shadow-2xl border-4 border-white/80 transition-all transform active:scale-95 group-hover:scale-105">
          <ShieldAlert className="w-14 h-14 sm:w-16 sm:h-16 mb-1 filter drop-shadow" />
          <span className="text-3xl sm:text-4xl font-black tracking-widest drop-shadow-md">
            SOS
          </span>
          <span className="text-[11px] sm:text-xs font-bold text-red-100 uppercase tracking-widest mt-1">
            Emergency Alert
          </span>
        </div>
      </button>

      {subtitle && (
        <p className="mt-4 text-xs sm:text-sm font-semibold text-slate-500 text-center max-w-xs">
          Press to broadcast your live GPS location to all trusted emergency contacts with a 5s cancel window.
        </p>
      )}
    </div>
  );
};
