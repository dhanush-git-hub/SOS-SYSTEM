import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  MapPin, 
  Users, 
  Timer, 
  Radio, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Smartphone, 
  Lock, 
  Zap, 
  Bell, 
  PhoneCall 
} from 'lucide-react';
import { Footer } from '../components/layout/Footer';

export const LandingPage = () => {
  const { user, loginAsDemo } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-red-500 selection:text-white flex flex-col">
      
      {/* Top Navbar */}
      <nav className="border-b border-slate-800/80 bg-navy-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
              <Shield className="w-6 h-6 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-white">SAFEZONE</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600/30 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                  SOS PLATFORM
                </span>
              </div>
              <span className="text-xs text-slate-400">CEC-HACKSTORM-2026</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/25 transition-all flex items-center gap-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-semibold transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/25 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 flex-1">
        
        {/* Background glow graphics */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-red-400 text-xs font-bold tracking-wide uppercase mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            Real-Time Emergency Response & GPS Dispatch
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Your Safety. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-300 bg-clip-text text-transparent">
              One Tap Away.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            SAFEZONE connects you instantly to trusted emergency contacts, broadcasts high-precision live GPS coordinates, and arms you with a proactive Safe Timer for solo commutes and campus security.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-base shadow-xl shadow-red-600/30 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 text-amber-300" />
              <span>Launch Live App</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/login"
              onClick={() => loginAsDemo()}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Instant Demo (Judges)</span>
            </Link>
          </div>

          {/* Trust stats pill */}
          <div className="mt-12 pt-8 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">5s</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Cancel Window</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">±5m</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">GPS Accuracy</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">100%</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Zero Cost Demo</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">1-Tap</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Emergency Dispatch</div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">Protocol Workflow</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">How SAFEZONE Works</p>
            <p className="text-slate-400 text-sm mt-3">From one touch to instant dispatch in less than 5 seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl relative hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center font-black text-lg mb-6">
                01
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tap The SOS Button</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                A 5-second countdown with sound ticks begins immediately. You can cancel instantly if pressed accidentally.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl relative hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-lg mb-6">
                02
              </div>
              <h3 className="text-xl font-bold text-white mb-2">GPS Coordinates Locked</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Browser Geolocation captures high-accuracy latitude, longitude, and automatically creates an interactive Google Maps location URL.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl relative hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-black text-lg mb-6">
                03
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Contacts Alerted</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Emergency tracking links are dispatched to your trusted contacts, with one-touch phone dialers and safety resolution confirmation.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">Core Capabilities</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Engineered For Critical Situations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base mb-1">Prominent One-Tap SOS</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Visual pulsating emergency trigger with an audible 5-second countdown to avoid accidental activation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base mb-1">Live GPS Stream & Map</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Interactive real-time map with continuous tracking, accuracy radius, and direct Google Maps navigation link.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-4">
                <Timer className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base mb-1">Automated Safe Timer</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Countdown safety timer for late walks or commutes. Automatically triggers SOS if not disarmed with "I'm Safe".
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base mb-1">Trusted Contacts Hierarchy</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Manage primary contacts, priority order, and direct one-click phone dialers and simulated SMS broadcasts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base mb-1">Public Shareable Tracking</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Generates a secure public tracking link that responders and family can open without needing to install an app.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base mb-1">Zero-Cost Demo Mode</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Full functionality works completely offline with LocalStorage and mock simulation, or connects to Firebase.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Why SAFEZONE Section */}
      <section className="py-20 bg-navy-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-navy-900 to-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">Why SAFEZONE?</span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 leading-tight">
                Built specifically for rapid, fail-safe personal protection.
              </h3>
              <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
                Unlike complex apps that require navigating menus in moments of panic, SAFEZONE operates on high-contrast, high-priority emergency architecture. Developed for the CEC-HACKSTORM-2026 hackathon.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> No paid subscription
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Never fakes GPS data
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> 5-second cancel safeguard
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Link
                to="/register"
                className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-center text-sm shadow-xl transition-all"
              >
                Create Free Account
              </Link>
              <Link
                to="/dashboard"
                className="px-8 py-4 rounded-2xl bg-white text-navy-950 hover:bg-slate-100 font-bold text-center text-sm shadow-xl transition-all"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
};
