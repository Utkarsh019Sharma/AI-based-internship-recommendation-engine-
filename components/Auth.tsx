import React, { useState } from 'react';
import type { Student } from '../types';
import { AuthIllustrationPanel } from './AuthIllustrationPanel';
import { GoogleIcon } from './icons/GoogleIcon';
import { GithubIcon } from './icons/GithubIcon';


interface AuthProps {
    onLogin: (studentId: number) => void;
    onRegister: (userData: { name: string; email: string; }) => void;
    students: Student[];
    isLoading: boolean;
}

const FormInput: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; type?: string; required?: boolean; placeholder?: string; as?: 'input' | 'select'; children?: React.ReactNode; }> = ({ label, id, as = 'input', ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
        {as === 'input' && <input id={id} className="w-full border border-slate-300 rounded-md p-2.5 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" {...props as any} />}
        {as === 'select' && <select id={id} className="w-full border border-slate-300 rounded-md p-2.5 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" {...props as any} />}
    </div>
);

const SocialButton: React.FC<{ icon: React.ReactNode; label: string; }> = ({ icon, label }) => (
    <button type="button" className="w-full inline-flex justify-center items-center gap-3 py-2.5 px-4 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition">
        {icon}
        {label}
    </button>
);


export const Auth: React.FC<AuthProps> = ({ onLogin, onRegister, students, isLoading }) => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    
    // Login state
    const [selectedStudentId, setSelectedStudentId] = useState<number | undefined>(students[0]?.student_id);

    // Registration state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedStudentId) {
            onLogin(selectedStudentId);
        } else {
            alert("Please select a student profile to log in.");
        }
    };
    
    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister({ name, email });
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            <div className="flex justify-center items-center min-h-screen p-4">
                <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl grid lg:grid-cols-2 overflow-hidden">
                    <AuthIllustrationPanel />

                    <div className="p-8 sm:p-12 flex flex-col justify-center">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-slate-800">
                                {mode === 'login' ? 'Welcome Back!' : 'Create an Account'}
                            </h1>
                            <p className="text-slate-500 mt-2">
                                {mode === 'login' ? 'Sign in to access your dashboard.' : 'Get started by creating your profile.'}
                            </p>
                        </div>

                        <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
                            <button
                                type="button"
                                onClick={() => setMode('login')}
                                className={`w-1/2 py-2.5 text-sm font-bold transition-all rounded-md ${mode === 'login' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-200'}`}
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode('register')}
                                className={`w-1/2 py-2.5 text-sm font-bold transition-all rounded-md ${mode === 'register' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-200'}`}
                            >
                                Sign Up
                            </button>
                        </div>
                        
                        {mode === 'login' ? (
                            <form onSubmit={handleLoginSubmit} className="space-y-5">
                                <FormInput as="select" label="Select Profile (for demo)" id="student-select" value={selectedStudentId?.toString() || ''} onChange={e => setSelectedStudentId(Number(e.target.value))}>
                                    {students.map(s => <option key={s.student_id} value={s.student_id}>{s.name}</option>)}
                                </FormInput>
                                <div>
                                    <label htmlFor="password-login" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                                    <input id="password-login" type="password" placeholder="••••••••" value="dummypassword" readOnly className="w-full border border-slate-300 rounded-md p-2.5 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-slate-50 cursor-not-allowed"/>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="remember-me" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                        <label htmlFor="remember-me" className="text-slate-600">Remember me</label>
                                    </div>
                                    <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">Forgot password?</a>
                                </div>

                                <button type="submit" disabled={isLoading || !selectedStudentId} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all disabled:bg-slate-400">
                                    Sign In
                                </button>
                                
                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-slate-300" /></div>
                                    <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-slate-500">Or continue with</span></div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                   <SocialButton icon={<GoogleIcon />} label="Google" />
                                   <SocialButton icon={<GithubIcon />} label="GitHub" />
                                </div>
                            </form>
                        ) : (
                           <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                <FormInput label="Full Name" id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="Alice Johnson"/>
                                <FormInput label="Email Address" id="email-reg" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" required />
                                <FormInput label="Password" id="password-reg" value="" onChange={() => {}} placeholder="••••••••" type="password" required/>
                                
                                <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all disabled:bg-slate-400">
                                     {isLoading ? 'Creating Profile...' : 'Create Account'}
                                </button>
                           </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
