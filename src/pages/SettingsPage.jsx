import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { storage } from '../services/storage';
import { 
  Settings, 
  MapPin, 
  Bell, 
  Sparkles, 
  Volume2, 
  Smartphone, 
  RotateCcw, 
  LogOut, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';

export const SettingsPage = () => {
  const { user, logout, isDemoMode } = useAuth();
  const { permissionStatus, fetchLocation } = useLocation();

  const [settings, setSettings] = useState(() => storage.getSettings());
  const [successMsg, setSuccessMsg] = useState('');

  const handleToggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    storage.saveSettings(updated);
    setSuccessMsg('Preference saved.');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo contacts, emergency history, and restore default state?')) {
      storage.resetDemoData();
      setSuccessMsg('Demo data reset to factory initial state.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-red-600" />
          System Preferences & Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize GPS telemetry accuracy, audible sirens, simulated carrier dispatch, and demo settings.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* GPS Status Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">GPS Location Permissions</h3>
              <p className="text-xs text-slate-500">Browser Geolocation Hardware Interface</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
            permissionStatus === 'granted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            Status: {permissionStatus}
          </span>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          SAFEZONE captures high-accuracy GPS coordinates through the native browser API during SOS events without relying on paid third-party geocoding providers.
        </p>

        <button
          onClick={fetchLocation}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
        >
          Re-test Location Hardware
        </button>
      </div>

      {/* Toggles Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm divide-y divide-slate-100">
        
        {/* Toggle 1: Audible Sirens */}
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Volume2 className="w-5 h-5 text-slate-500 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-slate-900">Audible Siren & Countdown Beeps</div>
              <div className="text-xs text-slate-500">
                Play synthesized Web Audio countdown ticks and emergency sirens during SOS.
              </div>
            </div>
          </div>
          <button
            onClick={() => handleToggle('soundAlerts')}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              settings.soundAlerts ? 'bg-red-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                settings.soundAlerts ? 'left-6.5 translate-x-1' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Toggle 2: High Accuracy GPS */}
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-slate-500 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-slate-900">High-Accuracy GPS (Power Assisted)</div>
              <div className="text-xs text-slate-500">
                Engage device GNSS/GPS chipset for sub-10 meter emergency location resolution.
              </div>
            </div>
          </div>
          <button
            onClick={() => handleToggle('highAccuracyGps')}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              settings.highAccuracyGps ? 'bg-red-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                settings.highAccuracyGps ? 'left-6.5 translate-x-1' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Toggle 3: Simulated SMS Delivery in Demo Mode */}
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-slate-500 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-slate-900">Simulated SMS Delivery Cards</div>
              <div className="text-xs text-slate-500">
                Display honest demonstration dispatches without charging live cellular carriers.
              </div>
            </div>
          </div>
          <button
            onClick={() => handleToggle('simulatedSmsDelivery')}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              settings.simulatedSmsDelivery ? 'bg-red-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                settings.simulatedSmsDelivery ? 'left-6.5 translate-x-1' : 'left-0.5'
              }`}
            />
          </button>
        </div>

      </div>

      {/* Demo Mode & Hackathon Info Card */}
      <div className="bg-gradient-to-r from-navy-950 to-slate-900 rounded-3xl p-6 text-white border border-navy-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-base text-white">CEC-HACKSTORM-2026 Ready</h3>
          </div>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            All features, maps, SOS workflows, countdowns, and contact managers run without requiring paid API keys or external subscriptions.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-2 flex-shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Account Logout */}
      <div className="pt-2">
        <button
          onClick={logout}
          className="w-full py-3 px-4 rounded-2xl bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of SAFEZONE</span>
        </button>
      </div>

    </div>
  );
};
