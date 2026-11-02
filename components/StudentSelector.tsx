
import React from 'react';
import type { Student } from '../types';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface StudentSelectorProps {
  students: Student[];
  selectedStudentId: number;
  onSelectStudent: (studentId: number) => void;
}

export const StudentSelector: React.FC<StudentSelectorProps> = ({ students, selectedStudentId, onSelectStudent }) => {
  return (
    <div className="relative w-full">
      <select
        value={selectedStudentId}
        onChange={(e) => onSelectStudent(Number(e.target.value))}
        className="appearance-none w-full bg-white border border-slate-300 text-slate-700 py-3 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      >
        {students.map((student) => (
          <option key={student.student_id} value={student.student_id}>
            {student.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
        <ChevronDownIcon className="h-5 w-5" />
      </div>
    </div>
  );
};
