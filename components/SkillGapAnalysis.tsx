
import React, { useState, useCallback } from 'react';
import type { Student, Internship } from '../types';
import { getSkillGap } from '../services/recommendationService';
import { generateLearningPlan } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';

interface SkillGapAnalysisProps {
  student: Student;
  internship: Internship;
}

const AILearningPlan: React.FC<{ skill: string }> = ({ skill }) => {
    const [plan, setPlan] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePlan = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateLearningPlan(skill);
            setPlan(result);
        } catch (e) {
            setError('Failed to generate plan.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [skill]);

    return (
        <div className="mt-2">
            {!plan && !isLoading && (
                 <button 
                    onClick={handleGeneratePlan}
                    className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-semibold transition"
                    disabled={isLoading}
                 >
                    <SparklesIcon className="h-4 w-4" />
                    <span>Generate Learning Plan with AI</span>
                 </button>
            )}
            {isLoading && <p className="text-xs text-slate-500 animate-pulse">Generating plan...</p>}
            {error && <p className="text-xs text-red-500">{error}</p>}
            {plan && (
                <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 whitespace-pre-wrap font-mono">
                    {plan}
                </div>
            )}
        </div>
    );
};

export const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({ student, internship }) => {
  const missingSkills = getSkillGap(student.skills, internship.required_skills);

  if (missingSkills.length === 0) {
    return (
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-semibold text-green-800">Excellent Match!</h4>
        <p className="text-sm text-green-700">You have all the required skills for this internship.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold text-slate-800 mb-2">Skill Gap Analysis</h4>
      <p className="text-sm text-slate-600 mb-4">Here are some skills you can learn to be a stronger candidate:</p>
      <div className="space-y-4">
        {missingSkills.map(({ skill }) => (
          <div key={skill} className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 bg-amber-100 rounded-full p-2">
                <BookOpenIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-amber-800">{skill}</p>
                <p className="text-xs text-amber-600">Consider exploring this skill.</p>
              </div>
            </div>
            <AILearningPlan skill={skill} />
          </div>
        ))}
      </div>
    </div>
  );
};
