/**
 * Storage service providing persistent LocalStorage fallback with pre-populated demo data
 * for SAFEZONE CEC-HACKSTORM-2026.
 */

const STORAGE_KEYS = {
  CURRENT_USER: 'safezone_current_user',
  REGISTERED_USERS: 'safezone_registered_users',
  TRUSTED_CONTACTS: 'safezone_trusted_contacts',
  EMERGENCY_HISTORY: 'safezone_emergency_history',
  ACTIVE_EMERGENCY: 'safezone_active_emergency',
  APP_SETTINGS: 'safezone_app_settings',
  SAFE_TIMER: 'safezone_safe_timer_state'
};

// Initial realistic demo contacts
const INITIAL_DEMO_CONTACTS = [
  {
    id: 'contact-1',
    name: 'Sarah Jenkins (Mother)',
    phone: '+1 (555) 382-9901',
    relationship: 'Mother',
    priority: 1,
    isPrimary: true,
    email: 'sarah.jenkins@family.net',
    notifyVia: ['sms', 'call', 'location']
  },
  {
    id: 'contact-2',
    name: 'Campus Security Dispatch',
    phone: '+1 (555) 911-0026',
    relationship: 'Campus Security',
    priority: 2,
    isPrimary: false,
    email: 'security@cec-campus.edu',
    notifyVia: ['sms', 'location']
  },
  {
    id: 'contact-3',
    name: 'David Miller (Roommate)',
    phone: '+1 (555) 742-1823',
    relationship: 'Friend / Roommate',
    priority: 3,
    isPrimary: false,
    email: 'david.m@student.cec.edu',
    notifyVia: ['sms']
  }
];

// Initial realistic emergency history for demonstration
const INITIAL_EMERGENCY_HISTORY = [
  {
    id: 'emg-demo-1',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    status: 'Resolved',
    triggerType: 'Manual SOS',
    resolvedAt: new Date(Date.now() - 86400000 * 3 + 1200000).toISOString(),
    resolutionNote: 'False alarm - arrived safely at student dorms.',
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      accuracy: 8.5,
      address: 'Near Central Library & Science Block, Campus Road'
    },
    googleMapsUrl: 'https://maps.google.com/?q=12.9716,77.5946',
    notifiedContacts: ['Sarah Jenkins (Mother)', 'Campus Security Dispatch']
  },
  {
    id: 'emg-demo-2',
    timestamp: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    status: 'Cancelled',
    triggerType: 'Safe Timer Expiry',
    resolvedAt: new Date(Date.now() - 86400000 * 7 + 4000).toISOString(),
    resolutionNote: 'Cancelled within 5s grace window.',
    location: {
      latitude: 12.9724,
      longitude: 77.5958,
      accuracy: 12.0,
      address: 'North Gate Transit Station'
    },
    googleMapsUrl: 'https://maps.google.com/?q=12.9724,77.5958',
    notifiedContacts: []
  }
];

const DEFAULT_SETTINGS = {
  demoMode: true,
  soundAlerts: true,
  vibrationEnabled: true,
  highAccuracyGps: true,
  simulatedSmsDelivery: true,
  autoEmergencyCall: false,
  timerWarningSound: true,
  countdownDuration: 5 // seconds
};

export const storage = {
  // Current user
  getCurrentUser: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setCurrentUser: (user) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // Registered Users (for local demo authentication)
  getRegisteredUsers: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveRegisteredUser: (newUser) => {
    const users = storage.getRegisteredUsers();
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === newUser.email.toLowerCase());
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...newUser };
    } else {
      users.push(newUser);
    }
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
  },

  // Trusted Contacts
  getContacts: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRUSTED_CONTACTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.TRUSTED_CONTACTS, JSON.stringify(INITIAL_DEMO_CONTACTS));
        return INITIAL_DEMO_CONTACTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DEMO_CONTACTS;
    }
  },
  saveContacts: (contacts) => {
    localStorage.setItem(STORAGE_KEYS.TRUSTED_CONTACTS, JSON.stringify(contacts));
  },

  // Emergency History
  getEmergencyHistory: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EMERGENCY_HISTORY);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.EMERGENCY_HISTORY, JSON.stringify(INITIAL_EMERGENCY_HISTORY));
        return INITIAL_EMERGENCY_HISTORY;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_EMERGENCY_HISTORY;
    }
  },
  saveEmergencyRecord: (record) => {
    const list = storage.getEmergencyHistory();
    const existingIndex = list.findIndex(r => r.id === record.id);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...record };
    } else {
      list.unshift(record);
    }
    localStorage.setItem(STORAGE_KEYS.EMERGENCY_HISTORY, JSON.stringify(list));
  },

  // Active Emergency
  getActiveEmergency: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_EMERGENCY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setActiveEmergency: (emergency) => {
    if (emergency) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_EMERGENCY, JSON.stringify(emergency));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_EMERGENCY);
    }
  },

  // Settings
  getSettings: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },
  saveSettings: (settings) => {
    localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
  },

  // Reset Demo Data
  resetDemoData: () => {
    localStorage.setItem(STORAGE_KEYS.TRUSTED_CONTACTS, JSON.stringify(INITIAL_DEMO_CONTACTS));
    localStorage.setItem(STORAGE_KEYS.EMERGENCY_HISTORY, JSON.stringify(INITIAL_EMERGENCY_HISTORY));
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_EMERGENCY);
  }
};
