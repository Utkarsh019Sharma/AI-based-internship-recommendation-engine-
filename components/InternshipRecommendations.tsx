
import React, { useState } from 'react';
import type { Recommendation, Student, Interaction } from '../types';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { SkillGapAnalysis } from './SkillGapAnalysis';
import { AICoachModal } from './AICoachModal';
import { ChatBubbleLeftRightIcon } from './icons/ChatBubbleLeftRightIcon';
import { CareerPathVisualizer } from './CareerPathVisualizer';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { MapIcon } from './icons/MapIcon';
import { BanknotesIcon } from './icons/BanknotesIcon';
import { ArrowUpTrayIcon } from './icons/ArrowUpTrayIcon';
import { SparklesIcon } from './icons/SparklesIcon';

const ScoreBar: React.FC<{ score: number; label: string; color: string }> = ({ score, label, color }) => (
    <div className="w-full">
        <div className="flex justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{label}</span>
            <span className={`text-xs font-bold ${color}`}>{Math.round(score * 100)}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div className={`bg-gradient-to-r ${color === 'text-blue-600' ? 'from-blue-400 to-blue-600' : 'from-green-400 to-green-600'} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${score * 100}%` }}></div>
        </div>
    </div>
);


const InternshipDetailModal: React.FC<{
    internship: Recommendation;
    student: Student;
    onClose: () => void;
    isApplied: boolean;
    onApply: (internshipId: number) => void;
}> = ({ internship, student, onClose, isApplied, onApply }) => {
    const [isCoachOpen, setIsCoachOpen] = useState(false);

    const handleApplyClick = () => {
        if (internship.externalLink) {
            window.open(internship.externalLink, '_blank');
        } else {
            onApply(internship.internship_id);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-200">
                    <div className="relative">
                        <div className={`h-24 w-full ${internship.logoColor} opacity-10 rounded-t-xl`}></div>
                        <button onClick={onClose} className="absolute top-4 right-4 bg-white rounded-full p-1 text-slate-400 hover:text-slate-600 shadow-sm hover:shadow-md transition">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                        
                        <div className="px-8 pb-8 -mt-10">
                            <div className="flex items-end gap-4 mb-4">
                                <div className={`h-20 w-20 rounded-lg ${internship.logoColor} flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white`}>
                                    {internship.company.charAt(0)}
                                </div>
                                <div className="mb-2">
                                    <h3 className="text-2xl font-bold text-slate-900 leading-tight">{internship.title}</h3>
                                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                                        <BriefcaseIcon className="h-4 w-4" />
                                        {internship.company}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-6 border-y border-slate-100 py-4">
                                <div className="flex items-center gap-1.5">
                                    <MapIcon className="h-4 w-4 text-slate-400" />
                                    {internship.location}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <BanknotesIcon className="h-4 w-4 text-slate-400" />
                                    <span className="font-semibold text-slate-800">{internship.stipend}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <BriefcaseIcon className="h-4 w-4 text-slate-400" />
                                    {internship.domain}
                                </div>
                                {internship.source && (
                                     <div className="flex items-center gap-1.5">
                                        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded border border-slate-200">
                                            Via {internship.source}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">Description</h4>
                                <p className="text-slate-600 leading-relaxed">{internship.description}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                 <button 
                                    onClick={handleApplyClick}
                                    disabled={isApplied}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
                                >
                                    {isApplied ? (
                                        <>
                                            <CheckCircleIcon className="h-5 w-5" />
                                            Application Sent
                                        </>
                                    ) : internship.externalLink ? (
                                        <>
                                            <ArrowUpTrayIcon className="h-5 w-5 rotate-90" />
                                            Apply on {internship.source || 'Website'}
                                        </>
                                    ) : (
                                        "Apply for Internship"
                                    )}
                                </button>
                                 <button 
                                    onClick={() => setIsCoachOpen(true)}
                                    className="w-full flex items-center justify-center gap-2 bg-white text-indigo-600 border border-indigo-200 font-bold py-3 px-4 rounded-lg hover:bg-indigo-50 transition"
                                >
                                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                                    Ask AI Coach
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Skills Required</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {internship.required_skills.map(skill => (
                                            <span key={skill} className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-md border border-slate-200">{skill}</span>
                                        ))}
                                    </div>
                                </div>

                                <SkillGapAnalysis student={student} internship={internship} />
                                <CareerPathVisualizer student={student} internship={internship} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isCoachOpen && (
                <AICoachModal
                    student={student}
                    internship={internship}
                    onClose={() => setIsCoachOpen(false)}
                />
            )}
        </>
    );
};

const isNew = (postedDate: string): boolean => {
    const postDate = new Date(postedDate);
    const today = new Date();
    const daysOld = (today.getTime() - postDate.getTime()) / (1000 * 3600 * 24);
    return daysOld <= 3;
}

interface InternshipRecommendationsProps {
  recommendations: Recommendation[];
  student: Student | null;
  interactions: Interaction[];
  onApply: (internshipId: number) => void;
}

export const InternshipRecommendations: React.FC<InternshipRecommendationsProps> = ({ recommendations, student, interactions, onApply }) => {
  const [selectedInternship, setSelectedInternship] = useState<Recommendation | null>(null);

  const handleViewDetails = (internship: Recommendation) => {
    setSelectedInternship(internship);
  };

  const handleCloseModal = () => {
    setSelectedInternship(null);
  };

  const handleExternalApply = (url: string) => {
      window.open(url, '_blank');
  }

  if (!student) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-slate-100 rounded-lg"></div>
                ))}
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {recommendations.map((rec) => {
            const isApplied = interactions.some(i => i.student_id === student.student_id && i.internship_id === rec.internship_id && i.applied);

            return (
              <div key={rec.internship_id} className="group bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col sm:flex-row gap-4">
                {/* Logo Section */}
                <div className="flex-shrink-0">
                    <div className={`h-14 w-14 rounded-lg ${rec.logoColor} flex items-center justify-center text-white text-xl font-bold shadow-sm group-hover:scale-105 transition-transform`}>
                        {rec.company.charAt(0)}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start mb-1">
                         <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h4 className="text-lg font-bold text-slate-900 truncate pr-2 group-hover:text-blue-600 transition-colors">{rec.title}</h4>
                            {rec.score > 0.6 && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-tight">
                                    <SparklesIcon className="h-3 w-3" /> High Match
                                </span>
                            )}
                         </div>
                         {isNew(rec.postedDate) && (
                              <span className="flex-shrink-0 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full uppercase tracking-wide">New</span>
                          )}
                    </div>
                    
                    <p className="text-sm font-semibold text-slate-700 mb-2">{rec.company}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 mb-3">
                        <div className="flex items-center gap-1">
                            <MapIcon className="h-3.5 w-3.5" />
                            {rec.location}
                        </div>
                        <div className="flex items-center gap-1">
                            <BanknotesIcon className="h-3.5 w-3.5" />
                            {rec.stipend}
                        </div>
                        {rec.source && (
                             <div className="flex items-center gap-1">
                                <span className="bg-slate-100 border border-slate-200 px-1.5 rounded text-[10px] uppercase font-bold tracking-wider text-slate-500">
                                    {rec.source}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* AI Score Bars */}
                    <div className="grid grid-cols-2 gap-3 max-w-xs">
                        <ScoreBar score={rec.contentBasedScore} label="Skill Match" color="text-blue-600" />
                        <ScoreBar score={rec.collaborativeScore} label="Community Match" color="text-green-600" />
                    </div>
                </div>

                {/* Action Section */}
                <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-end gap-2 sm:border-l sm:border-slate-100 sm:pl-4 mt-2 sm:mt-0">
                     {isApplied ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                             <CheckCircleIcon className="h-3.5 w-3.5" /> Applied
                        </span>
                     ) : rec.externalLink ? (
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleExternalApply(rec.externalLink!); }}
                            className="text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded transition whitespace-nowrap"
                        >
                            Apply on {rec.source}
                        </button>
                     ) : (
                         <div className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                             Apply by 25th
                         </div>
                     )}

                    <button 
                        onClick={() => handleViewDetails(rec)}
                        className="bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-bold py-2 px-5 rounded-lg transition text-sm whitespace-nowrap"
                    >
                        View Details
                    </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200 border-dashed">
            <p className="text-slate-500">No internships found matching your search criteria.</p>
        </div>
      )}

      {selectedInternship && student && (
        <InternshipDetailModal
          internship={selectedInternship}
          student={student}
          onClose={handleCloseModal}
          isApplied={interactions.some(i => i.student_id === student.student_id && i.internship_id === selectedInternship.internship_id && i.applied)}
          onApply={onApply}
        />
      )}
    </div>
  );
};
