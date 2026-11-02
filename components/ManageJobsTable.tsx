import React, { useState } from 'react';
import type { Job, Application } from '../types';

interface ManageJobsTableProps {
  jobs: Job[];
  applications: Application[];
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const ManageJobsTable: React.FC<ManageJobsTableProps> = ({ jobs, applications }) => {
    const [jobStatuses, setJobStatuses] = useState<{ [key: number]: boolean }>(
        jobs.reduce((acc, job) => ({ ...acc, [job.job_id]: job.isActive }), {})
    );

    const handleToggle = (jobId: number) => {
        setJobStatuses(prev => ({...prev, [jobId]: !prev[jobId]}));
        // In a real app, you would call an API to update the job status.
    };
    
    const getApplicantCount = (jobId: number) => {
        return applications.filter(app => app.job_id === jobId).length;
    }

    if (jobs.length === 0) {
        return (
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Manage Jobs</h2>
                <p className="text-slate-500">You haven't posted any jobs yet.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Manage Jobs</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">Job Title</th>
                            <th scope="col" className="px-6 py-3">Date Posted</th>
                            <th scope="col" className="px-6 py-3">Location</th>
                            <th scope="col" className="px-6 py-3 text-center">Applicants</th>
                            <th scope="col" className="px-6 py-3 text-center">Visibility</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job.job_id} className="bg-white border-b hover:bg-slate-50">
                                <th scope="row" className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                                    {job.title}
                                </th>
                                <td className="px-6 py-4">{formatDate(job.postedDate)}</td>
                                <td className="px-6 py-4">{job.location}</td>
                                <td className="px-6 py-4 text-center font-semibold">{getApplicantCount(job.job_id)}</td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                      onClick={() => handleToggle(job.job_id)}
                                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                                        jobStatuses[job.job_id] ? 'bg-indigo-600' : 'bg-slate-300'
                                      }`}
                                    >
                                      <span
                                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                          jobStatuses[job.job_id] ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                      />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
