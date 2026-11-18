import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, XCircle, Info } from 'lucide-react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const normalized = (status || '').toLowerCase();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5'
  }[size] || 'text-xs px-2.5 py-1';

  if (normalized === 'active' || normalized === 'emergency') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-red-100 text-red-700 border border-red-200 animate-pulse ${sizeClasses}`}>
        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
        <AlertTriangle className="w-3.5 h-3.5" />
        ACTIVE SOS
      </span>
    );
  }

  if (normalized === 'resolved' || normalized === 'safe') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 ${sizeClasses}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        Safe / Resolved
      </span>
    );
  }

  if (normalized === 'pending') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-100 text-amber-800 border border-amber-200 ${sizeClasses}`}>
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        Pending
      </span>
    );
  }

  if (normalized === 'cancelled') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
        <XCircle className="w-3.5 h-3.5 text-slate-500" />
        Cancelled
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200 ${sizeClasses}`}>
      <Info className="w-3.5 h-3.5 text-blue-600" />
      {status || 'Unknown'}
    </span>
  );
};
