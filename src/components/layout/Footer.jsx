import React from 'react';
import { Shield, PhoneCall, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-navy-950 text-navy-400 border-t border-navy-900 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white tracking-tight">SAFEZONE Platform</span>
          <span>• Developed for <strong className="text-navy-200">CEC-HACKSTORM-2026</strong></span>
        </div>

        <div className="flex items-center gap-4 text-navy-300">
          <span className="flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-red-400" />
            National Helpline: <a href="tel:112" className="text-white hover:underline font-bold">112</a> / <a href="tel:911" className="text-white hover:underline font-bold">911</a>
          </span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">Demo Mode Ready (Zero Paid APIs Required)</span>
        </div>

      </div>
    </footer>
  );
};
