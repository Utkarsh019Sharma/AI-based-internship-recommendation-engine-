import React, { useState, useEffect } from 'react';
import type { Student } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';

interface MyProfileModalProps {
  student: Student;
  onClose: () => void;
  onSave: (updatedStudent: Student) => void;
}

interface FormSectionProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, description, children }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-200 pt-5 mt-5 first:border-t-0 first:pt-0 first:mt-0">
        <div className="md:col-span-1">
            <h3 className="font-semibold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
        <div className="md:col-span-2 space-y-4">
            {children}
        </div>
    </div>
);

const FormInput: React.FC<any> = ({ label, id, as = 'input', ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
        {as === 'input' && <input id={id} className="w-full border border-slate-300 rounded-md p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" {...props} />}
        {as === 'textarea' && <textarea id={id} className="w-full border border-slate-300 rounded-md p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" {...props} />}
        {as === 'select' && <select id={id} className="w-full border border-slate-300 rounded-md p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" {...props} />}
    </div>
);

export const MyProfileModal: React.FC<MyProfileModalProps> = ({ student, onClose, onSave }) => {
    // Form state initialized from student prop
    const [name, setName] = useState(student.name);
    const [email, setEmail] = useState(student.email);
    const [academicScore, setAcademicScore] = useState(student.academic_score?.toString() || '');
    const [location, setLocation] = useState(student.location || 'Urban');
    const [skills, setSkills] = useState(student.skills.join(', '));
    const [interests, setInterests] = useState(student.interests.join(', '));
    const [education, setEducation] = useState(student.education.join('\n'));
    const [achievements, setAchievements] = useState(student.achievements.join('\n'));
    const [certificates, setCertificates] = useState(student.certificates.join('\n'));
    const [resumeText, setResumeText] = useState(student.resumeText);

    const handleSave = () => {
        const score = parseFloat(academicScore);
        const updatedStudent: Student = {
            ...student,
            name,
            email,
            academic_score: isNaN(score) ? null : score,
            location: location as 'Urban' | 'Rural',
            skills: skills.split(',').map(s => s.trim()).filter(Boolean),
            interests: interests.split(',').map(i => i.trim()).filter(Boolean),
            education: education.split('\n').map(s => s.trim()).filter(Boolean),
            achievements: achievements.split('\n').map(s => s.trim()).filter(Boolean),
            certificates: certificates.split('\n').map(s => s.trim()).filter(Boolean),
            resumeText,
        };
        onSave(updatedStudent);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start z-50 p-4 transition-opacity overflow-y-auto">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl my-8">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-slate-900">My Profile</h3>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                     <p className="text-sm text-slate-500 mt-1">Update your profile to get the best internship matches.</p>
                </div>

                <div className="px-6 pb-6">
                    <FormSection title="Personal Information" description="Your basic details and contact info.">
                        <FormInput label="Full Name" id="name" value={name} onChange={(e: any) => setName(e.target.value)} required />
                        <FormInput label="Email Address" id="email" value={email} onChange={(e: any) => setEmail(e.target.value)} type="email" required />
                    </FormSection>

                     <FormSection title="Academic & Location" description="Your educational background and location preference.">
                        <FormInput label="Academic Score (0.0 - 5.0)" id="score" value={academicScore} onChange={(e: any) => setAcademicScore(e.target.value)} type="number" placeholder="e.g., 4.8" />
                        <FormInput as="select" label="Location Preference" id="location" value={location} onChange={(e: any) => setLocation(e.target.value)}>
                            <option value="Urban">Urban</option>
                            <option value="Rural">Rural</option>
                        </FormInput>
                    </FormSection>

                    <FormSection title="Skills & Interests" description="List your technical skills and professional interests, separated by commas.">
                        <FormInput label="Skills" id="skills" value={skills} onChange={(e: any) => setSkills(e.target.value)} placeholder="e.g., Python, React, SQL" />
                        <FormInput label="Interests" id="interests" value={interests} onChange={(e: any) => setInterests(e.target.value)} placeholder="e.g., AI, FinTech, Web Development" />
                    </FormSection>
                    
                     <FormSection title="Professional Background" description="List one item per line for education, achievements, and certificates.">
                        <FormInput as="textarea" rows={3} label="Education" id="education" value={education} onChange={(e: any) => setEducation(e.target.value)} placeholder="e.g., B.S. in Computer Science, Stanford University" />
                        <FormInput as="textarea" rows={3} label="Achievements" id="achievements" value={achievements} onChange={(e: any) => setAchievements(e.target.value)} placeholder="e.g., Winner, University Hackathon 2023" />
                        <FormInput as="textarea" rows={3} label="Certificates" id="certificates" value={certificates} onChange={(e: any) => setCertificates(e.target.value)} placeholder="e.g., Certified TensorFlow Developer" />
                    </FormSection>

                    <FormSection title="Resume" description="Paste your full resume text here for AI analysis to infer additional skills.">
                         <FormInput as="textarea" rows={8} label="Resume Text" id="resumeText" value={resumeText} onChange={(e: any) => setResumeText(e.target.value)} placeholder="Paste resume text here..." />
                    </FormSection>
                </div>

                <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg sticky bottom-0">
                    <button type="button" onClick={onClose} className="bg-white text-slate-700 font-bold py-2 px-4 rounded-lg border border-slate-300 hover:bg-slate-100 transition">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSave} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
