import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Timer, 
  History, 
  User, 
  Settings, 
  AlertOctagon, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { startSosCountdown, activeEmergency, setShowDispatchModal } = useEmergency();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/location', label: 'Live Location', icon: MapPin },
    { to: '/contacts', label: 'Trusted Contacts', icon: Users },
    { to: '/timer', label: 'Safe Timer', icon: Timer },
    { to: '/history', label: 'Emergency History', icon: History },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleSosClick = () => {
    if (activeEmergency) {
      setShowDispatchModal(true);
    } else {
      startSosCountdown('Sidebar Quick SOS');
    }
  };

  const navLinkClasses = ({ isActive }) => `
    flex items-center gap-3 px-3.5 py-3 rounded-2xl font-medium text-sm transition-all
    ${isActive 
      ? 'bg-red-600 text-white shadow-md font-semibold' 
      : 'text-navy-300 hover:text-white hover:bg-navy-900'}
    ${collapsed ? 'justify-center px-2' : ''}
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-navy-950/70 z-30 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          bg-navy-950 border-r border-navy-900 text-white
          flex flex-col transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
          ${collapsed ? 'md:w-20' : 'md:w-64'}
        `}
      >
        {/* Navigation list */}
        <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClasses}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}

          {/* Quick SOS in sidebar */}
          <div className="pt-6">
            <button
              onClick={handleSosClick}
              className={`w-full py-3 px-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 hover:brightness-110 ${
                collapsed ? 'p-3' : ''
              }`}
              title="Trigger Emergency SOS"
            >
              <AlertOctagon className="w-5 h-5 flex-shrink-0 animate-pulse text-white" />
              {!collapsed && <span>{activeEmergency ? 'Active SOS (View)' : 'Quick SOS Alert'}</span>}
            </button>
          </div>
        </div>

        {/* Footer info & collapse toggle */}
        <div className="p-3 border-t border-navy-900">
          {!collapsed && (
            <div className="bg-navy-900/60 p-3 rounded-xl mb-3 text-[11px] text-navy-400 border border-navy-800">
              <div className="font-semibold text-navy-200">CEC-HACKSTORM-2026</div>
              <div>Safety & Tracking Protocol</div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-full items-center justify-center py-2 px-3 rounded-xl text-navy-400 hover:text-white hover:bg-navy-900 transition-colors text-xs"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : (
              <div className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Navigation</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
