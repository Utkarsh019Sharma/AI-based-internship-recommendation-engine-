import React from 'react';
import { BriefcaseIcon } from './icons/BriefcaseIcon';

export const AuthIllustrationPanel: React.FC = () => {
    return (
        <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12 rounded-l-xl">
            <BriefcaseIcon className="h-24 w-24 mb-6 opacity-80" />
            <h2 className="text-4xl font-bold text-center mb-4">
                Find Your Future, Faster.
            </h2>
            <p className="text-indigo-200 text-center max-w-sm">
                Leverage the power of AI to discover personalized internship opportunities and accelerate your career path.
            </p>
        </div>
    );
};
