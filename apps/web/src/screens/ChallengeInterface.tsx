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
    Play,
    Loader2
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ChallengeData {
    id: string;
    title: string;
    description: string;
    type: string;
    jobRole: string | null;
    timeLimitMins: number | null;
    requiredSkills: string[];
    companyName: string;
}

export const ChallengeInterface = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [challenge, setChallenge] = useState<ChallengeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState('// Your solution goes here\n\nfunction solve() {\n  \n}');
    const [language, setLanguage] = useState('javascript');
    const [timeLeft, setTimeLeft] = useState(3600);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [grading, setGrading] = useState(false);
    const [gradeResult, setGradeResult] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('instructions');
    const [consoleOutput, setConsoleOutput] = useState<string[]>(['> Ready. Write and run your code.']);
    const [running, setRunning] = useState(false);
    const [showConsole, setShowConsole] = useState(false);
    const [outputTab, setOutputTab] = useState<'preview' | 'console'>('preview');
    const [previewHtml, setPreviewHtml] = useState('');

    // Fetch challenge data
    useEffect(() => {
        if (!id) return;
        const fetchChallenge = async () => {
            setLoading(true);
            try {
                const { data: rawChallenge } = await supabase
                    .from('Challenge')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (!rawChallenge) return;

                // Fetch employer name
                const { data: employer } = await supabase
                    .from('EmployerProfile')
                    .select('companyName')
                    .eq('id', rawChallenge.employerId)
                    .single();

                setChallenge({
                    id: rawChallenge.id,
                    title: rawChallenge.title,
                    description: rawChallenge.description,
                    type: rawChallenge.type,
                    jobRole: rawChallenge.jobRole,
                    timeLimitMins: rawChallenge.timeLimitMins,
                    requiredSkills: rawChallenge.requiredSkills || [],
                    companyName: employer?.companyName || 'Unknown Company',
                });

                // Set timer from challenge time limit
                if (rawChallenge.timeLimitMins) {
                    setTimeLeft(rawChallenge.timeLimitMins * 60);
                }
            } catch (err) {
                console.error('Failed to load challenge:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchChallenge();
    }, [id]);

    // Timer countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Listen for console output from the sandboxed iframe
    useEffect(() => {
        const handler = (e: MessageEvent) => {
            if (e.data?.type === 'console' && Array.isArray(e.data.logs)) {
                setConsoleOutput(['> Running ' + language + '...', '', ...e.data.logs]);
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, [language]);

    const handleRunCode = () => {
        setRunning(true);
        setShowConsole(true);
        setConsoleOutput(['> Running ' + language + '...', '']);

        const codeStr = code;
        const trimmed = codeStr.trim();
        // Only treat as HTML if code actually starts with HTML tags
        const hasHtml = /^\s*<(!DOCTYPE|html|head|body|div|section|header|main|nav|form|table|ul|ol|style)/i.test(trimmed);

        // Console capture script — sends logs from iframe to parent via postMessage
        const consoleCapture = `<script>
(function() {
  var origLog = console.log, origWarn = console.warn, origError = console.error;
  var logs = [];
  function ts() { return new Date().toLocaleTimeString('en-US', {hour12:false}); }
  console.log = function() {
    var args = Array.prototype.slice.call(arguments);
    logs.push('[' + ts() + '] ' + args.map(function(a) { return typeof a === 'object' ? JSON.stringify(a) : String(a); }).join(' '));
    origLog.apply(console, arguments);
    parent.postMessage({type:'console', logs: logs.slice()}, '*');
  };
  console.warn = function() {
    var args = Array.prototype.slice.call(arguments);
    logs.push('[' + ts() + '] ⚠ ' + args.map(String).join(' '));
    origWarn.apply(console, arguments);
    parent.postMessage({type:'console', logs: logs.slice()}, '*');
  };
  console.error = function() {
    var args = Array.prototype.slice.call(arguments);
    logs.push('[' + ts() + '] ✖ ' + args.map(String).join(' '));
    origError.apply(console, arguments);
    parent.postMessage({type:'console', logs: logs.slice()}, '*');
  };
  window.onerror = function(msg) {
    logs.push('✖ Error: ' + msg);
    parent.postMessage({type:'console', logs: logs.slice()}, '*');
  };
  // Signal completion after a delay
  setTimeout(function() {
    logs.push('');
    logs.push('✓ Execution completed');
    parent.postMessage({type:'console', logs: logs.slice()}, '*');
  }, 500);
})();
<\/script>`;

        let html = '';
        if (hasHtml) {
            if (/^\s*<(!DOCTYPE|html)/i.test(trimmed)) {
                // Inject console capture before closing </head> or at start
                html = codeStr.replace(/<\/head>/i, consoleCapture + '</head>');
                if (!/<\/head>/i.test(codeStr)) {
                    html = consoleCapture + codeStr;
                }
            } else {
                html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:system-ui,-apple-system,sans-serif;}</style>${consoleCapture}</head><body>${codeStr}</body></html>`;
            }
        } else {
            // JavaScript — wrap in HTML page with script execution
            html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:system-ui,-apple-system,sans-serif;background:#fff;color:#1a1a1a;}</style>${consoleCapture}</head><body>
<script>
try {
${codeStr}
} catch(e) {
  console.error(e.message);
  document.body.innerHTML = '<pre style="color:#ff6b6b;padding:16px;font-family:monospace">' + e.message + '<\\/pre>';
}
<\/script></body></html>`;
        }

        setPreviewHtml(html);
        setOutputTab('preview');
        setRunning(false);
    };

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async () => {
        if (!user || !challenge) return;
        setIsSubmitting(true);
        try {
            // Get or create candidate profile
            const { data: profiles } = await supabase
                .from('CandidateProfile')
                .select('id')
                .eq('userId', user.id);

            let candidateId = profiles?.[0]?.id;

            if (!candidateId) {
                // Auto-create a candidate profile for this user
                candidateId = crypto.randomUUID();
                const { error: profileError } = await supabase
                    .from('CandidateProfile')
                    .insert({
                        id: candidateId,
                        userId: user.id,
                        headline: '',
                        onboardingCompleted: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    });
                if (profileError) {
                    console.error('Profile create error:', profileError);
                    throw new Error('Could not create profile');
                }
            }

            const submissionId = crypto.randomUUID();
            const { error } = await supabase
                .from('Submission')
                .insert({
                    id: submissionId,
                    challengeId: challenge.id,
                    candidateId: candidateId,
                    content: { code, language },
                    assetUrls: [],
                    status: 'UNDER_REVIEW',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });

            if (error) throw error;

            // Trigger AI grading
            setSubmitted(true);
            setGrading(true);
            try {
                const { data: gradeData } = await supabase.functions.invoke('grade-submission', {
                    body: { submissionId },
                });
                if (gradeData?.score) {
                    setGradeResult(gradeData.score);
                }
            } catch (gradeErr) {
                console.error('Grading error (non-blocking):', gradeErr);
            } finally {
                setGrading(false);
            }
        } catch (err: any) {
            console.error('Submit error:', err);
            alert(err.message || 'Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0A0A0A]">
                <Loader2 className="w-8 h-8 animate-spin text-white/30" />
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#0A0A0A] text-white">
                <h1 className="text-2xl font-bold mb-2">Challenge Not Found</h1>
                <p className="text-white/40 mb-6">This challenge may have been removed or doesn't exist.</p>
                <button onClick={() => navigate('/challenges')} className="bg-[#FF6B52] text-white px-6 py-2 rounded-full text-sm font-bold">
                    Back to Challenges
                </button>
            </div>
        );
    }

    if (submitted) {
        const scoreColor = (s: number) => s >= 80 ? 'text-green-400' : s >= 60 ? 'text-amber-400' : 'text-red-400';
        const dimensions = gradeResult ? [
            { label: 'Correctness', value: gradeResult.correctness, weight: '30%' },
            { label: 'Code Quality', value: gradeResult.codeQuality, weight: '25%' },
            { label: 'Efficiency', value: gradeResult.efficiency, weight: '15%' },
            { label: 'Best Practices', value: gradeResult.bestPractices, weight: '15%' },
            { label: 'Completeness', value: gradeResult.completeness, weight: '15%' },
        ] : [];

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] text-white p-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="mb-6">
                    <CheckCircle className="w-16 h-16 text-green-400" />
                </motion.div>
                <h1 className="text-3xl font-bold mb-2">Proof Submitted!</h1>

                {grading ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-[#FF6B52]" />
                        <p className="text-white/50 text-sm font-medium">AI is reviewing your code...</p>
                        <div className="flex gap-1 mt-2">
                            {[0, 1, 2].map(i => (
                                <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3 }} className="w-2 h-2 rounded-full bg-[#FF6B52]" />
                            ))}
                        </div>
                    </motion.div>
                ) : gradeResult ? (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 w-full max-w-lg">
                        {/* Overall Score */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center mb-6">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">AI Score</p>
                            <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.4 }} className={`text-7xl font-black ${scoreColor(gradeResult.overall)}`}>
                                {gradeResult.overall}
                            </motion.p>
                            <p className="text-white/40 text-sm font-medium mt-2">{gradeResult.summary}</p>
                        </div>

                        {/* Dimension Scores */}
                        <div className="grid grid-cols-5 gap-2 mb-6">
                            {dimensions.map((d, i) => (
                                <motion.div key={d.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                                    <p className={`text-xl font-black ${scoreColor(d.value)}`}>{d.value}</p>
                                    <p className="text-[8px] font-bold uppercase tracking-widest text-white/30 mt-1 leading-tight">{d.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Strengths & Improvements */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-4">
                                <p className="text-[9px] font-black uppercase tracking-widest text-green-400/60 mb-2">Strengths</p>
                                <ul className="space-y-1.5">
                                    {(gradeResult.strengths || []).map((s: string, i: number) => (
                                        <li key={i} className="text-xs text-green-300/80 font-medium flex items-start gap-2">
                                            <CheckCircle size={10} className="text-green-400 mt-0.5 shrink-0" /> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4">
                                <p className="text-[9px] font-black uppercase tracking-widest text-amber-400/60 mb-2">Improvements</p>
                                <ul className="space-y-1.5">
                                    {(gradeResult.improvements || []).map((s: string, i: number) => (
                                        <li key={i} className="text-xs text-amber-300/80 font-medium flex items-start gap-2">
                                            <Info size={10} className="text-amber-400 mt-0.5 shrink-0" /> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <button onClick={() => navigate('/dashboard')} className="w-full bg-[#FF6B52] hover:bg-[#FF8B77] text-white py-3 rounded-xl font-bold text-sm transition-all">
                            Go to Dashboard →
                        </button>
                    </motion.div>
                ) : (
                    <div className="mt-6">
                        <p className="text-white/40 text-sm mb-4">Your submission has been recorded.</p>
                        <button onClick={() => navigate('/dashboard')} className="bg-[#FF6B52] text-white px-6 py-2 rounded-full text-sm font-bold">
                            Go to Dashboard →
                        </button>
                    </div>
                )}
            </div>
        );
    }

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
                        <h1 className="text-sm font-bold tracking-tight">{challenge.title}</h1>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">
                            {challenge.companyName} {challenge.jobRole ? `· ${challenge.jobRole}` : ''}
                        </p>
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
                        {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Submitting...</> : <>Submit Challenge <Send size={14} /></>}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left Panel: Instructions */}
                <div className="w-[450px] border-right border-white/10 flex flex-col bg-[#0F0F0F]">
                    <div className="flex border-b border-white/10">
                        {['instructions', 'skills'].map((tab) => (
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
                                        <h2 className="text-lg font-bold">{challenge.title}</h2>
                                        <p className="text-white/70 leading-relaxed whitespace-pre-line">
                                            {challenge.description}
                                        </p>
                                    </section>

                                    {challenge.timeLimitMins && (
                                        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
                                            <Clock size={18} className="text-amber-400 shrink-0 mt-0.5" />
                                            <p className="text-[11px] text-amber-300 leading-normal">
                                                Time limit: {challenge.timeLimitMins} minutes. The timer started when you opened this page.
                                            </p>
                                        </div>
                                    )}

                                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
                                        <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
                                        <p className="text-[11px] text-blue-300 leading-normal">
                                            Write your solution in the editor. When ready, click "Submit Challenge" to send your proof.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'skills' && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <h3 className="text-sm font-bold text-white/90">Required Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {challenge.requiredSkills.map(skill => (
                                            <span key={skill} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    {challenge.requiredSkills.length === 0 && (
                                        <p className="text-white/30 text-sm">No specific skills listed for this challenge.</p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Panel: Code Editor + Preview Split */}
                <div className="flex-1 flex flex-row relative">
                    {/* Editor Side */}
                    <div className={`flex flex-col ${showConsole ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
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
                                <button
                                    onClick={handleRunCode}
                                    disabled={running}
                                    className="bg-green-500/10 hover:bg-green-500/20 text-green-400 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {running ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                                    {running ? 'Running...' : 'Run Code'}
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
                                    fontFamily: "'JetBrains Mono', monospace",
                                    padding: { top: 20 }
                                }}
                            />
                        </div>
                    </div>

                    {/* Preview / Console Side */}
                    {showConsole && (
                        <div className="w-1/2 border-l border-white/10 flex flex-col bg-[#0A0A0A]">
                            {/* Tabs header */}
                            <div className="h-10 bg-[#151515] border-b border-white/5 px-4 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-1">
                                    {(['preview', 'console'] as const).map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setOutputTab(tab)}
                                            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors rounded ${outputTab === tab ? 'text-[#FF6B52] bg-white/5' : 'text-white/30 hover:text-white/50'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                    {running && <Loader2 size={10} className="animate-spin text-green-400 ml-2" />}
                                </div>
                                <div className="flex items-center gap-3">
                                    {outputTab === 'console' && (
                                        <button onClick={() => setConsoleOutput(['> Ready.'])} className="text-[10px] font-bold text-white/30 hover:text-white/60 uppercase tracking-widest">
                                            Clear
                                        </button>
                                    )}
                                    <button onClick={() => setShowConsole(false)} className="text-white/30 hover:text-white/60 text-xs font-bold">
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-hidden">
                                {outputTab === 'preview' ? (
                                    previewHtml ? (
                                        <iframe
                                            srcDoc={previewHtml}
                                            className="w-full h-full border-0 bg-white"
                                            sandbox="allow-scripts allow-modals"
                                            title="Preview"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-white/20 text-xs font-medium">
                                            Click "Run Code" to see the preview
                                        </div>
                                    )
                                ) : (
                                    <div className="h-full overflow-y-auto p-4 font-mono text-xs">
                                        {consoleOutput.map((line, i) => (
                                            <p key={i} className={`leading-relaxed ${line.includes('✖') ? 'text-red-400' :
                                                line.includes('⚠') ? 'text-amber-400' :
                                                    line.includes('✓') ? 'text-green-400' :
                                                        line.startsWith('>') ? 'text-white/50' :
                                                            line.startsWith('←') ? 'text-blue-400' :
                                                                'text-white/70'
                                                }`}>{line || '\u00A0'}</p>
                                        ))}
                                        {running && <p className="text-white/30 animate-pulse">Running...</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
