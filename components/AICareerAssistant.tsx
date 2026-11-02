import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Loader2, MinusCircle, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getGeneralAIResponse } from '../services/geminiService';
import type { Student, ChatMessage } from '../types';

interface AICareerAssistantProps {
    student: Student | null;
}

export const AICareerAssistant: React.FC<AICareerAssistantProps> = ({ student }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize with a welcome message
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                { 
                    sender: 'ai', 
                    text: `Hi ${student?.name?.split(' ')[0] || 'there'}! 👋 I'm your AI Career Assistant. \n\nYou can ask me anything about:\n- Internship opportunities\n- Resume improvement\n- Interview tips\n- Career guidance\n\nHow can I help you today?` 
                }
            ]);
        }
    }, [student, messages.length]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen, isMinimized]);

    const handleSend = useCallback(async (text?: string) => {
        const messageToSend = text || userInput;
        if (!messageToSend.trim() || isLoading) return;

        const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: messageToSend }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        try {
            const context = student ? {
                name: student.name,
                skills: student.skills
            } : undefined;

            const aiResponse = await getGeneralAIResponse(messageToSend, context);
            setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'ai', text: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!" }]);
        } finally {
            setIsLoading(false);
        }
    }, [userInput, messages, isLoading, student]);

    const quickQuestions = [
        "How to get a tech internship?",
        "Tips for resume writing",
        "Explain PM Internship Scheme",
        "Common interview questions"
    ];

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setIsMinimized(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            height: isMinimized ? 'auto' : '500px',
                            width: '380px'
                        }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden mb-4 flex flex-col max-w-[calc(100vw-48px)] transition-all duration-300"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-1.5 rounded-lg">
                                    <Sparkles className="h-5 w-5 text-blue-100" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Career Assistant</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                        <span className="text-[10px] text-blue-100 font-medium">Always Active</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button 
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="p-1 hover:bg-white/10 rounded-md transition"
                                >
                                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <MinusCircle className="h-4 w-4" />}
                                </button>
                                <button 
                                    onClick={toggleChat}
                                    className="p-1 hover:bg-white/10 rounded-md transition"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        {!isMinimized && (
                            <>
                                <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50 min-h-0">
                                    {messages.map((msg, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                                                msg.sender === 'user' 
                                                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-100' 
                                                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                                            }`}>
                                                <div className="prose prose-slate prose-sm max-w-none prose-p:leading-tight prose-p:my-1 prose-headings:text-slate-900 prose-headings:font-bold prose-headings:my-1 prose-ul:my-1 prose-li:my-0.5">
                                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                                <span className="text-xs text-slate-500 font-medium">Assistant is thinking...</span>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Quick Questions */}
                                <div className="p-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto scrollbar-hide no-scrollbar">
                                    {quickQuestions.map(q => (
                                        <button
                                            key={q}
                                            onClick={() => handleSend(q)}
                                            className="whitespace-nowrap text-[11px] font-medium px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-full transition text-slate-600 border border-slate-200 flex-shrink-0"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="p-3 bg-white border-t flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Ask a question..."
                                        className="flex-grow bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none placeholder:text-slate-400"
                                    />
                                    <button
                                        onClick={() => handleSend()}
                                        disabled={!userInput.trim() || isLoading}
                                        className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:bg-slate-400 shadow-lg shadow-blue-200 flex-shrink-0"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FAB Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleChat}
                className="bg-blue-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden group"
            >
                {/* Glow effect */}
                <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full"></span>
                
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
                
                {/* Unread dot */}
                {!isOpen && (
                    <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 border-2 border-white rounded-full"></span>
                )}
            </motion.button>
        </div>
    );
};
