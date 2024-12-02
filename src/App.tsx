import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { MaintenanceView } from './components/MaintenanceView';
import { HistoryView } from './components/HistoryView';
import { StyleGuide } from './components/StyleGuide';
import { TreeDetails } from './components/TreeDetails';
import { PricingPage } from './pages/PricingPage';
import { AuthError } from './components/AuthError';
import { CookieConsent } from './components/CookieConsent';
import { useAuthStore } from './store/authStore';
import { SpeciesIdentifierPage } from './pages/SpeciesIdentifierPage';
import { HealthAnalyticsPage } from './pages/HealthAnalyticsPage';
import { CareGuidePage } from './pages/CareGuidePage';
import { ExpertCoachingPage } from './pages/ExpertCoachingPage';
import { logAnalyticsEvent } from './config/firebase';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-bonsai-green border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    logAnalyticsEvent('unauthorized_access_attempt');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { loading } = useAuthStore();

  React.useEffect(() => {
    // Log page views
    logAnalyticsEvent('app_loaded');
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-bonsai-green border-t-transparent"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/tree/:id" element={
            <ProtectedRoute>
              <TreeDetails />
            </ProtectedRoute>
          } />
          <Route path="/maintenance" element={
            <ProtectedRoute>
              <MaintenanceView />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <HistoryView />
            </ProtectedRoute>
          } />
          <Route path="/guide" element={
            <ProtectedRoute>
              <StyleGuide />
            </ProtectedRoute>
          } />
          <Route path="/species-identifier" element={<SpeciesIdentifierPage />} />
          <Route path="/health-analytics" element={<HealthAnalyticsPage />} />
          <Route path="/care-guide" element={<CareGuidePage />} />
          <Route path="/expert-coaching" element={<ExpertCoachingPage />} />
        </Routes>
        <AuthError />
        <CookieConsent />
      </div>
    </BrowserRouter>
  );
}