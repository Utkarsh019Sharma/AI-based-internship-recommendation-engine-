
import React, { useState, useEffect } from 'react';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { PlayCircleIcon } from './icons/PlayCircleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ArrowUpTrayIcon } from './icons/ArrowUpTrayIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { generateLessonContent, generateResourceContent, generatePersonalizedLearningHub, PersonalizedHub } from '../services/geminiService';
import type { Student } from '../types';

// --- Data Types ---

interface LearningPath {
    id: number;
    title: string;
    level: string;
    description: string;
    progress: number;
    lessonsCompleted: number;
    totalLessons: number;
    duration: string;
    color: string;
    btnColor: string;
    modules: string[];
}

interface Resource {
    id: number;
    title: string;
    description: string;
    downloads: number;
    rating: number;
    icon: React.ReactNode;
    bgColor: string;
}

// Fallback data if AI fails or for initial render (Expanded for carousel demo)
const fallbackLearningPaths: LearningPath[] = [
    {
        id: 1,
        title: "PM Fundamentals",
        level: "Beginner",
        description: "Learn the basics of product management",
        progress: 0,
        lessonsCompleted: 0,
        totalLessons: 10,
        duration: "8 hours",
        color: "bg-green-100 text-green-800",
        btnColor: "bg-orange-500 hover:bg-orange-600",
        modules: ["Intro to PM", "Customer Needs", "Competitive Analysis", "MVP"]
    },
    {
        id: 2,
        title: "Data Analytics for PMs",
        level: "Intermediate",
        description: "Learn to make better decisions with data",
        progress: 0,
        lessonsCompleted: 0,
        totalLessons: 8,
        duration: "6 hours",
        color: "bg-yellow-100 text-yellow-800",
        btnColor: "bg-yellow-600 hover:bg-yellow-700",
        modules: ["Metrics that Matter", "A/B Testing", "SQL Basics", "Data Visualization"]
    },
    {
        id: 3,
        title: "User Research Masterclass",
        level: "Advanced",
        description: "Effective user research techniques",
        progress: 0,
        lessonsCompleted: 0,
        totalLessons: 12,
        duration: "10 hours",
        color: "bg-indigo-100 text-indigo-800",
        btnColor: "bg-indigo-600 hover:bg-indigo-700",
        modules: ["User Interviews", "Surveys", "Usability Testing", "Persona Building"]
    },
    {
        id: 4,
        title: "Agile & Scrum Methodologies",
        level: "Beginner",
        description: "Master the art of Agile development",
        progress: 0,
        lessonsCompleted: 0,
        totalLessons: 9,
        duration: "7 hours",
        color: "bg-blue-100 text-blue-800",
        btnColor: "bg-blue-600 hover:bg-blue-700",
        modules: ["Scrum Basics", "Sprints", "Backlog Management", "Retrospectives"]
    },
    {
        id: 5,
        title: "Product Strategy",
        level: "Advanced",
        description: "Define and execute a winning strategy",
        progress: 0,
        lessonsCompleted: 0,
        totalLessons: 15,
        duration: "12 hours",
        color: "bg-purple-100 text-purple-800",
        btnColor: "bg-purple-600 hover:bg-purple-700",
        modules: ["Vision & Mission", "Market Strategy", "Positioning", "Growth Tactics"]
    },
    {
        id: 6,
        title: "Tech for Non-Tech PMs",
        level: "Intermediate",
        description: "Understand the tech stack",
        progress: 0,
        lessonsCompleted: 0,
        totalLessons: 10,
        duration: "9 hours",
        color: "bg-red-100 text-red-800",
        btnColor: "bg-red-600 hover:bg-red-700",
        modules: ["APIs", "Databases", "Cloud Computing", "Frontend vs Backend"]
    }
];

const fallbackResources: Resource[] = [
    {
        id: 1,
        title: "PM Interview Guide",
        description: "Complete interview preparation guide",
        downloads: 1250,
        rating: 4.8,
        icon: <BookOpenIcon className="h-6 w-6 text-red-500" />,
        bgColor: "bg-red-50"
    }
];

// --- Course Player Modal ---

interface CoursePlayerModalProps {
    course: LearningPath;
    onClose: () => void;
    onUpdateProgress: (courseId: number, lessonIndex: number) => void;
}

const CoursePlayerModal: React.FC<CoursePlayerModalProps> = ({ course, onClose, onUpdateProgress }) => {
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [content, setContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());

    // Fetch AI content when lesson changes
    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            setContent(null);
            try {
                const lessonTitle = course.modules[currentLessonIndex];
                const aiText = await generateLessonContent(course.title, lessonTitle);
                setContent(aiText);
            } catch (error) {
                setContent("Error loading lesson content.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchContent();
    }, [course, currentLessonIndex]);

    const handleCompleteLesson = () => {
        if (!completedLessons.has(currentLessonIndex)) {
            const newCompleted = new Set(completedLessons);
            newCompleted.add(currentLessonIndex);
            setCompletedLessons(newCompleted);
            onUpdateProgress(course.id, newCompleted.size);
        }
        
        if (currentLessonIndex < course.modules.length - 1) {
            setCurrentLessonIndex(prev => prev + 1);
        } else {
            alert("Course Completed! Great job.");
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center border-b border-slate-700">
                    <div>
                        <h3 className="text-xl font-bold">{course.title}</h3>
                        <p className="text-sm text-slate-400">{course.modules[currentLessonIndex]}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex flex-grow overflow-hidden">
                    {/* Sidebar / Playlist */}
                    <div className="w-1/3 bg-slate-50 border-r border-slate-200 overflow-y-auto hidden md:block">
                        <div className="p-4 border-b border-slate-200 bg-white sticky top-0">
                            <h4 className="font-bold text-slate-700">Course Content</h4>
                            <p className="text-xs text-slate-500">{Math.round((completedLessons.size / course.totalLessons) * 100)}% Complete</p>
                        </div>
                        <ul className="divide-y divide-slate-200">
                            {course.modules.map((module, idx) => (
                                <li 
                                    key={idx} 
                                    onClick={() => setCurrentLessonIndex(idx)}
                                    className={`p-4 cursor-pointer hover:bg-slate-100 transition flex items-center gap-3 ${idx === currentLessonIndex ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                                >
                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border ${idx === currentLessonIndex ? 'bg-blue-500 border-blue-500 text-white' : completedLessons.has(idx) ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-300 text-slate-400'}`}>
                                        {completedLessons.has(idx) ? <CheckCircleIcon className="h-4 w-4" /> : <span className="text-xs">{idx + 1}</span>}
                                    </div>
                                    <span className={`text-sm font-medium ${idx === currentLessonIndex ? 'text-blue-700' : 'text-slate-600'}`}>{module}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-grow bg-white overflow-y-auto p-8 relative">
                         {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-slate-600 font-medium animate-pulse">AI Instructor is generating lesson...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-3xl mx-auto">
                                <h1 className="text-3xl font-bold text-slate-900 mb-6">{course.modules[currentLessonIndex]}</h1>
                                <div className="prose prose-slate max-w-none">
                                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                                        {content}
                                    </div>
                                </div>
                                
                                <div className="mt-12 pt-8 border-t border-slate-200 flex justify-end">
                                    <button 
                                        onClick={handleCompleteLesson}
                                        className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-200"
                                    >
                                        <span>Complete & Continue</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main Component ---

interface ResourcesPageProps {
    student?: Student | null;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ student }) => {
    const [paths, setPaths] = useState<LearningPath[]>(fallbackLearningPaths);
    const [resources, setResources] = useState<Resource[]>(fallbackResources);
    const [activeCourse, setActiveCourse] = useState<LearningPath | null>(null);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [pathStartIndex, setPathStartIndex] = useState(0);

    useEffect(() => {
        const fetchPersonalizedData = async () => {
            if (!student) return;
            setIsLoading(true);
            try {
                // Fetch from AI
                const data: PersonalizedHub = await generatePersonalizedLearningHub(
                    student.skills || [], 
                    student.interests || [], 
                    student.resumeText || ''
                );
                
                // Map AI paths to UI model
                const newPaths: LearningPath[] = data.paths.map((p, idx) => {
                    const colors = [
                        { bg: "bg-green-100 text-green-800", btn: "bg-green-600 hover:bg-green-700" },
                        { bg: "bg-yellow-100 text-yellow-800", btn: "bg-yellow-600 hover:bg-yellow-700" },
                        { bg: "bg-indigo-100 text-indigo-800", btn: "bg-indigo-600 hover:bg-indigo-700" },
                        { bg: "bg-blue-100 text-blue-800", btn: "bg-blue-600 hover:bg-blue-700" },
                        { bg: "bg-purple-100 text-purple-800", btn: "bg-purple-600 hover:bg-purple-700" },
                        { bg: "bg-red-100 text-red-800", btn: "bg-red-600 hover:bg-red-700" },
                    ];
                    const theme = colors[idx % colors.length];
                    
                    return {
                        id: 100 + idx,
                        title: p.title,
                        level: p.level,
                        description: p.description,
                        progress: 0,
                        lessonsCompleted: 0,
                        totalLessons: p.modules.length,
                        duration: `${p.modules.length} hours`,
                        color: theme.bg,
                        btnColor: theme.btn,
                        modules: p.modules
                    };
                });
                
                // Map AI resources to UI model
                const newResources: Resource[] = data.resources.map((r, idx) => {
                     const icons = [
                        { icon: <BookOpenIcon className="h-6 w-6 text-red-500" />, bg: "bg-red-50" },
                        { icon: <PlayCircleIcon className="h-6 w-6 text-blue-500" />, bg: "bg-blue-50" },
                        { icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />, bg: "bg-green-50" },
                        { icon: <DocumentTextIcon className="h-6 w-6 text-purple-500" />, bg: "bg-purple-50" },
                    ];
                    const theme = icons[idx % icons.length];
                    
                    return {
                        id: 200 + idx,
                        title: r.title,
                        description: r.description,
                        downloads: Math.floor(Math.random() * 500) + 100,
                        rating: (4 + Math.random()),
                        icon: theme.icon,
                        bgColor: theme.bg
                    }
                });

                setPaths(newPaths);
                setResources(newResources);

            } catch (e) {
                console.error("Failed to personalize resources, using fallback.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPersonalizedData();
    }, [student]);


    const handleUpdateProgress = (courseId: number, completedCount: number) => {
        setPaths(prev => prev.map(p => {
            if (p.id === courseId) {
                const newProgress = Math.min(100, Math.round((completedCount / p.totalLessons) * 100));
                return { ...p, progress: newProgress, lessonsCompleted: completedCount };
            }
            return p;
        }));
    };

    const handleDownloadResource = async (resource: Resource) => {
        setDownloadingId(resource.id);
        try {
            const content = await generateResourceContent(resource.title, resource.description);
            const blob = new Blob([content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${resource.title.replace(/\s+/g, '_')}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            alert("Failed to download resource. Please try again.");
        } finally {
            setDownloadingId(null);
        }
    };

    const handleNextPaths = () => {
        setPathStartIndex(prev => Math.min(prev + 3, paths.length - 1));
    };

    const handlePrevPaths = () => {
        setPathStartIndex(prev => Math.max(prev - 3, 0));
    };

    // Calculate visible paths
    const visiblePaths = paths.slice(pathStartIndex, pathStartIndex + 3);

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">My Personalized Learning Hub</h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {isLoading ? "Curating content based on your profile..." : "AI-Curated paths and materials to crack your dream internship."}
                    </p>
                </div>
            </div>
            
            {/* Learning Paths Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <BookOpenIcon className="h-5 w-5 text-orange-500" />
                        <h3 className="text-lg font-bold text-slate-800">Recommended Learning Paths</h3>
                    </div>
                    
                    {/* Carousel Controls */}
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handlePrevPaths} 
                            disabled={pathStartIndex === 0}
                            className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <button 
                            onClick={handleNextPaths} 
                            disabled={pathStartIndex + 3 >= paths.length}
                            className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                         {[1, 2, 3].map(i => (
                             <div key={i} className="h-64 bg-slate-100 rounded-xl"></div>
                         ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {visiblePaths.map(path => (
                            <div key={path.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 flex flex-col h-full animate-fadeIn">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-lg text-slate-900 leading-tight line-clamp-2">{path.title}</h4>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide flex-shrink-0 ${path.color}`}>
                                        {path.level}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 mb-6 flex-grow line-clamp-3">{path.description}</p>
                                
                                <div className="mb-2 flex justify-between text-xs font-semibold text-slate-600">
                                    <span>Progress:</span>
                                    <span>{path.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                                    <div className={`${path.btnColor.split(' ')[0]} h-2 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${path.progress}%` }}></div>
                                </div>
                                
                                <div className="flex justify-between items-center text-xs text-slate-400 mb-6 font-medium">
                                    <span>{path.lessonsCompleted}/{path.totalLessons} lessons</span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {path.duration}
                                    </span>
                                </div>
                                
                                <button 
                                    onClick={() => setActiveCourse(path)}
                                    className={`w-full ${path.btnColor} text-white font-bold py-2.5 rounded-lg transition shadow-md shadow-orange-100`}
                                >
                                    {path.progress > 0 ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <PlayCircleIcon className="h-4 w-4" /> Continue
                                        </span>
                                    ) : 'Start Learning'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Resource Library Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <div className="flex items-center gap-2 mb-6">
                    <ArrowUpTrayIcon className="h-5 w-5 text-red-500 rotate-180" />
                    <h3 className="text-lg font-bold text-slate-800">Resource Library</h3>
                </div>
                
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
                         {[1, 2, 3, 4].map(i => (
                             <div key={i} className="h-24 bg-slate-100 rounded-xl"></div>
                         ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resources.map(res => (
                            <div key={res.id} className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between hover:border-orange-200 hover:shadow-md transition duration-200 group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${res.bgColor}`}>
                                        {res.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{res.title}</h4>
                                        <p className="text-sm text-slate-500 mb-1 line-clamp-1">{res.description}</p>
                                        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                                            <span>{res.downloads} downloads</span>
                                            <span className="text-yellow-500 font-bold flex items-center gap-1">
                                                ★ {res.rating.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDownloadResource(res)}
                                    disabled={downloadingId === res.id}
                                    className="text-orange-500 font-bold px-4 py-2 rounded-lg border border-orange-200 hover:bg-orange-50 transition text-sm disabled:opacity-50 disabled:cursor-wait min-w-[100px]"
                                >
                                    {downloadingId === res.id ? 'Generating...' : 'Download'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>

            {activeCourse && (
                <CoursePlayerModal 
                    course={activeCourse} 
                    onClose={() => setActiveCourse(null)}
                    onUpdateProgress={handleUpdateProgress}
                />
            )}
        </div>
    );
};
