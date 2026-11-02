
import React, { useState, useCallback, useRef } from 'react';
import type { Student } from '../types';
import { analyzeResume, analyzeResumeWithFile, ResumeAnalysisResult } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { ArrowUpTrayIcon } from './icons/ArrowUpTrayIcon';

interface ResumeAnalyzerProps {
    student: Student | null;
    onAnalysisComplete: (student: Student) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        if (typeof reader.result === 'string') {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        } else {
            reject(new Error("Failed to read file"));
        }
    };
    reader.onerror = error => reject(error);
  });
};

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ student, onAnalysisComplete }) => {
    const [resumeText, setResumeText] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        setResumeText(student?.resumeText || '');
        setUploadedFile(null);
    }, [student]);

    const handleAnalyze = useCallback(async () => {
        if (!student) return;
        if (!resumeText && !uploadedFile) {
             setError('Please enter text or upload a file first.');
             return;
        }

        setIsLoading(true);
        setError(null);
        try {
            let result: ResumeAnalysisResult;

            if (uploadedFile && resumeText.includes(uploadedFile.name)) {
                // Analyze PDF using multimodal API
                const base64 = await fileToBase64(uploadedFile);
                result = await analyzeResumeWithFile(base64, uploadedFile.type);
            } else {
                // Analyze Text
                result = await analyzeResume(resumeText);
            }

            const updatedStudent: Student = {
                ...student,
                resumeText: uploadedFile ? `[Analyzed from PDF: ${uploadedFile.name}]` : resumeText,
                skills: [...new Set([...student.skills, ...result.hardSkills])], 
                softSkills: result.softSkills,
                skillProficiencies: result.skillProficiencies,
                suggestedSearchQuery: result.recommendedSearchQuery,
            };
            onAnalysisComplete(updatedStudent);
            setUploadedFile(null); // Clear after successful analysis
            if (uploadedFile) {
                setResumeText(`Analysis complete for ${uploadedFile.name}. Skills updated.`);
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [student, resumeText, uploadedFile, onAnalysisComplete]);
    
    const handleFileUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setResumeText(e.target.value);
        if (uploadedFile) {
            setUploadedFile(null); // Switch to text mode if user manually types
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !student) return;

        const fileType = file.type;
        const acceptedTypes = ['text/plain', 'application/pdf'];

        if (!acceptedTypes.includes(fileType)) {
            setError('Please upload a PDF or TXT file for accurate AI analysis.');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            if (fileType === 'text/plain') {
                const text = await file.text();
                setResumeText(text);
                setUploadedFile(null);
            } else if (fileType === 'application/pdf') {
                setUploadedFile(file);
                setResumeText(`[PDF Selected: ${file.name}]\n\nReady to analyze. Click 'Analyze with AI' to process this document.`);
            }
        } catch (e) {
            console.error("Error reading file:", e);
            setError("Could not read the selected file.");
        } finally {
            setIsUploading(false);
        }

        if(event.target) {
            event.target.value = '';
        }
    };

    if (!student) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">AI-Powered Resume Analysis</h2>
            <p className="text-sm text-slate-600 mb-4">Paste your resume or upload a PDF to extract skills and improve recommendations.</p>
            <textarea
                value={resumeText}
                onChange={handleTextChange}
                rows={6}
                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-slate-900 shadow-sm font-mono"
                placeholder="Paste resume text here..."
            />
            
             <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.txt,text/plain,application/pdf"
            />

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <button
                    onClick={handleFileUploadClick}
                    disabled={isUploading}
                    className="w-full flex items-center justify-center gap-2 bg-white text-slate-700 font-bold py-2 px-4 rounded-lg border border-slate-300 hover:bg-slate-100 transition disabled:bg-slate-200 disabled:cursor-wait"
                >
                    {isUploading ? (
                        <>
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                           Processing...
                        </>
                    ) : (
                         <>
                            <ArrowUpTrayIcon className="h-5 w-5" />
                            Upload Resume (PDF/TXT)
                        </>
                    )}
                </button>
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading || isUploading || (!resumeText && !uploadedFile)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="h-5 w-5" />
                            Analyze with AI
                        </>
                    )}
                </button>
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
    );
};
