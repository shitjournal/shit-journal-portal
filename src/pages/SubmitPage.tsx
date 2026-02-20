import React from 'react';
import { SubmissionForm } from './submit/SubmissionForm';
import { SubmissionGuidelines } from '../components/sidebar/SubmissionGuidelines';
import { JournalMetrics } from '../components/sidebar/JournalMetrics';
import { COPEMember } from '../components/sidebar/COPEMember';

export const SubmitPage: React.FC = () => (
  <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2">
        <SubmissionForm />
      </div>
      <aside className="space-y-8">
        <SubmissionGuidelines />
        <JournalMetrics compact />
        <COPEMember />
      </aside>
    </div>
  </div>
);
