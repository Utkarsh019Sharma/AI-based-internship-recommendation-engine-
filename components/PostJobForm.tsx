
import React, { useState } from 'react';
import type { Job } from '../types';

interface PostJobFormProps {
    recruiterId: number;
    onPostJob: (jobData: Omit<Job, 'job_id' | 'postedDate' | 'isActive'>) => void;
    onSwitchToManage: () => void;
}

const FormInput: React.FC<any> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input id={id} className="w-full bg-white border border-slate-300 rounded-md p-2.5 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-slate-900" {...props} />
    </div>
);

const FormTextarea: React.FC<any> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea id={id} className="w-full bg-white border border-slate-300 rounded-md p-2.5 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-slate-900" {...props} />
    </div>
);

const FormSelect: React.FC<any> = ({ label, id, children, ...props }) => (
     <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <select id={id} className="w-full border border-slate-300 rounded-md p-2.5 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-slate-900" {...props}>
          {children}
        </select>
    </div>
);

export const PostJobForm: React.FC<PostJobFormProps> = ({ recruiterId, onPostJob, onSwitchToManage }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        level: 'Internship' as Job['level'],
        salary: '',
        required_skills: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const jobData = { 
            ...formData, 
            recruiter_id: recruiterId,
            required_skills: formData.required_skills.split(',').map(s => s.trim()).filter(Boolean)
        };
        await onPostJob(jobData);
        setIsSubmitting(false);
        // Reset form and switch tab
        setFormData({ title: '', description: '', category: '', location: '', level: 'Internship', salary: '', required_skills: '' });
        onSwitchToManage();
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Post a New Job</h2>
            <p className="text-sm text-slate-500 mb-6">Fill out the details below to create a new job listing.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label="Job Title" id="title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g., Software Engineer Intern" />
                    <FormInput label="Job Category" id="category" name="category" value={formData.category} onChange={handleChange} required placeholder="e.g., Software Development" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput label="Job Location" id="location" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g., Remote" />
                    <FormSelect label="Job Level" id="level" name="level" value={formData.level} onChange={handleChange} required>
                        <option value="Internship">Internship</option>
                        <option value="Entry-Level">Entry-Level</option>
                        <option value="Mid-Level">Mid-Level</option>
                    </FormSelect>
                     <FormInput label="Job Salary / Stipend" id="salary" name="salary" value={formData.salary} onChange={handleChange} required placeholder="e.g., $30/hour or Competitive" />
                </div>
                <FormInput label="Required Skills (comma separated)" id="required_skills" name="required_skills" value={formData.required_skills} onChange={handleChange} required placeholder="e.g., React, Python, Communication" />
                <FormTextarea label="Job Description" id="description" name="description" value={formData.description} onChange={handleChange} required rows={5} placeholder="Describe the role and responsibilities..." />
                <div className="pt-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all disabled:bg-slate-400"
                    >
                        {isSubmitting ? 'Posting...' : 'Post Job'}
                    </button>
                </div>
            </form>
        </div>
    );
};
