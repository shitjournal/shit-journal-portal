import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute';
import { SubmitPage } from './pages/SubmitPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AuthorDashboard } from './pages/dashboard/AuthorDashboard';
import { SubmissionDetail } from './pages/dashboard/SubmissionDetail';
import { PreprintListPage } from './pages/preprints/PreprintListPage';
import { PreprintDetailPage } from './pages/preprints/PreprintDetailPage';
import { ScreeningDashboard } from './pages/editor/ScreeningDashboard';
import { ScreeningDetail } from './pages/editor/ScreeningDetail';
import { NewsPage } from './pages/news/NewsPage';
import { GovernanceArticle } from './pages/news/GovernanceArticle';
import { ZoneSystemArticle } from './pages/news/ZoneSystemArticle';
import { MaintenanceArticle } from './pages/news/MaintenanceArticle';
import { CommunityGuardPage } from './pages/CommunityGuardPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ComingSoon } from './pages/ComingSoon';
import { FeedbackViewer } from './pages/admin/FeedbackViewer';
import { UserManagement } from './pages/admin/UserManagement';
import { AdminActions } from './pages/admin/AdminActions';
import { PrivacyPolicy } from './pages/legal/PrivacyPolicy';
import { TermsOfService } from './pages/legal/TermsOfService';
import { CookieConsent } from './components/layout/CookieConsent';
import { SubmissionGuidelines } from './pages/guidelines/SubmissionGuidelines';
import { DailyRecruitmentGuidelines } from './pages/guidelines/DailyRecruitmentGuidelines';
import { SearchPage } from './pages/SearchPage';

const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><AuthorDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/:id" element={<ProtectedRoute><SubmissionDetail /></ProtectedRoute>} />
          <Route path="/preprints" element={<PreprintListPage />} />
          <Route path="/preprints/:id" element={<PreprintDetailPage />} />
          <Route path="/screening" element={<RoleProtectedRoute allowedRoles={['editor']}><ScreeningDashboard /></RoleProtectedRoute>} />
          <Route path="/screening/:id" element={<RoleProtectedRoute allowedRoles={['editor']}><ScreeningDetail /></RoleProtectedRoute>} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/zone-system" element={<ZoneSystemArticle />} />
          <Route path="/news/governance-1.0" element={<GovernanceArticle />} />
          <Route path="/news/maintenance" element={<MaintenanceArticle />} />
          <Route path="/admin/feedback" element={<RoleProtectedRoute allowedRoles={['editor']}><FeedbackViewer /></RoleProtectedRoute>} />
          <Route path="/admin/users" element={<RoleProtectedRoute allowedRoles={['super_admin']}><UserManagement /></RoleProtectedRoute>} />
          <Route path="/admin/actions" element={<RoleProtectedRoute allowedRoles={['admin']}><AdminActions /></RoleProtectedRoute>} />
          <Route path="/community-guard" element={<CommunityGuardPage />} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/submission-guidelines" element={<SubmissionGuidelines />} />
          <Route path="/daily-recruitment-guidelines" element={<DailyRecruitmentGuidelines />} />
          <Route path="*" element={<ComingSoon />} />
        </Routes>
        <CookieConsent />
      </Layout>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
