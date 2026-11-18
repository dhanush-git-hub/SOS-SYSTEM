import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { storage } from '../services/storage';
import { emergencyService, EMERGENCY_STATUS } from '../services/emergencyService';
import { soundService } from '../services/soundService';
import { useAuth } from './AuthContext';
import { useContacts } from './ContactsContext';
import { useLocation } from './LocationContext';

const EmergencyContext = createContext(null);

export const EmergencyProvider = ({ children }) => {
  const { user } = useAuth();
  const { contacts } = useContacts();
  const { fetchLocation, location } = useLocation();

  // Active emergency from persistent storage
  const [activeEmergency, setActiveEmergency] = useState(() => storage.getActiveEmergency());

  // 5-second countdown state
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(5);
  const [countdownTriggerType, setCountdownTriggerType] = useState('Manual SOS');
  
  // Simulated alert dispatch modal visibility
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [lastDispatchedEmergency, setLastDispatchedEmergency] = useState(null);

  const countdownTimerRef = useRef(null);

  // Sync active emergency with storage
  useEffect(() => {
    const stored = storage.getActiveEmergency();
    if (stored) {
      setActiveEmergency(stored);
    }
  }, []);

  // Complete SOS trigger after countdown finishes
  const executeSos = useCallback(async (triggerType = 'Manual SOS') => {
    setIsCountingDown(false);
    clearInterval(countdownTimerRef.current);
    countdownTimerRef.current = null;

    // Play loud emergency siren / alarm
    soundService.playEmergencyAlarm();

    // Ensure we have current GPS
    await fetchLocation();

    // Create & persist emergency
    const newAlert = await emergencyService.triggerEmergency({
      triggerType,
      user,
      contacts
    });

    setActiveEmergency(newAlert);
    setLastDispatchedEmergency(newAlert);
    setShowDispatchModal(true);
  }, [user, contacts, fetchLocation]);

  // Initiate SOS with 5-second grace countdown
  const startSosCountdown = useCallback((triggerType = 'Manual SOS') => {
    if (activeEmergency) {
      // Already active, reopen modal
      setShowDispatchModal(true);
      return;
    }

    setCountdownTriggerType(triggerType);
    setCountdownSeconds(5);
    setIsCountingDown(true);

    // Initial beep
    soundService.playCountdownBeep(5);

    let sec = 5;
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    countdownTimerRef.current = setInterval(() => {
      sec -= 1;
      setCountdownSeconds(sec);
      soundService.playCountdownBeep(sec);

      if (sec <= 0) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
        executeSos(triggerType);
      }
    }, 1000);
  }, [activeEmergency, executeSos]);

  // Cancel countdown before it fires
  const cancelSosCountdown = useCallback((reason = 'Cancelled by user during 5s grace window') => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setIsCountingDown(false);
    setCountdownSeconds(5);

    // Save cancellation record to history
    emergencyService.cancelEmergency(user, reason);
  }, [user]);

  // Immediate SOS (bypasses countdown if explicitly requested, e.g. severe distress)
  const triggerInstantSos = useCallback(async (triggerType = 'Instant SOS') => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    await executeSos(triggerType);
  }, [executeSos]);

  // Mark Active Emergency as Safe
  const markAsSafe = useCallback(async (resolutionNote = 'I am safe and secure.') => {
    if (!activeEmergency) return;

    soundService.playSafeChime();
    const resolved = await emergencyService.resolveEmergency(activeEmergency.id, resolutionNote);
    setActiveEmergency(null);
    setShowDispatchModal(false);
    return resolved;
  }, [activeEmergency]);

  return (
    <EmergencyContext.Provider
      value={{
        activeEmergency,
        isCountingDown,
        countdownSeconds,
        countdownTriggerType,
        showDispatchModal,
        lastDispatchedEmergency,
        setShowDispatchModal,
        startSosCountdown,
        cancelSosCountdown,
        triggerInstantSos,
        markAsSafe
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) throw new Error('useEmergency must be used within an EmergencyProvider');
  return context;
};
