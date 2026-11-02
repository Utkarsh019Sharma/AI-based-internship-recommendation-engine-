
import React, { useState } from 'react';
import type { Application, Job, Student } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { ArrowUpTrayIcon } from './icons/ArrowUpTrayIcon';

interface ViewApplicationsTableProps {
  applications: Application[];
  jobs: Job[];
  students: Student[];
  onUpdateApplication: (applicationId: number, status: Application['status']) => void;
}

interface ResumeModalProps {
    content: string;
    studentName: string;
    onClose: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ content, studentName, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col animate-fadeIn">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50 rounded-t-lg">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Resume: {studentName}</h3>
                    <p className="text-xs text-slate-500">Review candidate details</p>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>
            <div className="flex-grow p-6 overflow-y-auto bg-white font-mono text-sm whitespace-pre-wrap text-slate-700 leading-relaxed">
                {content || "No resume content available for this candidate."}
            </div>
            <div className="p-4 border-t bg-slate-50 flex justify-end gap-3 rounded-b-lg">
                 <button onClick={onClose} className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-200 rounded-lg transition">Close</button>
                 <button 
                    onClick={() => {
                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${studentName.replace(/\s+/g, '_')}_Resume.txt`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
                    <ArrowUpTrayIcon className="h-4 w-4 rotate-180" />
                    Download
                </button>
            </div>
        </div>
        <style>{`
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            .animate-fadeIn {
                animation: fadeIn 0.2s ease-out forwards;
            }
        `}</style>
    </div>
);

const StatusBadge: React.FC<{ status: Application['status'] }> = ({ status }) => {
    const styles = {
        Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        Accepted: 'bg-green-100 text-green-800 border-green-200',
        Rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    return <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${styles[status]}`}>{status}</span>;
}


export const ViewApplicationsTable: React.FC<ViewApplicationsTableProps> = ({ applications, jobs, students, onUpdateApplication }) => {
    const [viewingResume, setViewingResume] = useState<{content: string, name: string} | null>(null);

    const getJobTitle = (jobId: number) => jobs.find(j => j.job_id === jobId)?.title || 'N/A';
    const getStudent = (studentId: number) => students.find(s => s.student_id === studentId);
    const getJobLocation = (jobId: number) => jobs.find(j => j.job_id === jobId)?.location || 'N/A';

    const handleViewResume = (studentId: number) => {
        const student = getStudent(studentId);
        if (student) {
            setViewingResume({
                content: student.resumeText,
                name: student.name
            });
        } else {
            alert("Student profile not found.");
        }
    };

    if (applications.length === 0) {
        return (
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">View Applications</h2>
                <p className="text-slate-500">No applications received yet.</p>
            </div>
        );
    }
    
    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">View Applications</h2>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Applicant Name</th>
                            <th scope="col" className="px-6 py-3">Job Title</th>
                            <th scope="col" className="px-6 py-3">Location</th>
                            <th scope="col" className="px-6 py-3">Resume</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.application_id} className="bg-white border-b hover:bg-slate-50 transition-colors">
                                <th scope="row" className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                                    {getStudent(app.student_id)?.name || 'Unknown'}
                                </th>
                                <td className="px-6 py-4">{getJobTitle(app.job_id)}</td>
                                <td className="px-6 py-4">{getJobLocation(app.job_id)}</td>
                                <td className="px-6 py-4">
                                  <button 
                                    onClick={() => handleViewResume(app.student_id)}
                                    className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline flex items-center gap-1"
                                  >
                                    View Resume
                                  </button>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={app.status} />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {app.status === 'Pending' ? (
                                        <div className="flex gap-2 justify-center">
                                            <button 
                                                onClick={() => onUpdateApplication(app.application_id, 'Accepted')} 
                                                className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded hover:bg-green-100 font-semibold text-xs transition"
                                            >
                                                Accept
                                            </button>
                                            <button 
                                                onClick={() => onUpdateApplication(app.application_id, 'Rejected')} 
                                                className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded hover:bg-red-100 font-semibold text-xs transition"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 font-medium">Completed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {viewingResume && (
                <ResumeModal 
                    content={viewingResume.content} 
                    studentName={viewingResume.name}
                    onClose={() => setViewingResume(null)} 
                />
            )}
        </div>
    );
};
