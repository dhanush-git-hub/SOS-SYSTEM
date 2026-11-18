import React from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { AlertOctagon, ShieldAlert, X, Zap } from 'lucide-react';

export const SosModal = () => {
  const { 
    isCountingDown, 
    countdownSeconds, 
    countdownTriggerType, 
    cancelSosCountdown, 
    triggerInstantSos 
  } = useEmergency();

  if (!isCountingDown) return null;

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (countdownSeconds / 5) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-red-500 overflow-hidden text-center p-6 sm:p-8">
        
        {/* Animated background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 animate-bounce">
            <AlertOctagon className="w-9 h-9" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
          EMERGENCY SOS TRIGGERED
        </h2>
        <p className="text-sm font-medium text-red-600 uppercase tracking-wider mb-6">
          Reason: {countdownTriggerType}
        </p>

        {/* Circular Countdown Progress */}
        <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#FEE2E2"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#DC2626"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-red-600 font-mono">
              {countdownSeconds}
            </span>
            <span className="text-xs uppercase font-semibold text-slate-500">Seconds</span>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200">
          Capturing live GPS coordinates and broadcasting alert with Google Maps location to your trusted emergency contacts.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => cancelSosCountdown('Cancelled by user')}
            className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5 text-red-400" />
            CANCEL ALERT (I'M SAFE)
          </button>

          <button
            onClick={() => triggerInstantSos('Immediate Distress')}
            className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs tracking-wide uppercase transition-all flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            Don't Wait – Dispatch Alert Immediately
          </button>
        </div>

      </div>
    </div>
  );
};
