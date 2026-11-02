
import React, { useState } from 'react';
import type { Recruiter } from '../types';
import { AcademicCapIcon } from './icons/AcademicCapIcon';

interface RecruiterLoginPageProps {
  onLogin: (email: string) => void;
  onRegister: (userData: { name: string; email: string; company: string }) => void;
  onNavigateToStudentPortal: () => void;
  isLoading: boolean;
  recruiters: Recruiter[];
}

const FormInput: React.FC<any> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input id={id} className="w-full bg-white border border-slate-300 rounded-md p-2.5 text-sm text-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" {...props} />
    </div>
);

export const RecruiterLoginPage: React.FC<RecruiterLoginPageProps> = ({ onLogin, onRegister, onNavigateToStudentPortal, isLoading, recruiters }) => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    
    // Login state
    const [loginEmail, setLoginEmail] = useState(recruiters[0]?.email || '');

    // Registration state
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regCompany, setRegCompany] = useState('');

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(loginEmail);
    };
    
    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister({ name: regName, email: regEmail, company: regCompany });
    };

    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                      <AcademicCapIcon className="h-6 w-6 text-white" />
                   </div>
                   <div>
                     <h1 className="text-xl font-bold text-slate-800 tracking-tight">Internship<span className="text-blue-600">Portal</span></h1>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">PM Internship Scheme</p>
                   </div>
                </div>
                <button onClick={onNavigateToStudentPortal} className="bg-blue-500 text-white font-bold text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition">Student Portal</button>
            </div>
        </header>

        <main className="flex-grow flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg">
                <div className="p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">
                            {mode === 'login' ? 'Recruiter Sign In' : 'Recruiter Sign Up'}
                        </h2>
                        <p className="text-slate-500 mt-1">
                            {mode === 'login' ? 'Access your dashboard to manage jobs.' : 'Create an account to start posting jobs.'}
                        </p>
                    </div>

                    <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
                        <button
                            type="button"
                            onClick={() => setMode('login')}
                            className={`w-1/2 py-2 text-sm font-bold transition-all rounded-md ${mode === 'login' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('register')}
                            className={`w-1/2 py-2 text-sm font-bold transition-all rounded-md ${mode === 'register' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                            Sign Up
                        </button>
                    </div>
                    
                    {mode === 'login' ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div>
                               <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                               <select id="login-email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full bg-white border border-slate-300 rounded-md p-2.5 text-sm text-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                                 {recruiters.map(r => <option key={r.recruiter_id} value={r.email}>{r.name} ({r.email})</option>)}
                               </select>
                            </div>
                            <FormInput label="Password" id="password-login" type="password" placeholder="••••••••" value="dummypassword" readOnly />
                            <button type="submit" disabled={isLoading || !loginEmail} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all disabled:bg-slate-400">
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                    ) : (
                       <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <FormInput label="Full Name" id="name" value={regName} onChange={(e: any) => setRegName(e.target.value)} required placeholder="Jane Doe"/>
                            <FormInput label="Company Name" id="company" value={regCompany} onChange={(e: any) => setRegCompany(e.target.value)} required placeholder="TechCorp Inc."/>
                            <FormInput label="Email Address" id="email-reg" value={regEmail} onChange={(e: any) => setRegEmail(e.target.value)} placeholder="you@company.com" type="email" required />
                            <FormInput label="Password" id="password-reg" value="" onChange={() => {}} placeholder="••••••••" type="password" required/>
                            
                            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all disabled:bg-slate-400">
                                 {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>
                       </form>
                    )}
                </div>
            </div>
        </main>
      </div>
    );
};
