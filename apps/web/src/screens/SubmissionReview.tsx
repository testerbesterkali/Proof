import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import {
    User,
    Star,
    MessageSquare,
    Check,
    X,
    ChevronRight,
    Award,
    TrendingUp,
    ShieldCheck,
    Send
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

export const SubmissionReview = () => {
    const { submissionId } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(4);
    const [status, setStatus] = useState('UNDER_REVIEW');
    const [rubricScores, setRubricScores] = useState({
        codeQuality: 4,
        performance: 5,
        scalability: 3,
        security: 4
    });

    const candidate = {
        name: "Alex River",
        role: "Sr. Backend Engineer",
        match: 94,
        experience: "6 years",
        location: "Remote, CA"
    };

    const comments = [
        { author: "Sarah (CTO)", content: "Very clean implementation of the Redis back-off logic.", time: "2h ago" },
        { author: "Mike (Team Lead)", content: "I'm concerned about the JWT secret management here. Let's ask follow-up.", time: "45m ago" }
    ];

    const code = `// Alex River's Submission
import redis from './utils/redis';
import jwt from 'jsonwebtoken';

export class AuthService {
  async revokeToken(token: string) {
    const decoded = jwt.decode(token);
    const expiry = decoded.exp - Math.floor(Date.now() / 1000);
    await redis.setex(\`blacklist:\${token}\`, expiry, 'true');
    console.log('Token revoked and blacklisted');
  }
}`;

    return (
        <div className="flex flex-col h-screen bg-[#F4F5F6] text-[#1C1C1E] overflow-hidden">
            {/* Header */}
            <header className="h-16 border-b border-black/5 px-8 flex items-center justify-between bg-white z-20">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <ChevronRight size={20} className="rotate-180" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF9B8A] to-[#FF6B52] flex items-center justify-center text-white font-bold text-lg shadow-inner">
                            {candidate.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-base font-black tracking-tight">{candidate.name}</h1>
                                <div className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-black uppercase tracking-widest border border-green-500/20 flex items-center gap-1">
                                    <ShieldCheck size={10} />
                                    Top 1% Match
                                </div>
                            </div>
                            <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-0.5">{candidate.role} • {candidate.location}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-5 py-2 rounded-full border border-black/10 text-[11px] font-black uppercase tracking-widest hover:bg-black/5 transition-colors">
                        Save to Pool
                    </button>
                    <button className="px-5 py-2 rounded-full bg-red-500/10 text-red-600 text-[11px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-colors flex items-center gap-2">
                        <X size={14} />
                        Reject
                    </button>
                    <button className="px-5 py-2 rounded-full bg-[#1C1C1E] text-white text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center gap-2">
                        <Check size={14} />
                        Advance to Interview
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left: Code Viewer */}
                <div className="flex-1 flex flex-col bg-white border-r border-black/5 shadow-sm">
                    <div className="h-12 px-6 flex items-center justify-between border-b border-black/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Work Sample: auth_service.ts</span>
                        <div className="flex items-center gap-2 px-2 py-1 rounded bg-black/5 text-[10px] font-bold text-black/60">
                            TypeScript
                        </div>
                    </div>
                    <div className="flex-1">
                        <Editor
                            height="100%"
                            language="typescript"
                            value={code}
                            options={{
                                readOnly: true,
                                fontSize: 13,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                fontFamily: "'JetBrains Mono', monospace",
                                padding: { top: 20 },
                                theme: 'vs-light'
                            }}
                        />
                    </div>
                </div>

                {/* Middle: Rubric scoring */}
                <div className="w-[380px] flex flex-col bg-[#F4F5F6] border-r border-black/5">
                    <div className="p-8 space-y-8 overflow-y-auto">
                        <section className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-black/40 border-b border-black/5 pb-2">Scoring Rubric</h3>

                            {Object.entries(rubricScores).map(([key, value]) => (
                                <div key={key} className="space-y-3 p-4 rounded-2xl bg-white shadow-sm border border-black/[0.02]">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                        <span className="text-xs font-black text-[#FF6B52]">{value}/5</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={value}
                                        onChange={(e) => setRubricScores({ ...rubricScores, [key]: parseInt(e.target.value) })}
                                        className="w-full accent-[#FF6B52]"
                                    />
                                    <p className="text-[10px] text-black/40 italic">Evaluates how the candidate handled concurrency and data integrity.</p>
                                </div>
                            ))}
                        </section>

                        <section className="p-6 rounded-2xl bg-gradient-to-br from-[#1C1C1E] to-[#2D2D2F] text-white shadow-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Award className="text-[#FF9B8A]" size={20} />
                                <h4 className="text-sm font-black tracking-tight">AI Summary</h4>
                            </div>
                            <p className="text-[11px] text-white/70 leading-relaxed italic">
                                "Candidate Alex demonstated advanced knowledge of edge caching strategies. The code is highly idiomatic and passes 9/10 test cases for concurrency."
                            </p>
                            <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/10">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">AI Confidence</span>
                                <span className="text-xs font-bold text-green-400">92%</span>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Right: Team Discussion */}
                <div className="w-[320px] flex flex-col bg-white">
                    <div className="h-12 px-6 flex items-center border-b border-black/5">
                        <MessageSquare size={14} className="mr-2 text-black/40" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Team Discussion</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {comments.map((comment, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-black/80">{comment.author}</span>
                                    <span className="text-[9px] text-black/30">{comment.time}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-black/5 text-[11px] leading-relaxed text-black/70">
                                    {comment.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 border-t border-black/5 bg-[#F4F5F6]">
                        <div className="relative">
                            <textarea
                                placeholder="Add internal note..."
                                className="w-full bg-white border border-black/5 rounded-2xl p-4 text-[11px] outline-none shadow-sm h-24 resize-none focus:border-[#FF6B52] transition-colors"
                            />
                            <button className="absolute bottom-3 right-3 p-1.5 rounded-full bg-[#1C1C1E] text-white hover:bg-black transition-colors">
                                <Send size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
