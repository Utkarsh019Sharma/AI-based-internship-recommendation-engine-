import React, { useState } from 'react';
import type { Recruiter, Job, Application, Student } from '../types';
import { ArrowLeftOnRectangleIcon } from './icons/ArrowLeftOnRectangleIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { DocumentPlusIcon } from './icons/DocumentPlusIcon';
import { ClipboardDocumentListIcon } from './icons/ClipboardDocumentListIcon';
import { EnvelopeIcon } from './icons/EnvelopeIcon';
import { PostJobForm } from './PostJobForm';
import { ManageJobsTable } from './ManageJobsTable';
import { ViewApplicationsTable } from './ViewApplicationsTable';


interface RecruiterDashboardProps {
  recruiter: Recruiter;
  jobs: Job[];
  applications: Application[];
  students: Student[];
  onPostJob: (jobData: Omit<Job, 'job_id' | 'postedDate' | 'isActive'>) => void;
  onUpdateApplication: (applicationId: number, status: Application['status']) => void;
  onLogout: () => void;
}

type ActiveTab = 'post' | 'manage' | 'view';

const TabButton: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex-1 flex sm:flex-none sm:w-auto items-center justify-center sm:justify-start gap-3 px-4 py-3 text-sm font-bold rounded-lg transition ${isActive ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}>
        {icon}
        <span className="hidden sm:inline">{label}</span>
    </button>
);


export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ recruiter, jobs, applications, students, onPostJob, onUpdateApplication, onLogout }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('view');

  return (
    <div className="bg-slate-100 min-h-screen font-sans">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <BriefcaseIcon className="h-8 w-8 text-indigo-500" />
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Recruiter Dashboard</h1>
                  <p className="text-xs text-slate-500 font-semibold">{recruiter.company}</p>
                </div>
             </div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600 hidden sm:block">Welcome, {recruiter.name.split(' ')[0]}!</span>
                <button onClick={onLogout} className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 font-semibold transition">
                    <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                    Logout
                </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
             <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <TabButton label="View Applications" icon={<EnvelopeIcon className="h-5 w-5" />} isActive={activeTab === 'view'} onClick={() => setActiveTab('view')} />
                <TabButton label="Manage Jobs" icon={<ClipboardDocumentListIcon className="h-5 w-5" />} isActive={activeTab === 'manage'} onClick={() => setActiveTab('manage')} />
                <TabButton label="Post New Job" icon={<DocumentPlusIcon className="h-5 w-5" />} isActive={activeTab === 'post'} onClick={() => setActiveTab('post')} />
             </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            {activeTab === 'view' && <ViewApplicationsTable applications={applications} jobs={jobs} students={students} onUpdateApplication={onUpdateApplication} />}
            {activeTab === 'manage' && <ManageJobsTable jobs={jobs} applications={applications} />}
            {activeTab === 'post' && <PostJobForm recruiterId={recruiter.recruiter_id} onPostJob={onPostJob} onSwitchToManage={() => setActiveTab('manage')} />}
          </div>
        </main>
    </div>
  );
};
