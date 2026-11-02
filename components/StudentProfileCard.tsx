import React from 'react';
import type { Student, SkillProficiency } from '../types';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface StudentProfileCardProps {
  student: Student | null;
  onEditProfile: () => void;
}

const ProfileItem: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode }> = ({ icon, label, children }) => (
    <div className="flex items-start space-x-3">
        <div className="text-blue-500 mt-1">{icon}</div>
        <div>
            <h4 className="text-sm font-semibold text-slate-600">{label}</h4>
            <div className="text-sm text-slate-800">{children}</div>
        </div>
    </div>
);

const ProficiencyBadge: React.FC<{ level: SkillProficiency['level'] }> = ({ level }) => {
    const levelStyles = {
        'Beginner': 'bg-slate-200 text-slate-700',
        'Intermediate': 'bg-yellow-200 text-yellow-800',
        'Advanced': 'bg-green-200 text-green-800',
    };
    return <span className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${levelStyles[level]}`}>{level.charAt(0)}</span>;
}

export const StudentProfileCard: React.FC<StudentProfileCardProps> = ({ student, onEditProfile }) => {
  if (!student) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-4">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  const isProfileIncomplete = !student.skills || student.skills.length === 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-slate-800 mb-1">{student.name}</h3>
      <p className="text-sm text-slate-500 mb-4">{student.location ? `${student.location} Candidate` : 'Location not specified'}</p>
      
      {isProfileIncomplete && (
        <div className="my-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <h4 className="font-semibold text-amber-800">Complete Your Profile!</h4>
          <p className="text-sm text-amber-700 mt-1">Add your skills and education to get personalized internship recommendations.</p>
          <button onClick={onEditProfile} className="mt-3 bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition text-sm">
              Edit Profile
          </button>
        </div>
      )}
      
      <div className="space-y-4">
        {student.skills && student.skills.length > 0 ? (
            <ProfileItem icon={<BriefcaseIcon className="h-5 w-5" />} label="Hard Skills">
                <div className="flex flex-wrap gap-2">
                    {student.skills.map(skill => (
                        <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
                    ))}
                </div>
            </ProfileItem>
        ) : null}

        {student.softSkills && student.softSkills.length > 0 && (
            <ProfileItem icon={<SparklesIcon className="h-5 w-5 text-purple-500" />} label="Inferred Soft Skills (AI)">
                 <div className="flex flex-wrap gap-2">
                    {student.softSkills.map(skill => (
                        <span key={skill} className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
                    ))}
                </div>
            </ProfileItem>
        )}

        {student.skillProficiencies && student.skillProficiencies.length > 0 && (
            <ProfileItem icon={<SparklesIcon className="h-5 w-5 text-yellow-500" />} label="Skill Proficiencies (AI)">
                 <div className="space-y-2">
                    {student.skillProficiencies.map(({skill, level}) => (
                        <div key={skill} className="flex items-center space-x-2">
                            <ProficiencyBadge level={level} />
                            <span className="text-sm">{skill}</span>
                        </div>
                    ))}
                </div>
            </ProfileItem>
        )}

        {student.interests && student.interests.length > 0 ? (
            <ProfileItem icon={<LightBulbIcon className="h-5 w-5" />} label="Interests">
                <div className="flex flex-wrap gap-2">
                    {student.interests.map(interest => (
                        <span key={interest} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{interest}</span>
                    ))}
                </div>
            </ProfileItem>
        ) : null}
        
        {student.academic_score !== null && (
            <ProfileItem icon={<AcademicCapIcon className="h-5 w-5" />} label="Academic Score">
                <p className="font-semibold text-blue-600">{student.academic_score.toFixed(1)} / 5.0</p>
            </ProfileItem>
        )}
      </div>
    </div>
  );
};
