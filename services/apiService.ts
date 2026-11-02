
import type { Student, Internship, Interaction, Recruiter, Job, Application } from '../types';
// In a real application, you would remove the mockData import.
// We keep it here to simulate a network response.
import { students, internships, interactions, recruiters, jobs, applications } from '../data/mockData';

const API_BASE_URL = '/api'; // Placeholder for your backend URL

// Simulates a network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * In a real implementation, this function would use `fetch` to get data
 * from a real backend server.
 */

export const fetchStudents = async (): Promise<Student[]> => {
  console.log("Fetching students from API...");
  await sleep(500); // Simulate network latency
  return Promise.resolve([...students]); // Return copy
};

export const fetchInternships = async (): Promise<Internship[]> => {
  console.log("Fetching internships from API...");
  await sleep(500);
  return Promise.resolve([...internships]); // Return copy
};

export const fetchInteractions = async (): Promise<Interaction[]> => {
    console.log("Fetching interactions from API...");
    await sleep(500);
    return Promise.resolve([...interactions]); // Return copy
};

// This function would send the new student data to the backend
export const createStudent = async (userData: {name: string, email: string}): Promise<Student> => {
    console.log("Sending new student to API...");
    await sleep(700);
    // In a real app, the backend would return the created student with a new ID
    const newId = Math.floor(Math.random() * 1000) + 100;
    const newStudent: Student = {
        student_id: newId,
        name: userData.name,
        email: userData.email,
        skills: [],
        interests: [],
        academic_score: null,
        past_internship_views: [],
        resumeText: '',
        softSkills: [],
        skillProficiencies: [],
        location: null,
        education: [],
        achievements: [],
        certificates: [],
    };
    students.push(newStudent);
    return Promise.resolve(newStudent); 
};


// --- Recruiter API Functions ---

export const fetchRecruiters = async (): Promise<Recruiter[]> => {
    console.log("Fetching recruiters from API...");
    await sleep(500);
    return Promise.resolve([...recruiters]); // Return copy
};

export const fetchJobs = async (): Promise<Job[]> => {
    console.log("Fetching jobs from API...");
    await sleep(500);
    return Promise.resolve([...jobs]); // Return copy
};

export const fetchApplications = async (): Promise<Application[]> => {
    console.log("Fetching applications from API...");
    await sleep(500);
    return Promise.resolve([...applications]); // Return copy
};

export const postJob = async (jobData: Omit<Job, 'job_id' | 'postedDate' | 'isActive'>): Promise<Job> => {
    console.log("Posting new job to API...");
    await sleep(700);
    const newJob: Job = {
        ...jobData,
        job_id: Math.floor(Math.random() * 10000) + 500, // Use larger range to avoid collision
        postedDate: new Date().toISOString(),
        isActive: true,
    };
    // Update the "Server" data
    jobs.push(newJob);
    // Return a COPY or the object. Since fetchJobs returns a copy, 
    // simply returning the object here won't cause duplication in the parent state logic.
    return Promise.resolve(newJob);
};

export const createApplication = async (app: Application): Promise<Application> => {
    console.log("Creating application record...");
    await sleep(400);
    applications.push(app);
    return Promise.resolve(app);
};

export const updateApplicationStatus = async (applicationId: number, status: Application['status']): Promise<Application> => {
    console.log(`Updating application ${applicationId} to ${status}...`);
    await sleep(400);
    const appIndex = applications.findIndex(app => app.application_id === applicationId);
    if (appIndex === -1) {
        throw new Error("Application not found");
    }
    // Update "Server" data
    applications[appIndex].status = status;
    // Return a copy of the updated object
    return Promise.resolve({ ...applications[appIndex] });
};

export const createRecruiter = async (userData: {name: string, email: string, company: string}): Promise<Recruiter> => {
    console.log("Sending new recruiter to API...");
    await sleep(700);
    const newId = Math.floor(Math.random() * 100) + 10;
    const newRecruiter: Recruiter = {
        recruiter_id: newId,
        name: userData.name,
        email: userData.email,
        company: userData.company,
    };
    recruiters.push(newRecruiter);
    return Promise.resolve(newRecruiter);
}
