import React, { useState } from 'react';
import { scoutLiveInternships, ScoutResult } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { BuildingOfficeIcon } from './icons/BuildingOfficeIcon';
import { MapIcon } from './icons/MapIcon';

export const LiveInternshipScout: React.FC = () => {
    const [query, setQuery] = useState('PM Internship Scheme India');
    const [results, setResults] = useState<ScoutResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleScout = async () => {
        setIsLoading(true);
        setError(null);
        setResults(null);
        try {
            const data = await scoutLiveInternships(query);
            setResults(data);
        } catch (e) {
            setError("Could not fetch live data. Please check your internet or API key.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-100 p-2 rounded-full">
                    <SparklesIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Live Opportunity Scout</h3>
                    <p className="text-xs text-slate-500">Powered by Gemini + Google Search</p>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Search for updated internships (e.g., "PM Internship Scheme Top Companies")
                </label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-grow border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button 
                        onClick={handleScout}
                        disabled={isLoading}
                        className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:bg-slate-300 flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Scouting...
                            </>
                        ) : 'Scout Web'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                    {error}
                </div>
            )}

            {results && results.internships.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Live Results from Web</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.internships.map((internship, idx) => (
                            <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:shadow-lg transition bg-slate-50">
                                <h5 className="font-bold text-slate-800 text-lg">{internship.title}</h5>
                                <div className="flex flex-wrap gap-2 my-2">
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">
                                        <BuildingOfficeIcon className="h-3 w-3" />
                                        {internship.company}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">
                                        <MapIcon className="h-3 w-3" />
                                        {internship.location}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 line-clamp-2">{internship.description}</p>
                                <div className="mt-3 pt-3 border-t border-slate-200">
                                    <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">Active / Live Listing</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {results.groundingMetadata?.groundingChunks && (
                        <div className="mt-4 pt-4 border-t border-indigo-100">
                            <p className="text-xs text-slate-500 mb-2 font-semibold">Sources & Verification:</p>
                            <ul className="text-xs text-blue-600 space-y-1">
                                {results.groundingMetadata.groundingChunks.map((chunk: any, i: number) => {
                                    if (chunk.web?.uri) {
                                        return (
                                            <li key={i}>
                                                <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                                                    🔗 {chunk.web.title || chunk.web.uri}
                                                </a>
                                            </li>
                                        );
                                    }
                                    return null;
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            )}
            
            {results && results.internships.length === 0 && (
                <p className="text-slate-500 text-sm italic">No live internships found for this query right now.</p>
            )}
        </div>
    );
};