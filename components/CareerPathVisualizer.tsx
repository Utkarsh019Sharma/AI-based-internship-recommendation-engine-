import React, { useState, useCallback } from 'react';
import type { Student, Internship, CareerPath } from '../types';
import { generateCareerPaths } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { MapIcon } from './icons/MapIcon';

interface CareerPathVisualizerProps {
  student: Student;
  internship: Internship;
}

const PathCard: React.FC<{ path: CareerPath }> = ({ path }) => (
    <div className="border border-slate-200 rounded-lg p-4 bg-white">
        <h5 className="font-bold text-slate-800 text-md">{path.title}</h5>
        <ol className="mt-2 list-decimal list-inside space-y-2 text-sm text-slate-600">
            {path.steps.map((step, index) => (
                <li key={index} className="pl-2">
                    <span className={index === 0 ? 'font-semibold text-blue-600' : ''}>{step}</span>
                </li>
            ))}
        </ol>
    </div>
);


export const CareerPathVisualizer: React.FC<CareerPathVisualizerProps> = ({ student, internship }) => {
    const [paths, setPaths] = useState<CareerPath[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePaths = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateCareerPaths(internship.title, student.interests);
            setPaths(result);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to generate paths.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [internship, student]);

    return (
        <div className="mt-6 border-t pt-6">
            <div className="flex items-center gap-3">
                <MapIcon className="h-6 w-6 text-green-600" />
                <h4 className="text-lg font-semibold text-slate-800">Predictive Career Path Mapping</h4>
            </div>
            <p className="text-sm text-slate-600 mt-2 mb-4">Discover where this internship could lead you in the long term.</p>
            
            {!paths && !isLoading && (
                <button 
                    onClick={handleGeneratePaths}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-green-600 transition"
                >
                    <SparklesIcon className="h-5 w-5" />
                    Visualize Career Paths with AI
                </button>
            )}

            {isLoading && (
                <div className="text-center p-4">
                    <p className="text-slate-500 animate-pulse">Generating potential career roadmaps...</p>
                </div>
            )}

            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

            {paths && (
                <div className="mt-4 space-y-4 bg-slate-50 p-4 rounded-lg">
                    {paths.length > 0 ? (
                        paths.map((path, index) => <PathCard key={index} path={path} />)
                    ) : (
                        <p className="text-slate-600 text-center">Could not generate specific career paths for this role.</p>
                    )}
                </div>
            )}
        </div>
    );
};