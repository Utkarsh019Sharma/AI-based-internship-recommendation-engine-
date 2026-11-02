
import type { Student, Internship, Interaction, Recruiter, Job, Application } from '../types';

const today = new Date();
const daysAgo = (days: number) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const students: Student[] = [
  {
    student_id: 1,
    name: 'Utkarsh Sharma',
    email: 'utkarsh@example.com',
    skills: ['Python', 'Data Analysis', 'Machine Learning', 'Pandas', 'React'],
    interests: ['AI', 'FinTech', 'Web Development'],
    academic_score: 4.8,
    past_internship_views: [101, 103],
    location: 'Urban',
    resumeText: `Utkarsh Sharma - Data Science Enthusiast

Experience:
- Led a team of 4 on a university project to build a predictive model using Scikit-learn. Achieved 92% accuracy.
- Developed a web app with React and Pandas for data visualization.

Skills: Python, Data Analysis, Machine Learning, Pandas, React, Communication, Leadership`,
    softSkills: ['Communication', 'Leadership'],
    skillProficiencies: [{ skill: 'Python', level: 'Advanced' }, { skill: 'React', level: 'Intermediate' }],
    education: ['B.S. in Computer Science, Stanford University'],
    achievements: ["Dean's List 2023", 'Winner, University Hackathon 2022'],
    certificates: ['Certified TensorFlow Developer'],
  },
  {
    student_id: 2,
    name: 'Bob Williams',
    email: 'bob@example.com',
    skills: ['Java', 'Spring Boot', 'SQL', 'Docker', 'AWS'],
    interests: ['Cloud Computing', 'Backend Development'],
    academic_score: 4.5,
    past_internship_views: [102, 104],
    location: 'Rural',
    resumeText: `Bob Williams - Backend Developer

Experience:
- Deployed a scalable microservice using Spring Boot and Docker on AWS.
- Optimized SQL queries, improving database response time by 30%.

Skills: Java, Spring Boot, SQL, Docker, AWS, Problem Solving`,
    softSkills: ['Problem Solving'],
    skillProficiencies: [{ skill: 'Java', level: 'Advanced' }, { skill: 'AWS', level: 'Intermediate' }],
    education: ['B.S. in Software Engineering, MIT'],
    achievements: ['Published a paper on microservice architecture'],
    certificates: ['AWS Certified Developer - Associate'],
  },
  {
    student_id: 3,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    skills: ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow'],
    interests: ['Data Science', 'Machine Learning'],
    academic_score: 4.9,
    past_internship_views: [101, 105],
    location: 'Urban',
    resumeText: `Charlie Brown - Machine Learning Engineer

Project:
- Built a neural network with TensorFlow for image recognition.
- Presented findings to a panel of professors, demonstrating strong presentation skills.

Skills: Python, Pandas, Scikit-learn, TensorFlow`,
    softSkills: ['Presentation Skills'],
    skillProficiencies: [{ skill: 'TensorFlow', level: 'Advanced' }],
    education: ['M.S. in Machine Learning, Carnegie Mellon University'],
    achievements: ['Graduate Research Fellowship'],
    certificates: ['Deep Learning Specialization (Coursera)'],
  },
  {
    student_id: 4,
    name: 'Diana Prince',
    email: 'diana@example.com',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'CSS'],
    interests: ['Frontend Development', 'UI/UX Design'],
    academic_score: 4.7,
    past_internship_views: [103, 106],
    location: 'Rural',
    resumeText: `Diana Prince - Full Stack Developer

Experience:
- Designed and implemented a user-facing dashboard with React and Node.js.
- Collaborated with a UI/UX designer to create an intuitive user experience.

Skills: JavaScript, React, Node.js, MongoDB, CSS, Teamwork, UI/UX Design`,
    softSkills: ['Teamwork', 'UI/UX Design'],
    skillProficiencies: [{ skill: 'React', level: 'Advanced' }],
    education: ['B.A. in Design & Technology, Parsons School of Design'],
    achievements: ['Best UX Award, Student Showcase 2023'],
    certificates: ['MongoDB for JavaScript Developers'],
  },
];

export const internships: Internship[] = [
  {
    internship_id: 101,
    title: 'AI/ML Research Intern',
    company: 'Reliance Industries',
    location: 'Mumbai, Maharashtra',
    stipend: '₹5,000/month',
    logoColor: 'bg-blue-600',
    description: 'Work on cutting-edge machine learning models for predictive analytics. Requires strong Python and TensorFlow skills. Part of the PM Internship Scheme.',
    required_skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis', 'Pandas'],
    domain: 'Artificial Intelligence',
    postedDate: daysAgo(2),
  },
  {
    internship_id: 102,
    title: 'Backend Developer Intern',
    company: 'Tata Consultancy Services',
    location: 'Bangalore, Karnataka',
    stipend: '₹5,000/month',
    logoColor: 'bg-indigo-600',
    description: 'Develop and maintain server-side logic for our core applications. Experience with cloud services is a plus.',
    required_skills: ['Java', 'Spring Boot', 'SQL', 'REST APIs', 'AWS'],
    domain: 'Backend Development',
    postedDate: daysAgo(10),
  },
  {
    internship_id: 103,
    title: 'Frontend Engineer Intern',
    company: 'Mahindra & Mahindra',
    location: 'Pune, Maharashtra',
    stipend: '₹5,000/month',
    logoColor: 'bg-red-600',
    description: 'Build responsive and user-friendly interfaces using React.js for our customer-facing web platform.',
    required_skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git'],
    domain: 'Frontend Development',
    postedDate: daysAgo(3),
  },
  {
    internship_id: 104,
    title: 'Cloud Infrastructure Intern',
    company: 'HDFC Bank',
    location: 'Hyderabad, Telangana',
    stipend: '₹5,000/month',
    logoColor: 'bg-blue-800',
    description: 'Help manage and scale our cloud infrastructure on AWS. Involves working with Docker and Kubernetes.',
    required_skills: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'Bash'],
    domain: 'Cloud Computing',
    postedDate: daysAgo(40),
  },
  {
    internship_id: 105,
    title: 'Data Scientist Intern',
    company: 'Infosys',
    location: 'Bangalore, Karnataka',
    stipend: '₹5,000/month',
    logoColor: 'bg-cyan-600',
    description: 'Analyze large datasets to extract meaningful insights and build data-driven products. Expertise in Scikit-learn required.',
    required_skills: ['Python', 'Scikit-learn', 'Pandas', 'SQL', 'Statistics'],
    domain: 'Data Science',
    postedDate: daysAgo(5),
  },
  {
    internship_id: 106,
    title: 'Full Stack Developer Intern',
    company: 'Adani Group',
    location: 'Ahmedabad, Gujarat',
    stipend: '₹5,000/month',
    logoColor: 'bg-purple-600',
    description: 'Join our product team to build new features across the stack using MongoDB, Express.js, React, and Node.js.',
    required_skills: ['JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB'],
    domain: 'Web Development',
    postedDate: daysAgo(1),
  },
  {
    internship_id: 107,
    title: 'Software Engineer II - Google Ads',
    company: 'Google',
    location: 'Hyderabad, Telangana',
    stipend: '₹45,000/month',
    logoColor: 'bg-red-500',
    description: 'Join the Ads team to build high-scale distributed systems. Looking for strong coding skills in Python/C++ and problem-solving abilities.',
    required_skills: ['Python', 'C++', 'Distributed Systems', 'Algorithms', 'Data Structures'],
    domain: 'Software Engineering',
    postedDate: daysAgo(0),
  },
  {
    internship_id: 108,
    title: 'Software Engineer III - Google Cloud',
    company: 'Google',
    location: 'Bangalore, Karnataka',
    stipend: '₹50,000/month',
    logoColor: 'bg-blue-500',
    description: 'Work on Google Cloud Platform services. Experience with Kubernetes, Go, or Java is highly preferred for this role.',
    required_skills: ['Java', 'Go', 'Kubernetes', 'Cloud Computing', 'System Design'],
    domain: 'Cloud Computing',
    postedDate: daysAgo(1),
  },
];

export const interactions: Interaction[] = [
  { 
    student_id: 1, 
    internship_id: 101, 
    view_count: 5, 
    applied: true,
    applicationStatus: 'Technical Interview',
    appliedDate: daysAgo(5),
    lastUpdated: daysAgo(1),
    submittedResume: students[0].resumeText
  },
  { 
    student_id: 1, 
    internship_id: 103, 
    view_count: 3, 
    applied: false 
  },
  { 
    student_id: 2, 
    internship_id: 102, 
    view_count: 8, 
    applied: true,
    applicationStatus: 'Screening',
    appliedDate: daysAgo(8),
    lastUpdated: daysAgo(3),
    submittedResume: students[1].resumeText
  },
  { 
    student_id: 2, 
    internship_id: 104, 
    view_count: 4, 
    applied: true,
    applicationStatus: 'Offer',
    appliedDate: daysAgo(15),
    lastUpdated: daysAgo(1),
    submittedResume: students[1].resumeText
  },
  { student_id: 3, internship_id: 101, view_count: 10, applied: true, applicationStatus: 'Applied', appliedDate: daysAgo(1), submittedResume: students[2].resumeText },
  { student_id: 3, internship_id: 105, view_count: 6, applied: true, applicationStatus: 'Rejected', appliedDate: daysAgo(10), submittedResume: students[2].resumeText },
  { student_id: 4, internship_id: 103, view_count: 7, applied: true, applicationStatus: 'HR Interview', appliedDate: daysAgo(6), submittedResume: students[3].resumeText },
  { student_id: 4, internship_id: 106, view_count: 5, applied: false },
];


export const recruiters: Recruiter[] = [
  { recruiter_id: 1, name: 'Jane Doe', email: 'jane@techcorp.com', company: 'TechCorp' },
  { recruiter_id: 2, name: 'John Smith', email: 'john@innovateinc.com', company: 'Innovate Inc.' },
];

export const jobs: Job[] = [
  { 
    job_id: 201, 
    recruiter_id: 1, 
    title: 'Software Engineer Intern', 
    description: 'Work on our flagship product and gain real-world experience.', 
    category: 'Software Development', 
    location: 'Remote', 
    level: 'Internship', 
    salary: 'Competitive', 
    postedDate: daysAgo(5), 
    isActive: true,
    required_skills: ['JavaScript', 'React', 'Node.js']
  },
  { 
    job_id: 202, 
    recruiter_id: 2, 
    title: 'Data Analyst Intern', 
    description: 'Analyze user data to provide insights for product development.', 
    category: 'Data Science', 
    location: 'New York, NY', 
    level: 'Internship', 
    salary: '$30/hour', 
    postedDate: daysAgo(12), 
    isActive: true,
    required_skills: ['Python', 'SQL', 'Tableau']
  },
  { 
    job_id: 203, 
    recruiter_id: 1, 
    title: 'UX Designer', 
    description: 'Create intuitive and beautiful user interfaces.', 
    category: 'Design', 
    location: 'San Francisco, CA', 
    level: 'Entry-Level', 
    salary: '$75,000/year', 
    postedDate: daysAgo(30), 
    isActive: false,
    required_skills: ['Figma', 'Adobe XD', 'User Research']
  },
];

export const applications: Application[] = [
  { application_id: 301, student_id: 1, job_id: 201, status: 'Pending' },
  { application_id: 302, student_id: 3, job_id: 202, status: 'Accepted' },
  { application_id: 303, student_id: 4, job_id: 201, status: 'Pending' },
  { application_id: 304, student_id: 2, job_id: 202, status: 'Rejected' },
];