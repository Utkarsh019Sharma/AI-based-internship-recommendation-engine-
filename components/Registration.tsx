import React, { useState } from 'react';
import type { Student } from '../types';
import { AcademicCapIcon } from './icons/AcademicCapIcon';

interface RegistrationProps {
  onRegister: (newStudent: Omit<Student, 'student_id' | 'past_internship_views'>) => void;
  isLoading: boolean;
}

const FormInput: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void; type?: string; required?: boolean; placeholder?: string; as?: 'input' | 'textarea' | 'select'; children?: React.ReactNode; rows?: number }> = ({ label, id, as = 'input', ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        {as === 'input' && <input id={id} className="w-full border border-slate-300 rounded-md p-2.5 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" {...props as any} />}
        {as === 'textarea' && <textarea id={id} className="w-full border border-slate-300 rounded-md p-2.5 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" {...props as any} />}
        {as === 'select' && <select id={id} className="w-full border border-slate-300 rounded-md p-2.5 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" {...props as any} />}
    </div>
);


export const Registration: React.FC<RegistrationProps> = ({ onRegister, isLoading }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [skills, setSkills] = useState('');
    const [interests, setInterests] = useState('');
    const [academicScore, setAcademicScore] = useState('');
    const [location, setLocation] = useState<'Urban' | 'Rural'>('Urban');
    const [resumeText, setResumeText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const score = parseFloat(academicScore);
        if (isNaN(score) || score < 0 || score > 5) {
            alert("Please enter a valid academic score between 0 and 5.");
            return;
        }

        const newStudent = {
            name,
            email,
            skills: skills.split(',').map(s => s.trim()).filter(Boolean),
            interests: interests.split(',').map(i => i.trim()).filter(Boolean),
            academic_score: score,
            location,
            resumeText,
            softSkills: [],
            skillProficiencies: [],
            education: [],
            achievements: [],
            certificates: [],
        };
        onRegister(newStudent);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-6">
                        <div className="inline-block bg-blue-500 p-3 rounded-full mb-2">
                           <AcademicCapIcon className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800">Internship Recommender</h1>
                        <p className="text-slate-500 mt-1">Create your profile to find the perfect internship.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Full Name" id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g., Alice Johnson"/>
                             <FormInput label="Academic Score (0.0 - 5.0)" id="score" value={academicScore} onChange={e => setAcademicScore(e.target.value)} type="number" required placeholder="e.g., 4.8" />
                        </div>
                        <FormInput label="Email" id="email" value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="alice@example.com" />
                        <FormInput label="Skills (comma-separated)" id="skills" value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g., Python, React, SQL" />
                        <FormInput label="Interests (comma-separated)" id="interests" value={interests} onChange={e => setInterests(e.target.value)} placeholder="e.g., AI, FinTech, Web Development" />
                         <FormInput as="select" label="Location Preference" id="location" value={location} onChange={e => setLocation(e.target.value as 'Urban' | 'Rural')}>
                            <option value="Urban">Urban</option>
                            <option value="Rural">Rural</option>
                        </FormInput>
                        <FormInput as="textarea" rows={5} label="Paste Your Resume" id="resumeText" value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste your resume here for AI analysis..." />
                        
                        <button 
                            type="submit" 
                            className="w-full flex items-center justify-center bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out disabled:bg-slate-400"
                            disabled={isLoading}
                        >
                             {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Profile...
                                </>
                            ) : "Find My Internships"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};