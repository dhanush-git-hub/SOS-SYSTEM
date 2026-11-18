import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { locationService } from '../services/locationService';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'prompt', 'granted', 'denied', 'unsupported'
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // Check browser permission status if supported
  useEffect(() => {
    if (!locationService.isSupported()) {
      setPermissionStatus('unsupported');
      setError('Geolocation is not supported by your browser.');
      return;
    }

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' })
        .then((result) => {
          setPermissionStatus(result.state);
          result.onchange = () => {
            setPermissionStatus(result.state);
            if (result.state === 'granted') {
              fetchLocation();
            }
          };
        })
        .catch(() => {
          // Permissions API might not support geolocation in all browsers
        });
    }

    // Try fetching initial location on mount
    fetchLocation();
  }, []);

  // Fetch single snapshot
  const fetchLocation = useCallback(async () => {
    if (!locationService.isSupported()) return null;
    setIsLoading(true);
    setError(null);
    try {
      const loc = await locationService.getCurrentPosition();
      setLocation(loc);
      setPermissionStatus('granted');
      setLastRefreshed(new Date().toLocaleTimeString());
      setIsLoading(false);
      return loc;
    } catch (err) {
      setError(err.message);
      if (err.message.includes('denied')) {
        setPermissionStatus('denied');
      }
      setIsLoading(false);
      return null;
    }
  }, []);

  // Toggle live continuous sharing
  const toggleLiveSharing = useCallback(() => {
    if (isSharingLocation) {
      locationService.stopWatching();
      setIsSharingLocation(false);
    } else {
      setIsSharingLocation(true);
      setError(null);
      locationService.startWatching(
        (updatedLoc) => {
          setLocation(updatedLoc);
          setPermissionStatus('granted');
          setLastRefreshed(new Date().toLocaleTimeString());
        },
        (err) => {
          setError(err.message);
          setIsSharingLocation(false);
        }
      );
    }
  }, [isSharingLocation]);

  const stopSharing = useCallback(() => {
    locationService.stopWatching();
    setIsSharingLocation(false);
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        permissionStatus,
        isSharingLocation,
        isLoading,
        error,
        lastRefreshed,
        fetchLocation,
        toggleLiveSharing,
        stopSharing
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};
