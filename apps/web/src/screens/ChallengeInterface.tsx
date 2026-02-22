import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    Send,
    CheckCircle,
    ChevronLeft,
    Info,
    Settings,
    Play
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

export const ChallengeInterface = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [code, setCode] = useState('// Your solution goes here\n\nfunction solve() {\n  \n}');
    const [language, setLanguage] = useState('javascript');
    const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('instructions');

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            navigate('/dashboard');
        }, 2000);
    };

    return (
        <div className="flex flex-col h-screen bg-[#0A0A0A] text-white overflow-hidden">
            {/* Header */}
            <header className="h-14 border-b border-white/10 px-6 flex items-center justify-between bg-[#0A0A0A]/80 backdrop-blur-xl z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <ChevronLeft size={20} className="text-white/60" />
                    </button>
                    <div className="h-4 w-px bg-white/10" />
                    <div>
                        <h1 className="text-sm font-bold tracking-tight">System Design: Scaling Authentication</h1>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">Technical Challenge</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${timeLeft < 300 ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/10 text-white/60'
                        }`}>
                        <Clock size={14} />
                        <span className="text-xs font-mono font-bold">{formatTime(timeLeft)}</span>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-[#FF6B52] hover:bg-[#FF8B77] text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg hover:shadow-[#FF6B52]/20 flex items-center gap-2"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Challenge'}
                        <Send size={14} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left Panel: Instructions */}
                <div className="w-[450px] border-right border-white/10 flex flex-col bg-[#0F0F0F]">
                    <div className="flex border-b border-white/10">
                        {['instructions', 'tests', 'output'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors relative ${activeTab === tab ? 'text-[#FF6B52]' : 'text-white/40 hover:text-white/60'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="tab-underline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B52]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 prose prose-invert prose-sm">
                        <AnimatePresence mode="wait">
                            {activeTab === 'instructions' && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <section>
                                        <h2 className="text-lg font-bold">The Problem</h2>
                                        <p className="text-white/70 leading-relaxed">
                                            Our current authentication system is struggling with peak traffic.
                                            Implement a highly scalable token-based authentication service using the
                                            provided interfaces. You need to focus on low-latency validation and
                                            secure token revocation.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-sm font-bold text-white/90">Requirements</h3>
                                        <ul className="list-disc pl-4 space-y-2 text-white/60">
                                            <li>Use JWT for session management</li>
                                            <li>Implement a Redis-backed blacklist for revocation</li>
                                            <li>Ensure O(1) time complexity for common operations</li>
                                            <li>Handle edge cases for expired tokens</li>
                                        </ul>
                                    </section>

                                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
                                        <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
                                        <p className="text-[11px] text-blue-300 leading-normal">
                                            You can use any standard libraries. External network calls are disabled
                                            for this environment.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Panel: Code Editor */}
                <div className="flex-1 flex flex-col relative">
                    <div className="h-10 bg-[#151515] border-b border-white/5 px-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Editor</span>
                            <div className="h-3 w-px bg-white/10" />
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="bg-transparent text-[10px] font-bold text-white/60 outline-none"
                            >
                                <option value="javascript">JavaScript</option>
                                <option value="typescript">TypeScript</option>
                                <option value="python">Python</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-white/40 hover:text-white/60 transition-colors">
                                <Settings size={14} />
                            </button>
                            <button className="bg-green-500/10 hover:bg-green-500/20 text-green-400 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                                <Play size={12} fill="currentColor" />
                                Run Tests
                            </button>
                        </div>
                    </div>

                    <div className="flex-1">
                        <Editor
                            height="100%"
                            theme="vs-dark"
                            language={language}
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            options={{
                                fontSize: 13,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                borderRadius: 10,
                                fontFamily: "'JetBrains Mono', monospace",
                                padding: { top: 20 }
                            }}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};
