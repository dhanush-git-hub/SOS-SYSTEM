import React, { useState, useEffect, useRef } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { soundService } from '../services/soundService';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Flame, 
  Volume2 
} from 'lucide-react';

export const SafeTimerPage = () => {
  const { startSosCountdown, activeEmergency } = useEmergency();

  const PRESETS = [5, 10, 15, 30, 60]; // minutes

  const [selectedDuration, setSelectedDuration] = useState(15); // in minutes
  const [timeLeft, setTimeLeft] = useState(15 * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const [warningActive, setWarningActive] = useState(false);

  const timerRef = useRef(null);

  // Formatting seconds into MM:SS or HH:MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Choose preset duration
  const handleSelectPreset = (mins) => {
    if (isRunning) return;
    setSelectedDuration(mins);
    setTimeLeft(mins * 60);
    setTimerExpired(false);
    setWarningActive(false);
  };

  // Start timer
  const handleStart = () => {
    setIsRunning(true);
    setTimerExpired(false);
  };

  // Pause timer
  const handlePause = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Reset timer
  const handleReset = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(selectedDuration * 60);
    setTimerExpired(false);
    setWarningActive(false);
  };

  // Cancel using "I'm Safe"
  const handleImSafe = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(selectedDuration * 60);
    setTimerExpired(false);
    setWarningActive(false);
    soundService.playSafeChime();
    alert("Check-in confirmed! Safe Timer disarmed successfully. Glad you're safe!");
  };

  // Countdown loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setTimerExpired(true);
            setWarningActive(false);
            
            // Safe Timer Expired -> Trigger SOS Workflow automatically!
            soundService.playEmergencyAlarm();
            startSosCountdown('Safe Timer Expiry (No check-in)');
            return 0;
          }

          // Warning when timer is nearly finished (< 30 seconds)
          if (prev <= 30) {
            setWarningActive(true);
            soundService.playCountdownBeep(prev % 5);
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, startSosCountdown]);

  // Calculate percentage progress
  const totalSeconds = selectedDuration * 60;
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Timer className="w-6 h-6 text-red-600" />
          Proactive Safe Timer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Set a safety countdown for solo walks, rideshares, or late library departures. If you don't check in before it finishes, SOS triggers automatically.
        </p>
      </div>

      {/* Main Timer Display Card */}
      <div className={`rounded-3xl p-8 sm:p-12 border transition-all text-center relative overflow-hidden shadow-sm ${
        warningActive 
          ? 'bg-red-50 border-red-300' 
          : 'bg-white border-slate-200'
      }`}>
        
        {/* Warning Banner if nearly finished */}
        {warningActive && (
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white font-bold text-xs uppercase tracking-wider animate-bounce">
            <AlertTriangle className="w-4 h-4" />
            Warning: Timer nearly expired! Tap "I'm Safe" to cancel SOS.
          </div>
        )}

        {/* Large Countdown Digital Clock */}
        <div className="my-6">
          <div className={`text-6xl sm:text-8xl font-black font-mono tracking-tight ${
            warningActive ? 'text-red-600 animate-pulse' : 'text-slate-900'
          }`}>
            {formatTime(timeLeft)}
          </div>
          <span className="text-xs uppercase font-bold text-slate-400 tracking-widest mt-2 block">
            {isRunning ? 'Safety Monitoring Active' : 'Timer Ready to Arm'}
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full max-w-md mx-auto h-3 bg-slate-100 rounded-full overflow-hidden mb-8 border border-slate-200">
          <div
            className={`h-full transition-all duration-1000 ${
              warningActive ? 'bg-red-600' : 'bg-gradient-to-r from-navy-800 to-red-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Primary Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-8">
          {isRunning ? (
            <>
              <button
                onClick={handleImSafe}
                className="w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>I'M SAFE (DISARM)</span>
              </button>

              <button
                onClick={handlePause}
                className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleStart}
                className="w-full sm:w-auto flex-1 py-4 px-8 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>ARM SAFE TIMER</span>
              </button>

              {timeLeft !== selectedDuration * 60 && (
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              )}
            </>
          )}
        </div>

        {/* Preset Selectors */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Choose Walk / Commute Duration
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-lg mx-auto">
            {PRESETS.map((mins) => (
              <button
                key={mins}
                onClick={() => handleSelectPreset(mins)}
                disabled={isRunning}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                  selectedDuration === mins
                    ? 'bg-navy-950 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {mins} Minutes
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Safety Instructions Card */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-red-600/30 text-red-400 flex items-center justify-center flex-shrink-0 mt-1">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="text-xs leading-relaxed">
            <h4 className="text-sm font-bold text-white mb-1">How Automated Safe Timer Operates</h4>
            <p className="text-slate-300">
              When the timer reaches zero, SAFEZONE assumes you are unable to access your phone and triggers the complete emergency SOS protocol, locking your current GPS position and notifying all trusted contacts.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
