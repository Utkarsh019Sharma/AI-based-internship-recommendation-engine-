
import React, { useState, useEffect, useRef } from 'react';
import type { Internship, SimulationTurn } from '../types';
import { generateSimulationScenario, evaluateSimulationResponse } from '../services/geminiService';
import { XMarkIcon } from './icons/XMarkIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface InternshipSimulatorProps {
    internship: Internship;
    onClose: () => void;
}

export const InternshipSimulator: React.FC<InternshipSimulatorProps> = ({ internship, onClose }) => {
    const [scenario, setScenario] = useState<string | null>(null);
    const [userResponse, setUserResponse] = useState('');
    const [evaluation, setEvaluation] = useState<SimulationTurn | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<'intro' | 'scenario' | 'evaluation'>('intro');

    const handleStart = async () => {
        setIsLoading(true);
        try {
            const result = await generateSimulationScenario(internship.title, internship.description);
            setScenario(result.scenario);
            setStep('scenario');
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitResponse = async () => {
        if (!scenario || !userResponse.trim()) return;
        setIsLoading(true);
        try {
            const result = await evaluateSimulationResponse(scenario, userResponse);
            setEvaluation(result);
            setStep('evaluation');
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4 font-mono">
            <div className="bg-slate-900 rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col border border-slate-700 overflow-hidden relative">
                
                {/* Header */}
                <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-3 text-green-400 text-sm font-bold tracking-wider">AI_INTERNSHIP_SIMULATOR_V1.0</span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-grow p-8 overflow-y-auto text-slate-300">
                    
                    {step === 'intro' && (
                        <div className="h-full flex flex-col justify-center items-center text-center space-y-6">
                            <SparklesIcon className="h-16 w-16 text-blue-400 animate-pulse" />
                            <h2 className="text-3xl font-bold text-white">Experience the Role</h2>
                            <p className="max-w-xl text-lg">
                                You are about to enter a simulated "Day 1" scenario for the <span className="text-blue-400 font-bold">{internship.title}</span> role.
                                <br/><br/>
                                Our AI will generate a realistic workplace challenge. There are no multiple choice answers. You must explain your approach.
                            </p>
                            <button 
                                onClick={handleStart}
                                disabled={isLoading}
                                className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded shadow-[0_0_15px_rgba(34,197,94,0.5)] transition transform hover:scale-105"
                            >
                                {isLoading ? 'INITIALIZING ENVIRONMENT...' : 'START SIMULATION >_'}
                            </button>
                        </div>
                    )}

                    {step === 'scenario' && scenario && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="border-l-4 border-blue-500 pl-4 py-2">
                                <h3 className="text-blue-400 font-bold text-xs uppercase mb-2">Incoming Message from Manager</h3>
                                <p className="text-xl text-white leading-relaxed type-writer-effect">
                                    {scenario}
                                </p>
                            </div>
                            
                            <div className="mt-8">
                                <label className="block text-sm font-bold text-slate-500 mb-2">YOUR RESPONSE:</label>
                                <textarea
                                    value={userResponse}
                                    onChange={(e) => setUserResponse(e.target.value)}
                                    className="w-full h-40 bg-slate-800 border border-slate-600 rounded p-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                                    placeholder="Explain your solution or strategy..."
                                ></textarea>
                            </div>

                            <div className="flex justify-end">
                                <button 
                                    onClick={handleSubmitResponse}
                                    disabled={isLoading || !userResponse}
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'ANALYZING...' : 'SUBMIT SOLUTION'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'evaluation' && evaluation && (
                        <div className="space-y-8 animate-fadeIn">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-slate-800 rounded border border-slate-700">
                                    <h4 className="text-slate-500 text-xs font-bold uppercase mb-2">Scenario</h4>
                                    <p className="text-sm text-slate-300">{scenario}</p>
                                </div>
                                <div className="p-6 bg-slate-800 rounded border border-slate-700">
                                    <h4 className="text-slate-500 text-xs font-bold uppercase mb-2">Your Approach</h4>
                                    <p className="text-sm text-slate-300">{userResponse}</p>
                                </div>
                             </div>

                             <div className="p-6 bg-slate-800 rounded border border-l-4 border-l-purple-500 border-slate-700">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-purple-400 font-bold text-xl">Mentor Evaluation</h3>
                                    <div className="flex flex-col items-center">
                                        <span className="text-4xl font-bold text-white">{evaluation.score}<span className="text-lg text-slate-500">/10</span></span>
                                        <span className="text-xs text-slate-500 uppercase">Score</span>
                                    </div>
                                </div>
                                <p className="text-white text-lg leading-relaxed">
                                    {evaluation.feedback}
                                </p>
                             </div>

                             <div className="flex justify-center pt-4">
                                <button 
                                    onClick={onClose}
                                    className="border border-slate-600 text-slate-300 hover:bg-slate-800 font-bold py-2 px-6 rounded transition"
                                >
                                    Close Simulation
                                </button>
                             </div>
                        </div>
                    )}
                </div>
            </div>
            
            <style>{`
                .type-writer-effect {
                    animation: typing 3.5s steps(40, end);
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
