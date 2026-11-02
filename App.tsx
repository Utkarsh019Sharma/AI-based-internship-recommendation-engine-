
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { Student, Internship, Interaction, Recruiter, Job, Application } from './types';
import { recommendInternships } from './services/recommendationService';
import { scoutLiveInternships } from './services/geminiService';
import { 
  fetchStudents, 
  fetchInternships, 
  fetchInteractions, 
  createStudent,
  fetchRecruiters,
  fetchJobs,
  fetchApplications,
  createRecruiter,
  postJob,
  updateApplicationStatus,
  createApplication
} from './services/apiService';

// Import components
import { StudentProfileCard } from './components/StudentProfileCard';
import { InternshipRecommendations } from './components/InternshipRecommendations';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { MyProfileModal } from './components/MyProfileModal';
import { ArrowLeftOnRectangleIcon } from './components/icons/ArrowLeftOnRectangleIcon';
import { UserCircleIcon } from './components/icons/UserCircleIcon';
import { RegistrationPage } from './components/RegistrationPage';
import { LoginPage } from './components/LoginPage';
import { RecruiterLoginPage } from './components/RecruiterLoginPage';
import { RecruiterDashboard } from './components/RecruiterDashboard';
import { AcademicCapIcon } from './components/icons/AcademicCapIcon';
import { MapIcon } from './components/icons/MapIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { AppliedStatusPage } from './components/AppliedStatusPage';
import { ResourcesPage } from './components/ResourcesPage';
import { AICareerAssistant } from './components/AICareerAssistant';


function App() {
  // State for app view
  const [currentView, setCurrentView] = useState<'registration' | 'login' | 'dashboard' | 'recruiterLogin' | 'recruiterDashboard' | 'appliedStatus' | 'resources'>('registration');
  
  // State for data
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [allRecruiters, setAllRecruiters] = useState<Recruiter[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  
  // State for the logged-in user
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [currentRecruiter, setCurrentRecruiter] = useState<Recruiter | null>(null);

  // State for UI
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [liveSearchResults, setLiveSearchResults] = useState<Internship[]>([]);
  const [isSearchingLive, setIsSearchingLive] = useState(false);


  // --- Data Fetching ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [
          studentsData, 
          internshipsData, 
          interactionsData,
          recruitersData,
          jobsData,
          applicationsData
        ] = await Promise.all([
          fetchStudents(),
          fetchInternships(),
          fetchInteractions(),
          fetchRecruiters(),
          fetchJobs(),
          fetchApplications(),
        ]);
        
        setAllStudents(studentsData);
        setInternships(internshipsData);
        setInteractions(interactionsData);
        setAllRecruiters(recruitersData);
        setJobs(jobsData);
        setApplications(applicationsData);

      } catch (e) {
        setError("Failed to load application data. Please try refreshing the page.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle Search Trigger
  const handleSearch = useCallback(async (overrideQuery?: string) => {
      const queryToUse = overrideQuery || searchQuery;
      if (!queryToUse.trim()) return;
      
      setIsSearchingLive(true);
      setLiveSearchResults([]); // clear previous live results
      
      try {
          // Trigger AI Scout with location if provided
          const fullQuery = locationSearch.trim() 
            ? `${queryToUse} in ${locationSearch}`
            : queryToUse;
            
          const result = await scoutLiveInternships(fullQuery);
          setLiveSearchResults(result.internships);
      } catch (e) {
          console.error("Live search failed", e);
      } finally {
          setIsSearchingLive(false);
      }
  }, [searchQuery, locationSearch]);

  // Trigger live search when a resume is analyzed
  useEffect(() => {
      if (currentUser?.suggestedSearchQuery) {
          setSearchQuery(currentUser.suggestedSearchQuery);
          handleSearch(currentUser.suggestedSearchQuery);
      }
  }, [currentUser?.suggestedSearchQuery, handleSearch]);


  // Derived state: Merge Static Internships + Recruiter Jobs + Live Results
  const allAvailableInternships = useMemo(() => {
      // Convert 'Job' objects to 'Internship' objects
      const mappedJobs: Internship[] = jobs
          .filter(j => j.isActive)
          .map(job => {
              const recruiter = allRecruiters.find(r => r.recruiter_id === job.recruiter_id);
              return {
                  internship_id: job.job_id,
                  title: job.title,
                  company: recruiter ? recruiter.company : 'Unknown Company',
                  location: job.location,
                  stipend: job.salary,
                  logoColor: 'bg-indigo-600', // Default color for recruiter jobs
                  description: job.description,
                  required_skills: job.required_skills || [],
                  domain: job.category,
                  postedDate: job.postedDate,
                  source: 'Portal Job'
              };
          });
      
      return [...internships, ...mappedJobs, ...liveSearchResults];
  }, [internships, jobs, allRecruiters, liveSearchResults]);


  // Recommendation Engine
  const recommendations = useMemo(() => {
    if (!currentUser || !currentUser.skills || currentUser.skills.length === 0) return [];
    
    // 1. Filter based on search query
    let filteredList = allAvailableInternships;
    if (searchQuery.trim()) {
        const lowerQuery = searchQuery.toLowerCase();
        filteredList = allAvailableInternships.filter(i => 
            i.company.toLowerCase().includes(lowerQuery) ||
            i.title.toLowerCase().includes(lowerQuery) ||
            i.domain.toLowerCase().includes(lowerQuery) ||
            i.required_skills.some(skill => skill.toLowerCase().includes(lowerQuery))
        );
    }

    // 2. Recommend & Rank
    const limit = 100; // Show all relevant matches up to a high limit
    return recommendInternships(currentUser, filteredList, allStudents, interactions, limit);
  }, [currentUser, allAvailableInternships, allStudents, interactions, searchQuery]);

  // --- Handlers ---
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRecruiter(null);
    setCurrentView('login');
    setSearchQuery('');
    setLiveSearchResults([]);
  };

  const handleLogin = useCallback((email: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
        const user = allStudents.find(s => s.email.toLowerCase() === email.toLowerCase());
        if (user) {
            setCurrentUser(user);
            setCurrentView('dashboard');
        } else {
            alert('Login failed: User not found.');
        }
        setIsSubmitting(false);
    }, 500);
  }, [allStudents]);
  
  const handleRegisterStudent = useCallback(async (userData: {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
  }) => {
    setIsSubmitting(true);
    try {
      const fullName = [userData.firstName, userData.middleName, userData.lastName]
        .filter(Boolean)
        .join(' ');
      const newStudent = await createStudent({ name: fullName, email: userData.email });
      setAllStudents((prevStudents) => [...prevStudents, newStudent]);
      setCurrentUser(newStudent);
      setCurrentView('dashboard');
    } catch (e) {
      alert('Failed to register student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleRecruiterLogin = useCallback((email: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
        const recruiter = allRecruiters.find(r => r.email.toLowerCase() === email.toLowerCase());
        if (recruiter) {
            setCurrentRecruiter(recruiter);
            setCurrentView('recruiterDashboard');
        } else {
            alert('Login failed: Recruiter not found.');
        }
        setIsSubmitting(false);
    }, 500);
  }, [allRecruiters]);

  const handleRecruiterRegister = useCallback(async (userData: { name: string, email: string, company: string }) => {
      setIsSubmitting(true);
      try {
          const newRecruiter = await createRecruiter(userData);
          setAllRecruiters(prev => [...prev, newRecruiter]);
          setCurrentRecruiter(newRecruiter);
          setCurrentView('recruiterDashboard');
      } catch (e) {
          alert('Failed to register recruiter. Please try again.');
      } finally {
          setIsSubmitting(false);
      }
  }, []);

  const handlePostJob = useCallback(async (jobData: Omit<Job, 'job_id' | 'postedDate' | 'isActive'>) => {
    try {
      const newJob = await postJob(jobData);
      setJobs(prev => [...prev, newJob]);
    } catch (e) {
      alert("Failed to post job.");
    }
  }, []);

  const handleUpdateApplication = useCallback(async (applicationId: number, status: Application['status']) => {
    try {
      // 1. Update Recruiter Application
      const updatedApplication = await updateApplicationStatus(applicationId, status);
      setApplications(prev => prev.map(app => app.application_id === applicationId ? updatedApplication : app));

      // 2. Sync with Student Interaction (So student sees the status update)
      const app = applications.find(a => a.application_id === applicationId);
      if (app) {
          setInteractions(prev => {
              const idx = prev.findIndex(i => i.student_id === app.student_id && i.internship_id === app.job_id);
              if (idx > -1) {
                  const updated = [...prev];
                  updated[idx] = { 
                      ...updated[idx], 
                      applicationStatus: status === 'Accepted' ? 'Offer' : status === 'Rejected' ? 'Rejected' : 'Screening', // Mapping simple status to stages
                      lastUpdated: new Date().toISOString()
                  };
                  return updated;
              }
              return prev;
          });
      }
    } catch(e) {
      alert("Failed to update application status.");
    }
  }, [applications]);
  
  const handleAnalysisComplete = useCallback((updatedStudent: Student) => {
    setAllStudents(prevStudents => 
      prevStudents.map(s => s.student_id === updatedStudent.student_id ? updatedStudent : s)
    );
    if (currentUser && currentUser.student_id === updatedStudent.student_id) {
        setCurrentUser(updatedStudent);
    }
  }, [currentUser]);
  
  const handleUpdateProfile = useCallback((updatedStudent: Student) => {
    setAllStudents(prev => prev.map(s => s.student_id === updatedStudent.student_id ? updatedStudent : s));
    setCurrentUser(updatedStudent);
    setIsProfileModalOpen(false);
  }, []);

  const handleApplyForInternship = useCallback(async (internshipId: number) => {
    if (!currentUser) return;
    const studentId = currentUser.student_id;
    
    // 1. Update Student Interaction
    setInteractions(prev => {
        const existingIdx = prev.findIndex(i => i.student_id === studentId && i.internship_id === internshipId);
        const timestamp = new Date().toISOString();
        const resumeSnapshot = currentUser.resumeText;

        if (existingIdx > -1) {
            const updated = [...prev];
            updated[existingIdx] = { 
              ...updated[existingIdx], 
              applied: true,
              applicationStatus: 'Applied',
              appliedDate: timestamp,
              submittedResume: resumeSnapshot
            };
            return updated;
        }
        return [...prev, { 
          student_id: studentId, 
          internship_id: internshipId, 
          view_count: 1, 
          applied: true,
          applicationStatus: 'Applied',
          appliedDate: timestamp,
          submittedResume: resumeSnapshot
        }];
    });

    // 2. Create Application Record (For Recruiter View)
    // Check if this internship is actually a recruiter job (has ID > 200 based on mock logic or exists in jobs array)
    const isRecruiterJob = jobs.some(j => j.job_id === internshipId);
    if (isRecruiterJob) {
        const newApp: Application = {
            application_id: Date.now(), // Generate ID
            student_id: studentId,
            job_id: internshipId,
            status: 'Pending'
        };
        try {
            await createApplication(newApp);
            setApplications(prev => [...prev, newApp]);
        } catch (e) {
            console.error("Failed to create application record", e);
        }
    }

  }, [currentUser, jobs]);
  
  const navigateToLogin = () => setCurrentView('login');
  const navigateToRegister = () => setCurrentView('registration');
  const navigateToRecruiterLogin = () => setCurrentView('recruiterLogin');
  const navigateToStudentLogin = () => setCurrentView('login');

  // --- Renders ---
  if (isLoading && !currentView.includes('login') && !currentView.includes('registration')) {
      return <div className="flex justify-center items-center min-h-screen text-xl font-semibold text-slate-600 bg-slate-50">Loading Portal...</div>;
  }
  if (error) {
      return <div className="flex justify-center items-center min-h-screen text-xl font-semibold text-red-600 bg-slate-50">{error}</div>;
  }

  if (currentView === 'registration') {
    return <RegistrationPage onRegister={handleRegisterStudent} isLoading={isSubmitting} onNavigateToLogin={navigateToLogin} onNavigateToRecruiter={navigateToRecruiterLogin} />;
  }
  
  if (currentView === 'login') {
    return <LoginPage onLogin={handleLogin} isLoading={isSubmitting} onNavigateToRegister={navigateToRegister} onNavigateToRecruiter={navigateToRecruiterLogin} />;
  }

  if (currentView === 'recruiterLogin') {
    return <RecruiterLoginPage onLogin={handleRecruiterLogin} onRegister={handleRecruiterRegister} isLoading={isSubmitting} onNavigateToStudentPortal={navigateToStudentLogin} recruiters={allRecruiters} />
  }

  if (currentView === 'recruiterDashboard' && currentRecruiter) {
    const recruiterJobs = jobs.filter(j => j.recruiter_id === currentRecruiter.recruiter_id);
    const recruiterJobIds = new Set(recruiterJobs.map(j => j.job_id));
    const recruiterApplications = applications.filter(app => recruiterJobIds.has(app.job_id));
    
    return <RecruiterDashboard 
      recruiter={currentRecruiter}
      jobs={recruiterJobs}
      applications={recruiterApplications}
      students={allStudents}
      onPostJob={handlePostJob}
      onUpdateApplication={handleUpdateApplication}
      onLogout={handleLogout}
    />
  }

  return (
    <>
      <div className="bg-slate-50 min-h-screen font-sans">
        
        {/* Navigation Bar */}
        <header className="bg-white sticky top-0 z-20 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => setCurrentView('dashboard')}
            >
               <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <AcademicCapIcon className="h-6 w-6 text-white" />
               </div>
               <div>
                 <h1 className="text-xl font-bold text-slate-800 tracking-tight">Internship<span className="text-blue-600">Portal</span></h1>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">PM Internship Scheme</p>
               </div>
            </div>
            
            {currentUser && (
                <div className="flex items-center gap-4">
                     <nav className="hidden md:flex gap-6 mr-4 text-sm font-semibold text-slate-600">
                        <button onClick={() => setCurrentView('dashboard')} className={`${currentView === 'dashboard' ? 'text-blue-600' : 'hover:text-blue-600'}`}>Find Internships</button>
                        <button onClick={() => setCurrentView('appliedStatus')} className={`${currentView === 'appliedStatus' ? 'text-blue-600' : 'hover:text-blue-600'}`}>Applied Status</button>
                        <button onClick={() => setCurrentView('resources')} className={`${currentView === 'resources' ? 'text-blue-600' : 'hover:text-blue-600'}`}>Resources</button>
                     </nav>
                     <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
                     <button onClick={() => setIsProfileModalOpen(true)} className="flex items-center gap-2 group">
                        <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-bold group-hover:bg-blue-100 transition">
                            {currentUser.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-700 hidden sm:block group-hover:text-blue-600">{currentUser.name.split(' ')[0]}</span>
                    </button>
                    <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition">
                        <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                    </button>
                </div>
              )}
          </div>
        </header>

        {currentView === 'dashboard' ? (
          <>
            {/* Hero Search Section */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h2 className="text-3xl md:text-5xl font-bold">Find Your Perfect Internship</h2>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">Explore real-time opportunities from LinkedIn, Unstop, Internshala, and more, powered by AI.</p>
                    
                    <div className="bg-white p-2 rounded-xl shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row items-center mt-8 gap-2">
                        <div className="flex flex-grow items-center w-full">
                            <div className="pl-4 text-slate-400">
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search by company, skill, role (e.g., 'React Developer')..." 
                                className="flex-grow p-3 text-slate-700 placeholder-slate-400 outline-none rounded-l-full bg-white"
                            />
                        </div>
                        
                        <div className="h-10 w-px bg-slate-200 hidden md:block"></div>
                        
                        <div className="flex flex-grow items-center w-full">
                             <div className="pl-4 text-slate-400">
                                 <MapIcon className="w-5 h-5" />
                            </div>
                            <input 
                                type="text" 
                                value={locationSearch}
                                onChange={(e) => setLocationSearch(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Location (e.g., 'Mumbai', 'Remote')..." 
                                className="flex-grow p-3 text-slate-700 placeholder-slate-400 outline-none bg-white"
                            />
                        </div>

                        <button 
                            onClick={handleSearch}
                            disabled={isSearchingLive}
                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg md:rounded-full transition disabled:bg-blue-400"
                        >
                            {isSearchingLive ? 'Scouting...' : 'Search'}
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 -mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Sidebar - Profile & Filters */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                       <div className="h-20 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                       <div className="-mt-10 px-6 pb-6 relative">
                           <StudentProfileCard student={currentUser} onEditProfile={() => setIsProfileModalOpen(true)} />
                       </div>
                  </div>
                  <ResumeAnalyzer student={currentUser} onAnalysisComplete={handleAnalysisComplete} />
                  
                </div>

                {/* Right Content - Recommendations */}
                <div className="lg:col-span-8 space-y-6">
                  {!searchQuery && recommendations.length > 0 && (
                      <div className="flex items-center justify-between">
                         <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                             <SparklesIcon className="h-5 w-5 text-blue-600" />
                             Top Personalized Recommendations
                         </h3>
                         <span className="text-sm text-slate-500 font-medium">{recommendations.length} Matches Found</span>
                      </div>
                  )}
                  {searchQuery && (
                      <div className="flex items-center justify-between">
                         <h3 className="text-xl font-bold text-slate-800">
                             {isSearchingLive 
                               ? "Scouting the web..." 
                               : `Results for "${searchQuery}" ${locationSearch ? `in "${locationSearch}"` : ""}`}
                         </h3>
                         <button onClick={() => { setSearchQuery(''); setLocationSearch(''); setLiveSearchResults([]); }} className="text-sm text-blue-600 hover:underline">Clear Search</button>
                      </div>
                  )}
                  {isSearchingLive && (
                      <div className="bg-blue-50 text-blue-700 p-4 rounded-lg flex items-center gap-3 animate-pulse">
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          <span className="font-semibold">AI is searching live opportunities from LinkedIn, Unstop, etc...</span>
                      </div>
                  )}

                  {!isSearchingLive && currentUser?.suggestedSearchQuery === searchQuery && searchQuery && (
                       <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center justify-between border border-green-200 shadow-sm transition-all duration-500 animate-in fade-in slide-in-from-top-4">
                          <div className="flex items-center gap-3">
                              <SparklesIcon className="h-6 w-6 text-green-600" />
                              <span className="font-semibold">Tailored live matches found based on your resume analysis!</span>
                          </div>
                          <div className="text-[10px] font-bold uppercase py-1 px-2 bg-green-200 rounded">Analysis Active</div>
                       </div>
                  )}
                  <InternshipRecommendations 
                    recommendations={recommendations} 
                    student={currentUser} 
                    interactions={interactions}
                    onApply={handleApplyForInternship}
                  />
                </div>
              </div>
            </main>
          </>
        ) : currentView === 'appliedStatus' ? (
             <AppliedStatusPage 
                student={currentUser!} 
                interactions={interactions} 
                internships={allAvailableInternships} 
             />
        ) : currentView === 'resources' ? (
            <ResourcesPage student={currentUser} />
        ) : null}

      </div>
      {isProfileModalOpen && currentUser && (
        <MyProfileModal 
            student={currentUser}
            onClose={() => setIsProfileModalOpen(false)}
            onSave={handleUpdateProfile}
        />
      )}
      <AICareerAssistant student={currentUser} />
    </>
  );
}

export default App;
