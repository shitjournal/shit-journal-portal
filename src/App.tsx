import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { SubmitPage } from './pages/SubmitPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AuthorDashboard } from './pages/dashboard/AuthorDashboard';
import { SubmissionDetail } from './pages/dashboard/SubmissionDetail';
import { PreprintListPage } from './pages/preprints/PreprintListPage';
import { PreprintDetailPage } from './pages/preprints/PreprintDetailPage';
import { ComingSoon } from './pages/ComingSoon';

const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/submit" element={<ProtectedRoute><SubmitPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><AuthorDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/:id" element={<ProtectedRoute><SubmissionDetail /></ProtectedRoute>} />
          <Route path="/preprints" element={<ProtectedRoute><PreprintListPage /></ProtectedRoute>} />
          <Route path="/preprints/:id" element={<ProtectedRoute><PreprintDetailPage /></ProtectedRoute>} />
          <Route path="*" element={<ComingSoon />} />
        </Routes>
      </Layout>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
