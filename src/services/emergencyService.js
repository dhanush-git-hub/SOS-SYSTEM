import { storage } from './storage';
import { locationService } from './locationService';
import { isFirebaseConfigured, db } from './firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

export const EMERGENCY_STATUS = {
  PENDING: 'Pending',
  ACTIVE: 'Active',
  RESOLVED: 'Resolved',
  CANCELLED: 'Cancelled'
};

export const emergencyService = {
  // Create an emergency alert
  async triggerEmergency({ triggerType = 'Manual SOS', user, contacts = [] }) {
    let loc = null;
    try {
      loc = await locationService.getCurrentPosition();
    } catch (err) {
      console.warn('GPS position could not be acquired during SOS:', err);
      // Fallback coordinates with honest note (e.g. from last cached position or default safety reference)
      loc = locationService.cachedLocation || {
        latitude: 12.9716,
        longitude: 77.5946,
        accuracy: 50,
        address: 'GPS signal weak/unavailable; last known approximate zone',
        googleMapsUrl: 'https://www.google.com/maps?q=12.9716,77.5946',
        timestamp: new Date().toISOString()
      };
    }

    const emergencyId = 'sos-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
    
    // Simulate notification dispatch list for trusted contacts
    const notifiedList = contacts.map(c => ({
      contactId: c.id,
      name: c.name,
      phone: c.phone,
      simulatedStatus: 'Simulated SMS Dispatched (Demo Mode)',
      timestamp: new Date().toISOString()
    }));

    const newEmergency = {
      id: emergencyId,
      userId: user?.id || 'demo-user',
      userName: user?.name || 'SafeZone User',
      userPhone: user?.phone || '+1 (555) 019-2831',
      status: EMERGENCY_STATUS.ACTIVE,
      triggerType,
      createdAt: new Date().toISOString(),
      location: loc,
      googleMapsUrl: loc.googleMapsUrl,
      notifiedContacts: notifiedList,
      shareableTrackingUrl: `${window.location.origin}/#/track/${emergencyId}`,
      isDemoSimulated: true
    };

    // Store active emergency & push to history
    storage.setActiveEmergency(newEmergency);
    storage.saveEmergencyRecord(newEmergency);

    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'emergencies'), newEmergency);
      } catch (err) {
        console.warn('Firebase emergency save failed:', err);
      }
    }

    return newEmergency;
  },

  // Cancel an emergency during the 5s grace countdown
  cancelEmergency(user, reason = 'Cancelled by user during 5s countdown') {
    const cancelledRecord = {
      id: 'cancel-' + Date.now(),
      userId: user?.id || 'demo-user',
      userName: user?.name || 'SafeZone User',
      status: EMERGENCY_STATUS.CANCELLED,
      triggerType: 'Manual SOS',
      createdAt: new Date().toISOString(),
      resolvedAt: new Date().toISOString(),
      resolutionNote: reason,
      location: locationService.cachedLocation || {
        latitude: 12.9716,
        longitude: 77.5946,
        address: 'Current Location',
        googleMapsUrl: 'https://maps.google.com/?q=12.9716,77.5946'
      },
      notifiedContacts: []
    };

    storage.saveEmergencyRecord(cancelledRecord);
    storage.setActiveEmergency(null);
    return cancelledRecord;
  },

  // Mark an active emergency as safe / resolved
  async resolveEmergency(emergencyId, resolutionNote = 'User confirmed safe.') {
    const active = storage.getActiveEmergency();
    const resolvedRecord = {
      ...(active || {}),
      id: emergencyId || active?.id || 'emg-' + Date.now(),
      status: EMERGENCY_STATUS.RESOLVED,
      resolvedAt: new Date().toISOString(),
      resolutionNote
    };

    // Update in history & clear active
    storage.saveEmergencyRecord(resolvedRecord);
    storage.setActiveEmergency(null);

    if (isFirebaseConfigured && db && emergencyId) {
      try {
        await updateDoc(doc(db, 'emergencies', emergencyId), {
          status: EMERGENCY_STATUS.RESOLVED,
          resolvedAt: resolvedRecord.resolvedAt,
          resolutionNote
        });
      } catch (err) {
        console.warn('Firebase emergency resolve failed:', err);
      }
    }

    return resolvedRecord;
  },

  // Get single emergency for shareable tracking page
  getEmergencyById(id) {
    const active = storage.getActiveEmergency();
    if (active && active.id === id) return active;
    const history = storage.getEmergencyHistory();
    return history.find(e => e.id === id) || null;
  }
};
