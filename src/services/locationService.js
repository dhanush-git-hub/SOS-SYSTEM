/**
 * Location Service using Browser Geolocation API.
 * Never fakes real coordinates, captures genuine GPS status, accuracy, and timestamp,
 * and provides reverse-geocoding and Google Maps link generation.
 */

class LocationService {
  constructor() {
    this.watchId = null;
    this.cachedLocation = null;
    this.listeners = new Set();
  }

  // Check if browser supports Geolocation
  isSupported() {
    return 'geolocation' in navigator;
  }

  // Get current position once
  async getCurrentPosition(options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }) {
    if (!this.isSupported()) {
      throw new Error('Geolocation is not supported by your browser.');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: new Date(position.timestamp).toISOString(),
            googleMapsUrl: this.generateGoogleMapsUrl(position.coords.latitude, position.coords.longitude),
            address: await this.reverseGeocode(position.coords.latitude, position.coords.longitude)
          };
          this.cachedLocation = loc;
          resolve(loc);
        },
        (error) => {
          let msg = 'Unable to retrieve location.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location permission was denied. Please allow GPS access in your browser.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = 'Location information is currently unavailable.';
          } else if (error.code === error.TIMEOUT) {
            msg = 'Location request timed out. Please check device GPS.';
          }
          reject(new Error(msg));
        },
        options
      );
    });
  }

  // Start continuous watchPosition
  startWatching(onLocationUpdate, onError, options = { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }) {
    if (!this.isSupported()) {
      if (onError) onError(new Error('Geolocation is not supported by your browser.'));
      return null;
    }

    if (this.watchId !== null) {
      this.stopWatching();
    }

    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const loc = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: new Date(position.timestamp).toISOString(),
          googleMapsUrl: this.generateGoogleMapsUrl(position.coords.latitude, position.coords.longitude),
          address: this.cachedLocation?.latitude === position.coords.latitude 
            ? this.cachedLocation.address 
            : await this.reverseGeocode(position.coords.latitude, position.coords.longitude)
        };
        this.cachedLocation = loc;
        if (onLocationUpdate) onLocationUpdate(loc);
      },
      (error) => {
        let msg = 'Failed to track location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied by user.';
        }
        if (onError) onError(new Error(msg));
      },
      options
    );

    return this.watchId;
  }

  // Stop continuous watchPosition
  stopWatching() {
    if (this.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Generate Google Maps URL
  generateGoogleMapsUrl(lat, lng) {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }

  // Reverse geocoding using OpenStreetMap Nominatim with safe fallback
  async reverseGeocode(lat, lng) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' }, signal: AbortSignal.timeout(3500) }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.display_name) {
          return data.display_name;
        }
      }
    } catch {
      // Network timeout or blocked CORS
    }
    return `Location at ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

export const locationService = new LocationService();
