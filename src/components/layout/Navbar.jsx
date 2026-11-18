import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { useEmergency } from '../../context/EmergencyContext';
import { 
  Shield, 
  MapPin, 
  AlertTriangle, 
  LogOut, 
  User, 
  Menu, 
  X, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const Navbar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, logout, isDemoMode } = useAuth();
  const { location, permissionStatus } = useLocation();
  const { activeEmergency } = useEmergency();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-navy-950 text-white border-b border-navy-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-navy-400 hover:text-white hover:bg-navy-900 md:hidden transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">SAFEZONE</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600/30 text-red-400 px-1.5 py-0.2 rounded border border-red-500/30">
                  SOS
                </span>
              </div>
              <span className="text-[10px] text-navy-400 font-medium block -mt-1">
                CEC-HACKSTORM-2026
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Badges & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* GPS Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-900 border border-navy-800 text-xs">
            <MapPin className={`w-3.5 h-3.5 ${permissionStatus === 'granted' ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="text-navy-300 font-medium">GPS:</span>
            <span className={`font-semibold capitalize ${permissionStatus === 'granted' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {permissionStatus === 'granted' ? 'Acquired' : permissionStatus}
            </span>
          </div>

          {/* Demo Mode Badge */}
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-navy-900 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>DEMO MODE</span>
          </div>

          {/* User profile dropdown or quick display */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-navy-800">
              <Link 
                to="/profile" 
                className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-navy-900 transition-colors"
                title="View Profile"
              >
                <div className="w-8 h-8 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-white leading-tight">{user.name}</div>
                  <div className="text-[10px] text-navy-400">{user.email}</div>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-navy-400 hover:text-red-400 hover:bg-navy-900 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Sign In
            </Link>
          )}

        </div>

      </div>
    </header>
  );
};
