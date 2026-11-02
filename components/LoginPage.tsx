
import React, { useState } from 'react';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';

interface LoginPageProps {
  onLogin: (email: string) => void;
  onNavigateToRegister: () => void;
  onNavigateToRecruiter: () => void;
  isLoading: boolean;
}

const LoginHeader: React.FC<{ onNavigateToRegister: () => void; onNavigateToRecruiter: () => void; }> = ({ onNavigateToRegister, onNavigateToRecruiter }) => (
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
            <div className="flex items-center gap-2">
                <button className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-2 rounded-md">Login</button>
                <button onClick={onNavigateToRegister} className="bg-slate-100 text-slate-600 font-bold text-sm px-4 py-2 rounded-md hover:bg-slate-200 transition">Register</button>
                <button onClick={onNavigateToRecruiter} className="bg-indigo-500 text-white font-bold text-sm px-4 py-2 rounded-md hover:bg-indigo-600 transition">Recruiter Interface</button>
            </div>
        </div>
    </header>
);

const LoginFooter: React.FC = () => (
    <footer className="bg-white text-slate-700 mt-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 grid grid-cols-2 gap-8">
            <div><h3 className="font-bold mb-2">Student Section</h3><ul className="space-y-1 text-sm text-slate-500"><li>Registration</li><li>Login</li></ul></div>
            <div><h3 className="font-bold mb-2">Company Section</h3><ul className="space-y-1 text-sm text-slate-500"><li>Registration</li><li>Login</li></ul></div>
        </div>
    </footer>
);


export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToRegister, onNavigateToRecruiter, isLoading }) => {
    const [email, setEmail] = useState('utkarsh@example.com');
    const [password, setPassword] = useState('password123');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email);
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <LoginHeader onNavigateToRegister={onNavigateToRegister} onNavigateToRecruiter={onNavigateToRecruiter} />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <section className="pt-4 max-w-lg mx-auto space-y-4">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">Student Login</h2>
                                <p className="text-slate-500">Welcome back! Please login to your account.</p>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-md p-2 text-sm text-slate-900 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                                    required
                                    placeholder="E-mail"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white border border-slate-300 rounded-md p-2 text-sm text-slate-900 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                                        required
                                        placeholder="Password"
                                    />
                                    <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500">
                                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm font-semibold text-blue-600">
                                <a href="#" className="hover:underline">Forgot Password</a>
                                <a href="#" className="hover:underline">Verify Email</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToRegister(); }} className="hover:underline">Register Now</a>
                            </div>

                            <div className="flex flex-col items-center justify-center pt-4">
                                <button
                                    type="submit"
                                    className="w-full max-w-sm bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out disabled:bg-slate-400"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Logging in...' : 'Login'}
                                </button>
                            </div>
                        </section>
                    </form>
                </div>
            </main>
            <LoginFooter />
        </div>
    );
};
