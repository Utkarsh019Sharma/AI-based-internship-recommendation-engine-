
import React from 'react';
import { ScaleIcon } from './icons/ScaleIcon';

interface FairnessDashboardProps {
  isEnabled: boolean;
  onToggle: (isEnabled: boolean) => void;
}

export const FairnessDashboard: React.FC<FairnessDashboardProps> = ({ isEnabled, onToggle }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-3">
        <ScaleIcon className="h-6 w-6 text-indigo-500" />
        <h2 className="text-xl font-semibold text-slate-800">Fairness Dashboard</h2>
      </div>
      <p className="text-sm text-slate-600 mb-4">
        Mitigate algorithmic bias by boosting recommendations for students from underrepresented backgrounds.
      </p>
      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
        <label htmlFor="fairness-toggle" className="font-semibold text-slate-700">
          Enable Fairness Optimization
        </label>
        <button
          id="fairness-toggle"
          onClick={() => onToggle(!isEnabled)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
            isEnabled ? 'bg-indigo-600' : 'bg-slate-300'
          }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      {isEnabled && (
        <p className="text-xs text-indigo-700 mt-2 font-medium">
          Fairness boost is active for Rural candidates.
        </p>
      )}
    </div>
  );
};
