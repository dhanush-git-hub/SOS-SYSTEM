import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { isFirebaseConfigured, auth } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isFirebaseConfigured);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const formatted = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
            phone: firebaseUser.phoneNumber || '+1 (555) 019-2831',
            bloodGroup: 'O+',
            emergencyNotes: 'Allergic to Penicillin. Carries asthma inhaler.',
            isDemo: false
          };
          setUser(formatted);
          storage.setCurrentUser(formatted);
        } else {
          // Check if local demo user is set
          const localUser = storage.getCurrentUser();
          setUser(localUser);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Demo mode fallback
      const localUser = storage.getCurrentUser();
      if (!localUser) {
        // Create an initial convenient demo user so the reviewer can jump right in or login manually
        const defaultDemo = {
          id: 'user-demo-1',
          name: 'Alex Morgan',
          email: 'alex.morgan@safezone.org',
          phone: '+1 (555) 234-5678',
          bloodGroup: 'A+',
          emergencyNotes: 'Asthma inhaler in backpack. Student ID: CEC-2026-891',
          isDemo: true
        };
        setUser(defaultDemo);
        storage.setCurrentUser(defaultDemo);
      } else {
        setUser(localUser);
      }
      setLoading(false);
    }
  }, []);

  // Demo 1-Click Login (especially great for judges & fast review)
  const loginAsDemo = (role = 'Alex Morgan (Student)') => {
    const demoUser = {
      id: 'demo-judge-session',
      name: role,
      email: 'demo@safezone.org',
      phone: '+1 (555) 948-2200',
      bloodGroup: 'O+',
      emergencyNotes: 'No known allergies. CEC-HACKSTORM-2026 Evaluator.',
      isDemo: true
    };
    setUser(demoUser);
    storage.setCurrentUser(demoUser);
    return demoUser;
  };

  // Login
  const login = async (email, password) => {
    if (isFirebaseConfigured && auth) {
      try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const loggedUser = {
          id: credential.user.uid,
          name: credential.user.displayName || email.split('@')[0],
          email: credential.user.email,
          phone: '+1 (555) 019-2831',
          bloodGroup: 'O+',
          emergencyNotes: '',
          isDemo: false
        };
        setUser(loggedUser);
        storage.setCurrentUser(loggedUser);
        return loggedUser;
      } catch (err) {
        throw new Error(err.message || 'Firebase login failed.');
      }
    } else {
      // Local demo authentication
      const registered = storage.getRegisteredUsers();
      const found = registered.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        if (found.password && found.password !== password) {
          throw new Error('Invalid password.');
        }
        setUser(found);
        storage.setCurrentUser(found);
        return found;
      } else {
        // Allow instant login for any email in demo mode with default mock profile
        const newUser = {
          id: 'user-' + Date.now(),
          name: email.split('@')[0],
          email: email,
          phone: '+1 (555) ' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(1000 + Math.random() * 9000),
          bloodGroup: 'O+',
          emergencyNotes: 'Demo session created.',
          isDemo: true
        };
        setUser(newUser);
        storage.setCurrentUser(newUser);
        return newUser;
      }
    }
  };

  // Register
  const register = async (name, email, password, phone = '') => {
    if (isFirebaseConfigured && auth) {
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const registeredUser = {
          id: credential.user.uid,
          name: name,
          email: credential.user.email,
          phone: phone || '+1 (555) 019-2831',
          bloodGroup: 'O+',
          emergencyNotes: '',
          isDemo: false
        };
        setUser(registeredUser);
        storage.setCurrentUser(registeredUser);
        return registeredUser;
      } catch (err) {
        throw new Error(err.message || 'Registration failed.');
      }
    } else {
      // Local registration
      const newUser = {
        id: 'user-' + Date.now(),
        name,
        email,
        password, // Stored locally only in demo mode
        phone: phone || '+1 (555) 301-4492',
        bloodGroup: 'O+',
        emergencyNotes: 'SafeZone student member.',
        isDemo: true
      };
      storage.saveRegisteredUser(newUser);
      setUser(newUser);
      storage.setCurrentUser(newUser);
      return newUser;
    }
  };

  // Forgot password
  const resetPassword = async (email) => {
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset link sent to your email.' };
    } else {
      return { 
        success: true, 
        message: `(DEMO MODE) Password reset link simulated for ${email}. In live mode with Firebase, a secure reset token is emailed.` 
      };
    }
  };

  // Update profile
  const updateProfile = (updatedData) => {
    const updated = { ...user, ...updatedData };
    setUser(updated);
    storage.setCurrentUser(updated);
    storage.saveRegisteredUser(updated);
    return updated;
  };

  // Logout
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    setUser(null);
    storage.setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoMode,
        login,
        register,
        loginAsDemo,
        resetPassword,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
