
import React, { useState } from 'react';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';

interface RegistrationPageProps {
  onRegister: (userData: {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
  }) => void;
  isLoading: boolean;
  onNavigateToLogin: () => void;
  onNavigateToRecruiter: () => void;
}

const RegistrationHeader: React.FC<{ onNavigateToLogin: () => void; onNavigateToRecruiter: () => void; }> = ({ onNavigateToLogin, onNavigateToRecruiter }) => (
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
                <button onClick={onNavigateToLogin} className="text-sm font-semibold text-slate-600 hover:text-blue-600 px-3 py-2">Login</button>
                <button className="bg-blue-500 text-white font-bold text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition">Register</button>
                <button onClick={onNavigateToRecruiter} className="bg-indigo-500 text-white font-bold text-sm px-4 py-2 rounded-md hover:bg-indigo-600 transition">Recruiter Interface</button>
            </div>
        </div>
    </header>
);

const RegistrationFooter: React.FC = () => (
    <footer className="bg-white text-slate-700 mt-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 grid grid-cols-2 gap-8">
            <div>
                <h3 className="font-bold mb-2">Student Section</h3>
                <ul className="space-y-1 text-sm text-slate-500">
                    <li>Registration</li>
                    <li>Login</li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold mb-2">Company Section</h3>
                <ul className="space-y-1 text-sm text-slate-500">
                    <li>Registration</li>
                    <li>Login</li>
                </ul>
            </div>
        </div>
    </footer>
);

const FormInput: React.FC<any> = ({ label, id, required, formData, handleChange, ...props }) => (
    <div className="w-full">
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input 
            id={id}
            name={id}
            onChange={handleChange}
            value={formData[id as keyof typeof formData] as string}
            className="w-full bg-white border border-slate-300 rounded-md p-2 text-sm text-slate-900 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
            required={required}
            {...props} 
        />
    </div>
);

const FormSelect: React.FC<any> = ({ label, id, required, children, formData, handleChange }) => (
    <div className="w-full">
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
            id={id}
            name={id}
            onChange={handleChange}
            value={formData[id as keyof typeof formData] as string}
            className="w-full border border-slate-300 rounded-md p-2 text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
            required={required}
        >
            {children}
        </select>
    </div>
);

const PasswordInput: React.FC<any> = ({ label, id, required, show, onToggle, formData, handleChange }) => (
     <div className="w-full">
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <input
                id={id}
                name={id}
                type={show ? 'text' : 'password'}
                onChange={handleChange}
                value={formData[id as keyof typeof formData] as string}
                className="w-full bg-white border border-slate-300 rounded-md p-2 text-sm text-slate-900 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                required={required}
                placeholder="Password"
            />
            <button type="button" onClick={onToggle} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500">
                {show ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
        </div>
    </div>
)

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ onRegister, isLoading, onNavigateToLogin, onNavigateToRecruiter }) => {
    const [formData, setFormData] = useState({
        instituteName: '',
        firstName: '',
        middleName: '',
        lastName: '',
        contactNumber: '',
        studentId: '',
        email: '',
        aadhar: '',
        securityQuestion: 'What is the Pet Name',
        securityAnswer: '',
        gender: '',
        category: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'radio') {
            // @ts-ignore
            setFormData(prev => ({ ...prev, [name]: value === 'true' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        onRegister({
            firstName: formData.firstName,
            middleName: formData.middleName,
            lastName: formData.lastName,
            email: formData.email,
        });
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <RegistrationHeader onNavigateToLogin={onNavigateToLogin} onNavigateToRecruiter={onNavigateToRecruiter} />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-800">Registration</h2>
                        <div className="mt-2 h-1 w-20 bg-blue-500 mx-auto"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        <section className="border border-blue-400 rounded-lg p-6 space-y-4">
                            <FormInput formData={formData} handleChange={handleChange} label="Name of University/College/Institute" id="instituteName" required placeholder="Enter your Institute" />
                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" id="confirm-details" className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-slate-400" required />
                                <label htmlFor="confirm-details" className="font-semibold text-slate-700">I confirm the above details are correct</label>
                            </div>
                        </section>
                        
                        <section className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                               <FormInput formData={formData} handleChange={handleChange} label="First Name" id="firstName" required placeholder="First Name" />
                               <FormInput formData={formData} handleChange={handleChange} label="Middle Name" id="middleName" placeholder="Middle Name" />
                               <FormInput formData={formData} handleChange={handleChange} label="Last Name" id="lastName" required placeholder="Last Name" />
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                               <FormInput formData={formData} handleChange={handleChange} label="Contact Number" id="contactNumber" type="tel" required placeholder="Contact Number" />
                               <FormInput formData={formData} handleChange={handleChange} label="Student ID (Enrolment Number)" id="studentId" required placeholder="Student ID" />
                               <div>
                                 <label className="block text-sm font-medium text-slate-700 mb-1">Upload Resume <span className="text-red-500">*</span> <span className="text-xs text-slate-500">(Size &lt; 5mb)</span></label>
                                 <input type="file" accept=".pdf,.doc,.docx" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                               </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <FormInput formData={formData} handleChange={handleChange} label="Email" id="email" type="email" required placeholder="E-mail" />
                               <FormInput formData={formData} handleChange={handleChange} label="Aadhar Number" id="aadhar" required placeholder="xxxx xxxx xxxx" />
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormSelect formData={formData} handleChange={handleChange} label="Select Security Question" id="securityQuestion" required>
                                    <option>What is the Pet Name</option>
                                    <option>What is your favorite book</option>
                                    <option>What city were you born in</option>
                                </FormSelect>
                                <FormInput formData={formData} handleChange={handleChange} label="Security Answer" id="securityAnswer" required placeholder="Your answer" />
                             </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormSelect formData={formData} handleChange={handleChange} label="Gender" id="gender" required>
                                    <option value="">Select Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </FormSelect>
                                 <FormSelect formData={formData} handleChange={handleChange} label="Category" id="category" required>
                                    <option value="">Select Category</option>
                                    <option>General</option>
                                    <option>OBC</option>
                                    <option>SC</option>
                                    <option>ST</option>
                                </FormSelect>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <PasswordInput formData={formData} handleChange={handleChange} label="Password" id="password" required show={showPassword} onToggle={() => setShowPassword(p => !p)} />
                                <PasswordInput formData={formData} handleChange={handleChange} label="Confirm Password" id="confirmPassword" required show={showConfirmPassword} onToggle={() => setShowConfirmPassword(p => !p)} />
                             </div>
                        </section>

                        <section className="flex flex-col items-center justify-center pt-4">
                             <button 
                                type="submit" 
                                className="w-full max-w-sm bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out disabled:bg-slate-400"
                                disabled={isLoading}
                            >
                                 {isLoading ? 'Registering...' : 'Register'}
                            </button>
                        </section>
                    </form>
                </div>
            </main>
            <RegistrationFooter />
        </div>
    );
};
