import React, { useState } from 'react';
import type { Student } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';

interface AddStudentModalProps {
  onClose: () => void;
  onAddStudent: (newStudent: Omit<Student, 'student_id' | 'past_internship_views'>) => void;
}

// A simple form input component to reduce repetition
const FormInput: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; required?: boolean; placeholder?: string }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input id={id} className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" {...props} />
    </div>
);

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, onAddStudent }) => {
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
            // AI-enriched fields will be populated later
            softSkills: [],
            skillProficiencies: [],
            education: [],
            achievements: [],
            certificates: [],
        };
        onAddStudent(newStudent);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 transition-opacity">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex justify-between items-start">
                            <h3 className="text-2xl font-bold text-slate-900">Add New Student</h3>
                            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="mt-4 space-y-4">
                            <FormInput label="Full Name" id="name" value={name} onChange={e => setName(e.target.value)} required />
                            <FormInput label="Email" id="email" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
                            <FormInput label="Skills (comma-separated)" id="skills" value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g., Python, React, SQL" />
                            <FormInput label="Interests (comma-separated)" id="interests" value={interests} onChange={e => setInterests(e.target.value)} placeholder="e.g., AI, FinTech" />
                            <FormInput label="Academic Score (0.0 - 5.0)" id="score" value={academicScore} onChange={e => setAcademicScore(e.target.value)} type="number" required />
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                <select 
                                    id="location" 
                                    value={location} 
                                    onChange={e => setLocation(e.target.value as 'Urban' | 'Rural')}
                                    className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                >
                                    <option value="Urban">Urban</option>
                                    <option value="Rural">Rural</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="resumeText" className="block text-sm font-medium text-slate-700 mb-1">Resume Text (Optional)</label>
                                <textarea
                                    id="resumeText"
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    rows={4}
                                    className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="Paste resume text here for AI analysis later..."
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                        <button type="button" onClick={onClose} className="bg-white text-slate-700 font-bold py-2 px-4 rounded-lg border border-slate-300 hover:bg-slate-100 transition">
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                            Add Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};