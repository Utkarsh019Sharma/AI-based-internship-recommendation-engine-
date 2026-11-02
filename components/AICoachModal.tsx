import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Student, Internship, ChatMessage } from '../types';
import { startAICoachSession, getAICoachResponse } from '../services/geminiService';
import { XMarkIcon } from './icons/XMarkIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface AICoachModalProps {
  student: Student;
  internship: Internship;
  onClose: () => void;
}

const TypingIndicator = () => (
    <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
    </div>
);

export const AICoachModal: React.FC<AICoachModalProps> = ({ student, internship, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        startAICoachSession(student.name, internship.title, student.skills);
        setMessages([
            { sender: 'ai', text: `Hi ${student.name}! I'm Coach Gemini. I see you're interested in the ${internship.title} role. How can I help you prepare today? You can ask me for mock interview questions, or how to best present your skills.` }
        ]);
    }, [student, internship]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = useCallback(async () => {
        if (!userInput.trim()) return;

        const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        const aiResponse = await getAICoachResponse(userInput);
        setMessages([...newMessages, { sender: 'ai', text: aiResponse }]);
        setIsLoading(false);
    }, [userInput, messages]);
    
    const quickPrompts = [
        "Ask me some mock interview questions.",
        "How should I talk about my skills for this role?",
        "What are the key responsibilities of a " + internship.title + "?"
    ]

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <SparklesIcon className="h-6 w-6 text-indigo-500" />
                        <h3 className="text-xl font-bold text-slate-900">AI Career Coach</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-grow p-4 overflow-y-auto bg-slate-50 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">G</div>}
                            <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end gap-2 justify-start">
                             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">G</div>
                             <div className="max-w-md p-3 rounded-lg bg-slate-200 text-slate-800">
                                <TypingIndicator />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 border-t bg-white flex-shrink-0">
                     <div className="flex flex-wrap gap-2 mb-2">
                        {quickPrompts.map(prompt => (
                            <button key={prompt} onClick={() => setUserInput(prompt)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-full transition">
                                {prompt}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                            placeholder="Type your message..."
                            className="flex-grow border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading || !userInput.trim()} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:bg-slate-300">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
