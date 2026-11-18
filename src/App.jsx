import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { ContactsProvider } from './context/ContactsContext';
import { EmergencyProvider } from './context/EmergencyContext';

// Layout
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveLocationPage } from './pages/LiveLocationPage';
import { TrustedContactsPage } from './pages/TrustedContactsPage';
import { SafeTimerPage } from './pages/SafeTimerPage';
import { EmergencyHistoryPage } from './pages/EmergencyHistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { EmergencyTrackingPage } from './pages/EmergencyTrackingPage';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <LocationProvider>
          <ContactsProvider>
            <EmergencyProvider>
              <Routes>
                {/* Public Landing & Auth Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Public Shareable Emergency Tracking Route */}
                <Route path="/track/:emergencyId" element={<EmergencyTrackingPage />} />

                {/* Authenticated Dashboard Routes */}
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/location" element={<LiveLocationPage />} />
                  <Route path="/contacts" element={<TrustedContactsPage />} />
                  <Route path="/timer" element={<SafeTimerPage />} />
                  <Route path="/history" element={<EmergencyHistoryPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </EmergencyProvider>
          </ContactsProvider>
        </LocationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
