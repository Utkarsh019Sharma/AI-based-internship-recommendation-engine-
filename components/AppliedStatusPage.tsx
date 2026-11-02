
import React, { useState } from 'react';
import type { Student, Internship, Interaction, ApplicationStage } from '../types';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { MapIcon } from './icons/MapIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ArrowUpTrayIcon } from './icons/ArrowUpTrayIcon';
import { XMarkIcon } from './icons/XMarkIcon';

interface AppliedStatusPageProps {
  student: Student;
  interactions: Interaction[];
  internships: Internship[];
}

const steps: ApplicationStage[] = ['Applied', 'Screening', 'Technical Interview', 'HR Interview', 'Offer'];

const getStepIndex = (status?: ApplicationStage) => {
    if (!status) return 0;
    if (status === 'Rejected') return -1;
    return steps.indexOf(status);
};

const ResumePreviewModal: React.FC<{ content: string; onClose: () => void }> = ({ content, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Submitted Resume</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>
            <div className="flex-grow p-6 overflow-y-auto bg-slate-50 font-mono text-sm whitespace-pre-wrap text-slate-700">
                {content || "No resume content available for this application."}
            </div>
            <div className="p-4 border-t bg-white flex justify-end gap-3">
                 <button onClick={onClose} className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition">Close</button>
                 <button 
                    onClick={() => {
                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'submitted_resume.txt';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <ArrowUpTrayIcon className="h-4 w-4 rotate-180" />
                    Download
                </button>
            </div>
        </div>
    </div>
);

const ApplicationCard: React.FC<{ interaction: Interaction; internship: Internship }> = ({ interaction, internship }) => {
    const [showResume, setShowResume] = useState(false);
    const currentStepIndex = getStepIndex(interaction.applicationStatus);
    const isRejected = interaction.applicationStatus === 'Rejected';

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            {/* Header: Company Info */}
            <div className="flex items-center gap-4 mb-6">
                <div className={`h-12 w-12 rounded-lg ${internship.logoColor} flex items-center justify-center text-white text-xl font-bold`}>
                    {internship.company.charAt(0)}
                </div>
                <div className="flex-grow">
                    <h4 className="text-lg font-bold text-slate-900">{internship.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="font-semibold">{internship.company}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <MapIcon className="h-3.5 w-3.5" />
                            {internship.location}
                        </div>
                    </div>
                </div>
                <div className="ml-auto text-right hidden sm:block">
                     <p className="text-xs text-slate-400">Applied on</p>
                     <p className="text-sm font-semibold text-slate-700">{new Date(interaction.appliedDate || '').toLocaleDateString()}</p>
                </div>
            </div>

            {/* Progress Stepper */}
            <div className="relative mb-8">
                 {isRejected ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-center text-red-700 font-bold">
                        Application Status: Rejected
                    </div>
                 ) : (
                    <div className="w-full">
                         {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full -z-0"></div>
                        <div 
                            className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full -z-0 transition-all duration-700" 
                            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                        ></div>

                        {/* Steps */}
                        <div className="relative z-10 flex justify-between w-full">
                            {steps.map((step, index) => {
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;
                                
                                return (
                                    <div key={step} className="flex flex-col items-center group">
                                        <div 
                                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                                isCurrent 
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_0_4px_rgba(37,99,235,0.2)] scale-110' 
                                                    : isCompleted 
                                                        ? 'bg-green-500 border-green-500 text-white' 
                                                        : 'bg-white border-slate-300 text-slate-400'
                                            }`}
                                        >
                                            {isCompleted && !isCurrent ? (
                                                <CheckCircleIcon className="h-5 w-5" />
                                            ) : (
                                                <span className="text-xs font-bold">{index + 1}</span>
                                            )}
                                        </div>
                                        <div className={`mt-2 text-xs font-medium transition-colors ${
                                            isCurrent ? 'text-blue-700 font-bold' : isCompleted ? 'text-green-600' : 'text-slate-400'
                                        }`}>
                                            {step}
                                        </div>
                                        
                                        {/* Tooltip detail (optional) */}
                                        {isCurrent && (
                                            <div className="absolute top-10 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                In Progress
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                 )}
            </div>

            {/* Footer: Next Step / Action */}
            <div className="flex flex-col sm:flex-row gap-4">
                {!isRejected && (
                    <div className="flex-grow bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-start gap-3">
                        <div className="bg-blue-100 p-1.5 rounded-full mt-0.5">
                            <BriefcaseIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <h5 className="text-sm font-bold text-slate-800">Current Status: {interaction.applicationStatus}</h5>
                            <p className="text-sm text-slate-500 mt-1">
                                {interaction.applicationStatus === 'Applied' && "Your application has been received. The recruiting team is reviewing your profile."}
                                {interaction.applicationStatus === 'Screening' && "Your profile has passed the initial check. Expect an email for a short screening call."}
                                {interaction.applicationStatus === 'Technical Interview' && "You have been shortlisted for the technical round. Prepare your coding skills!"}
                                {interaction.applicationStatus === 'HR Interview' && "Great job! You made it to the HR round. They will discuss culture fit and salary."}
                                {interaction.applicationStatus === 'Offer' && "Congratulations! An offer letter has been sent to your email."}
                            </p>
                        </div>
                    </div>
                )}

                <button 
                    onClick={() => setShowResume(true)}
                    className="flex-shrink-0 flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 font-semibold px-4 py-3 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition"
                >
                    <DocumentTextIcon className="h-5 w-5 text-slate-500" />
                    <span>View Submitted Resume</span>
                </button>
            </div>
            
            {showResume && (
                <ResumePreviewModal 
                    content={interaction.submittedResume || "No resume text captured for this application."} 
                    onClose={() => setShowResume(false)} 
                />
            )}
        </div>
    );
}

export const AppliedStatusPage: React.FC<AppliedStatusPageProps> = ({ student, interactions, internships }) => {
    // Filter only interactions where the student applied
    const appliedInteractions = interactions.filter(i => i.student_id === student.student_id && i.applied);

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
             <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Application Tracker</h2>
                <p className="text-slate-500">Track the progress of your internship applications in real-time.</p>
            </div>

            <div className="space-y-6">
                {appliedInteractions.length > 0 ? (
                    appliedInteractions.map(interaction => {
                        const internship = internships.find(i => i.internship_id === interaction.internship_id);
                        if (!internship) return null;
                        return <ApplicationCard key={interaction.internship_id} interaction={interaction} internship={internship} />;
                    })
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg border border-slate-200 border-dashed">
                        <BriefcaseIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">No Applications Yet</h3>
                        <p className="text-slate-500">Start exploring internships and apply to see them here!</p>
                    </div>
                )}
            </div>
        </div>
    );
};
