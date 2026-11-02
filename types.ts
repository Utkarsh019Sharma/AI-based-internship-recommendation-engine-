
export interface SkillProficiency {
  skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Student {
  student_id: number;
  name: string;
  email: string;
  skills: string[];
  interests: string[];
  academic_score: number | null; // Allow null for new profiles
  past_internship_views: number[];
  resumeText: string;
  softSkills: string[];
  skillProficiencies: SkillProficiency[];
  location: 'Urban' | 'Rural' | null; // Allow null for new profiles
  education: string[];
  achievements: string[];
  certificates: string[];
  suggestedSearchQuery?: string;
}

export interface Internship {
  internship_id: number;
  title: string;
  company: string; // New: Company Name
  location: string; // New: City/State
  stipend: string; // New: Monthly Stipend
  logoColor: string; // New: For UI decoration
  description: string;
  required_skills: string[];
  domain: string;
  // New fields for re-ranking
  postedDate: string; // ISO 8601 format
  // New fields for Live Web Results
  externalLink?: string;
  source?: string;
}

export type ApplicationStage = 'Applied' | 'Screening' | 'Technical Interview' | 'HR Interview' | 'Offer' | 'Rejected';

export interface Interaction {
  student_id: number;
  internship_id: number;
  view_count: number;
  applied: boolean;
  // New fields for tracking application progress
  applicationStatus?: ApplicationStage;
  appliedDate?: string;
  lastUpdated?: string;
  submittedResume?: string; // New: Snapshot of resume at time of application
}

export interface Recommendation extends Internship {
  score: number;
  contentBasedScore: number;
  collaborativeScore: number;
  freshnessBoost: number;
  diversityPenalty: number;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface CareerPath {
  title: string;
  steps: string[];
}

export interface SimulationTurn {
  score: number;
  feedback: string;
}

// --- New Recruiter Types ---

export interface Recruiter {
  recruiter_id: number;
  name: string;
  email: string;
  company: string;
}

export interface Job {
  job_id: number;
  recruiter_id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  level: 'Internship' | 'Entry-Level' | 'Mid-Level';
  salary: string;
  postedDate: string; // ISO 8601 format
  isActive: boolean;
  required_skills: string[]; // NEW: Added for recommendation engine
}

export interface Application {
  application_id: number;
  student_id: number;
  job_id: number;
  status: 'Pending' | 'Accepted' | 'Rejected';
}