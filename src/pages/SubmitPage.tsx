import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { API } from '../lib/api';
import { MaintenanceAnnouncement } from './submit/MaintenanceAnnouncement';
import { SubmissionForm } from './submit/SubmissionForm';
import { SubmissionGuidelinesComponent } from '../components/sidebar/SubmissionGuidelines';
import { JournalMetrics } from '../components/sidebar/JournalMetrics';
import { COPEMember } from '../components/sidebar/COPEMember';

export const SubmitPage: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [maintenance, setMaintenance] = useState({
    registration: false,
    comment_send: false,
    submit: false,
    comment_show: false,
  });
  const [maintLoading, setMaintLoading] = useState(true);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const res = await API.maintainance.getList();
        if (res) {
          setMaintenance({
            registration: res.registration,
            comment_send: res.comment_send,
            submit: res.submit,
            comment_show: res.comment_show,
          });
        }
      } catch (error) {
        console.error("无法获取维护状态", error);
      } finally {
        setMaintLoading(false);
      }
    };
    checkMaintenance();
  }, []);

  if (loading || maintLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <img src="/LOGO2.png" alt="Loading" className="w-9 h-9 animate-pulse" />
      </div>
    );
  }

  if (maintenance.submit) {
    return (
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
        <MaintenanceAnnouncement />
      </div>
    );
  }

  // Normal mode: require auth
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <img src="/LOGO2.png" alt="Loading" className="w-9 h-9 animate-pulse" />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <SubmissionForm />
        </div>
        <aside className="space-y-8">
          <SubmissionGuidelinesComponent />
          <JournalMetrics compact />
          <COPEMember />
        </aside>
      </div>
    </div>
  );
};
