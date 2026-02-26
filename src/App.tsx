import React from 'react';

const MAINTENANCE = true;

const MaintenancePage: React.FC = () => (
  <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-4 text-center">
    <span className="text-8xl mb-8 block">🚧</span>
    <h1 className="text-4xl font-serif font-bold text-[#2C2C2C] mb-3">
      Under Maintenance
    </h1>
    <h2 className="text-2xl text-[#666] mb-8" style={{ fontFamily: '"Noto Serif SC", serif' }}>
      系统维护中
    </h2>
    <p className="text-[#888] max-w-md mb-2 font-serif">
      We are upgrading our systems. The site will be back online shortly.
    </p>
    <p className="text-[#aaa] max-w-md" style={{ fontFamily: '"Noto Serif SC", serif' }}>
      系统升级中，网站即将恢复访问。
    </p>
    <div className="mt-12 text-[10px] font-bold uppercase tracking-[0.3em] text-[#ccc]">
      International Journal of Shit · 国际粪便学报
    </div>
  </div>
);

// ---- Normal app (hidden during maintenance) ----
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

const NormalApp: React.FC = () => (
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

const App: React.FC = () => (MAINTENANCE ? <MaintenancePage /> : <NormalApp />);

export default App;
