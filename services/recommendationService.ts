
import type { Student, Internship, Interaction, Recommendation } from '../types';

// Stage 1: Candidate Generation - Content-Based Filtering
const calculateContentBasedScore = (studentSkills: string[], requiredSkills: string[]): number => {
  const studentSkillSet = new Set(studentSkills.map(s => s.toLowerCase()));
  const requiredSkillSet = new Set(requiredSkills.map(s => s.toLowerCase()));
  
  if (requiredSkillSet.size === 0) return 0;

  let intersectionSize = 0;
  for (const skill of requiredSkillSet) {
    if (studentSkillSet.has(skill)) {
      intersectionSize++;
    }
  }
  
  return intersectionSize / requiredSkillSet.size;
};

// Stage 1: Candidate Generation - Collaborative Filtering
const calculateCollaborativeScore = (
  student: Student,
  internship: Internship,
  interactions: Interaction[],
  students: Student[]
): number => {
  const similarStudents = students.filter(s => {
    if (s.student_id === student.student_id) return false;
    return s.past_internship_views.some(viewedId => student.past_internship_views.includes(viewedId));
  });

  if (similarStudents.length === 0) return 0;

  const similarStudentIds = new Set(similarStudents.map(s => s.student_id));
  const hasSimilarApplicant = interactions.some(interaction => 
    interaction.internship_id === internship.internship_id &&
    interaction.applied &&
    similarStudentIds.has(interaction.student_id)
  );
  
  return hasSimilarApplicant ? 1.0 : 0.2;
};

// --- Main Recommendation Pipeline ---
export const recommendInternships = (
  student: Student,
  allInternships: Internship[],
  allStudents: Student[],
  allInteractions: Interaction[],
  n: number = 5
): Recommendation[] => {
  
  // --- Stage 1: Candidate Generation (Hybrid Model) ---
  const candidates = allInternships.map(internship => {
    const contentBasedScore = calculateContentBasedScore(student.skills, internship.required_skills);
    const collaborativeScore = calculateCollaborativeScore(student, internship, allInteractions, allStudents);
    const hybridScore = (contentBasedScore * 0.7) + (collaborativeScore * 0.3); // Weighted more towards skills
    return {
      ...internship,
      score: hybridScore,
      contentBasedScore,
      collaborativeScore,
      freshnessBoost: 0,
      diversityPenalty: 0,
    };
  });

  // --- Stage 2: Scoring (Freshness) ---
  const today = new Date();
  const scoredCandidates = candidates.map(cand => {
    // Freshness Boost
    const postedDate = new Date(cand.postedDate);
    const daysOld = (today.getTime() - postedDate.getTime()) / (1000 * 3600 * 24);
    const freshnessBoost = Math.max(0, 1 - (daysOld / 30)) * 0.1; // +0.1 for new, 0 for >30 days old
    
    cand.score += freshnessBoost;
    cand.freshnessBoost = freshnessBoost;

    // Live Result Boost: If it's a web-scouted result, give it a significant relevance boost
    if (cand.source && cand.source !== 'Portal Job') {
      cand.score += 0.25; 
    }

    return cand;
  });

  // Sort by score before re-ranking
  let rankedCandidates = scoredCandidates.sort((a, b) => b.score - a.score);

  // --- Stage 3: Re-ranking (Diversity & Final Selection) ---
  const finalRecommendations: Recommendation[] = [];
  const seenDomains = new Set<string>();

  // Filter out extremely low matches only if we have plenty of good ones
  const filteredRanked = rankedCandidates.filter(c => c.score > 0.1 || (c.source && c.source !== 'Portal Job'));

  for (const cand of filteredRanked) {
    if (finalRecommendations.length >= n) break;

    let diversityPenalty = 0;
    if (seenDomains.has(cand.domain)) {
      diversityPenalty = 0.03; // Reduced penalty to show more results
      cand.score -= diversityPenalty;
      cand.diversityPenalty = diversityPenalty;
    }
    
    finalRecommendations.push(cand);
    seenDomains.add(cand.domain);
  }

  // If we still have space and high n, add more even if they repeat domains
  if (finalRecommendations.length < n) {
    for (const cand of rankedCandidates) {
       if (finalRecommendations.length >= n) break;
       if (!finalRecommendations.find(r => r.internship_id === cand.internship_id)) {
           finalRecommendations.push(cand);
       }
    }
  }

  // Final sort
  return finalRecommendations
    .sort((a, b) => b.score - a.score);
};

// --- Skill Gap Remediation ---
export interface SkillGap {
  skill: string;
}

export const getSkillGap = (studentSkills: string[], requiredSkills: string[]): SkillGap[] => {
  const studentSkillSet = new Set(studentSkills.map(s => s.toLowerCase()));
  const missingSkills = requiredSkills.filter(skill => !studentSkillSet.has(skill.toLowerCase()));

  return missingSkills.slice(0, 3).map(skill => ({ skill }));
};