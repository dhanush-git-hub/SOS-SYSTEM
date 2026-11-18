import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  History, 
  Filter, 
  MapPin, 
  ExternalLink, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Share2, 
  FileText 
} from 'lucide-react';

export const EmergencyHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'ACTIVE', 'RESOLVED', 'CANCELLED'
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const list = storage.getEmergencyHistory();
    setHistory(list);
  }, []);

  const filteredHistory = history.filter((rec) => {
    if (filter === 'ALL') return true;
    return rec.status?.toUpperCase() === filter;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-red-600" />
            Emergency History & Incident Audit
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Immutable log of all triggered SOS alerts, resolution notes, and captured GPS trails.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm self-start sm:self-auto">
          {['ALL', 'ACTIVE', 'RESOLVED', 'CANCELLED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-navy-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Layout */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Records Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            No incident logs match the "{filter}" filter. All future emergency activations and cancellations will be archived here.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-8 my-4">
          {filteredHistory.map((rec) => {
            const dateObj = new Date(rec.timestamp || rec.createdAt);
            const isResolved = rec.status === 'Resolved';
            const isCancelled = rec.status === 'Cancelled';
            const isActive = rec.status === 'Active';

            return (
              <div key={rec.id} className="relative group">
                
                {/* Timeline node icon */}
                <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-4 border-slate-50 flex items-center justify-center text-white ${
                  isActive ? 'bg-red-600 animate-ping' : isResolved ? 'bg-emerald-600' : 'bg-slate-400'
                }`}>
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                {/* Timeline Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">
                          {rec.id}
                        </span>
                        <StatusBadge status={rec.status} size="sm" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {rec.triggerType || 'Manual Emergency SOS'}
                      </h3>
                    </div>

                    <div className="text-xs text-slate-400 font-medium flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {dateObj.toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Location & Address */}
                  {rec.location && (
                    <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <span className="font-mono font-bold text-slate-700">
                            {rec.location.latitude?.toFixed(5)}° N, {rec.location.longitude?.toFixed(5)}° E
                          </span>
                          <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">
                            {rec.location.address || 'Campus Proximity Zone'}
                          </p>
                        </div>
                      </div>

                      <a
                        href={rec.googleMapsUrl || `https://maps.google.com/?q=${rec.location.latitude},${rec.location.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors flex items-center gap-1 self-start sm:self-auto"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Maps Link</span>
                      </a>
                    </div>
                  )}

                  {/* Resolution Notes */}
                  {rec.resolutionNote && (
                    <div className="text-xs text-slate-600 bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 mb-4">
                      <strong className="text-emerald-800 block font-bold mb-0.5">Resolution Note:</strong>
                      {rec.resolutionNote}
                    </div>
                  )}

                  {/* Bottom details & Tracking Link button */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">
                      Notified: {rec.notifiedContacts?.length || 0} contacts
                    </span>

                    <a
                      href={`/#/track/${rec.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>View Shareable Public Track</span>
                    </a>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
