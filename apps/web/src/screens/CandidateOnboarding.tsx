import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
    User, ArrowRight, ArrowLeft, MapPin, Briefcase, Code, Palette, BarChart3,
    PenTool, Megaphone, Database, Globe, Camera, CheckCircle, Zap,
    Github, Linkedin, DollarSign, Clock, FileUp, Sparkles, Loader2
} from 'lucide-react';

const skillCategories = [
    { icon: Code, label: 'Engineering', skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Go', 'Rust', 'AWS', 'Docker'] },
    { icon: Palette, label: 'Design', skills: ['UI/UX', 'Figma', 'Prototyping', 'Design Systems', 'Motion Design', 'Branding'] },
    { icon: BarChart3, label: 'Data', skills: ['SQL', 'Python', 'Machine Learning', 'Analytics', 'Tableau', 'Spark'] },
    { icon: PenTool, label: 'Writing', skills: ['Copywriting', 'Technical Writing', 'Content Strategy', 'SEO', 'Editing'] },
    { icon: Megaphone, label: 'Marketing', skills: ['Growth', 'Paid Media', 'SEO', 'Email', 'Social Media', 'Brand Strategy'] },
    { icon: Database, label: 'Product', skills: ['Product Strategy', 'Roadmapping', 'User Research', 'A/B Testing', 'Scrum'] },
];

const roleTypes = ['Full-Time', 'Part-Time', 'Contract', 'Freelance', 'Internship'];
const availabilityOptions = ['Actively Looking', 'Open to Offers', 'Not Available'];
const experienceLevels = ['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'];

export function CandidateOnboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const totalSteps = 4;

    // Step 1 — Profile basics
    const [headline, setHeadline] = useState('');
    const [location, setLocation] = useState('');
    const [experience, setExperience] = useState('');

    // Step 2 — Skills
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    // Step 3 — Preferences
    const [preferredRoles, setPreferredRoles] = useState<string[]>([]);
    const [availability, setAvailability] = useState('');
    const [salaryMin, setSalaryMin] = useState('');
    const [remote, setRemote] = useState(true);

    // Step 4 — Connect accounts
    const [githubConnected, setGithubConnected] = useState(false);
    const [linkedinConnected, setLinkedinConnected] = useState(false);

    // Auth
    const { user, signInWithLinkedIn, linkedProviders } = useAuth();

    // Sync LinkedIn connected state from auth
    useEffect(() => {
        if (linkedProviders.includes('linkedin_oidc')) {
            setLinkedinConnected(true);
            // Auto-fill from LinkedIn profile data if we just connected
            if (user?.user_metadata?.full_name && !autoFilled) {
                setHeadline(user.user_metadata.full_name || '');
                setAutoFilled(true);
                setAutoFillSource('linkedin');
            }
        }
    }, [linkedProviders, user]);

    // Auto-fill state
    const [isParsing, setIsParsing] = useState(false);
    const [autoFilled, setAutoFilled] = useState(false);
    const [autoFillSource, setAutoFillSource] = useState<'resume' | 'linkedin' | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const toggleSkill = (skill: string) => {
        setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
    };
    const toggleRole = (role: string) => {
        setPreferredRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
    };

    const simulateAutoFill = (source: 'resume' | 'linkedin') => {
        setIsParsing(true);
        setAutoFillSource(source);

        // Simulate AI parsing delay
        setTimeout(() => {
            setHeadline('Senior Frontend Engineer');
            setLocation('San Francisco, CA');
            setExperience('5-10 years');
            setSelectedSkills(['React', 'TypeScript', 'Node.js', 'Docker', 'UI/UX', 'Figma']);
            setPreferredRoles(['Full-Time', 'Contract']);
            setAvailability('Actively Looking');
            setSalaryMin('120,000');
            setRemote(true);
            if (source === 'linkedin') setLinkedinConnected(true);
            setIsParsing(false);
            setAutoFilled(true);
        }, 2200);
    };

    const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            simulateAutoFill('resume');
        }
    };

    const canProceed = () => {
        if (step === 1) return headline.trim() !== '';
        if (step === 2) return selectedSkills.length >= 2;
        if (step === 3) return availability !== '';
        return true;
    };

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    const handleFinish = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setSaving(true);
        setSaveError('');

        try {
            // 1. Upsert the User row (links Supabase Auth user to our User table)
            const { error: userError } = await supabase
                .from('User')
                .upsert({
                    id: user.id,
                    email: user.email || '',
                    role: 'CANDIDATE',
                    updatedAt: new Date().toISOString(),
                }, { onConflict: 'id' });

            if (userError) throw userError;

            // 2. Upsert the CandidateProfile
            const profileId = crypto.randomUUID();

            // Check if profile already exists for this user
            const { data: existing } = await supabase
                .from('CandidateProfile')
                .select('id')
                .eq('userId', user.id)
                .single();

            const profileData = {
                userId: user.id,
                headline: headline || null,
                location: location || null,
                experience: experience || null,
                skills: selectedSkills,
                preferredRoles: preferredRoles,
                availability: availability || null,
                preferredSalary: salaryMin ? parseInt(salaryMin.replace(/,/g, '')) : null,
                remote,
                githubUrl: githubConnected ? 'connected' : null,
                linkedinUrl: linkedinConnected ? 'connected' : null,
                onboardingCompleted: true,
                updatedAt: new Date().toISOString(),
            };

            if (existing?.id) {
                // Update existing
                const { error: profileError } = await supabase
                    .from('CandidateProfile')
                    .update(profileData)
                    .eq('id', existing.id);
                if (profileError) throw profileError;
            } else {
                // Insert new
                const { error: profileError } = await supabase
                    .from('CandidateProfile')
                    .insert({
                        id: profileId,
                        ...profileData,
                        createdAt: new Date().toISOString(),
                    });
                if (profileError) throw profileError;
            }

            navigate('/dashboard');
        } catch (err: any) {
            console.error('Save error:', err);
            setSaveError(err.message || 'Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] text-[#1C1C1E] flex flex-col">
            {/* Header */}
            <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold">proof<span className="text-proof-accent">.</span></Link>
                <button onClick={handleFinish} className="text-sm text-[#1C1C1E]/40 font-medium hover:text-[#1C1C1E] transition-colors">
                    Skip for now →
                </button>
            </div>

            {/* Progress bar */}
            <div className="px-8 mb-8">
                <div className="flex items-center gap-2 max-w-2xl mx-auto">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < step ? 'bg-[#1C1C1E]' : 'bg-black/5'}`} />
                    ))}
                </div>
                <p className="text-center text-xs text-[#1C1C1E]/30 font-bold mt-3 tracking-widest uppercase">Step {step} of {totalSteps}</p>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-start justify-center px-8 pb-12">
                <div className="w-full max-w-2xl">
                    <AnimatePresence mode="wait">
                        {/* STEP 1: Profile Basics */}
                        {step === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                                <div className="text-center mb-10">
                                    <div className="w-16 h-16 rounded-2xl bg-[#1C1C1E] flex items-center justify-center mx-auto mb-5">
                                        <User className="w-8 h-8 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight mb-2">Let's set up your profile</h1>
                                    <p className="text-[#1C1C1E]/50 font-medium">This helps employers understand who you are at a glance.</p>
                                </div>

                                {/* AUTO-FILL BANNER */}
                                {!autoFilled ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gradient-to-r from-[#1C1C1E] to-[#2C2C2E] rounded-2xl p-5 mb-6 text-white"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <Sparkles className="w-5 h-5 text-proof-accent" />
                                            <p className="font-bold text-sm">Skip the typing — auto-fill your profile</p>
                                        </div>
                                        <p className="text-white/50 text-xs mb-4">Upload your resume or connect LinkedIn and we'll extract everything for you.</p>

                                        {isParsing ? (
                                            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                                                <Loader2 className="w-5 h-5 text-proof-accent animate-spin" />
                                                <div>
                                                    <p className="text-sm font-semibold">Analyzing your {autoFillSource === 'resume' ? 'resume' : 'LinkedIn profile'}...</p>
                                                    <p className="text-xs text-white/40">Extracting skills, experience, and preferences</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-3">
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleResumeUpload}
                                                    className="hidden"
                                                />
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-white text-[#1C1C1E] py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
                                                >
                                                    <FileUp className="w-4 h-4" /> Upload Resume
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        signInWithLinkedIn(window.location.origin + '/onboarding/candidate');
                                                    }}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-[#0077B5] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#006097] transition-colors"
                                                >
                                                    <Linkedin className="w-4 h-4" /> Import LinkedIn
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4 mb-6"
                                    >
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-green-800">Profile auto-filled from {autoFillSource === 'resume' ? 'your resume' : 'LinkedIn'}</p>
                                            <p className="text-xs text-green-600">Review and adjust the details below, then continue.</p>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-8 shadow-glass space-y-5">
                                    <div>
                                        <label className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 block mb-2">Professional Headline</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Senior Frontend Engineer"
                                            value={headline}
                                            onChange={e => setHeadline(e.target.value)}
                                            className="w-full bg-[#F8F9FB] border border-black/5 rounded-xl py-4 px-5 text-[#1C1C1E] placeholder-[#1C1C1E]/25 focus:outline-none focus:border-[#1C1C1E]/15 transition-colors text-base"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 block mb-2">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1C1C1E]/25" />
                                            <input
                                                type="text"
                                                placeholder="e.g. San Francisco, CA"
                                                value={location}
                                                onChange={e => setLocation(e.target.value)}
                                                className="w-full bg-[#F8F9FB] border border-black/5 rounded-xl py-4 pl-12 pr-5 text-[#1C1C1E] placeholder-[#1C1C1E]/25 focus:outline-none focus:border-[#1C1C1E]/15 transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 block mb-2">Experience Level</label>
                                        <div className="flex flex-wrap gap-2">
                                            {experienceLevels.map(lvl => (
                                                <button
                                                    key={lvl}
                                                    onClick={() => setExperience(lvl)}
                                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${experience === lvl ? 'bg-[#1C1C1E] text-white' : 'bg-[#F8F9FB] border border-black/5 text-[#1C1C1E]/60 hover:border-black/10'}`}
                                                >
                                                    {lvl}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: Skills */}
                        {step === 2 && (
                            <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                                <div className="text-center mb-10">
                                    <div className="w-16 h-16 rounded-2xl bg-[#1C1C1E] flex items-center justify-center mx-auto mb-5">
                                        <Zap className="w-8 h-8 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight mb-2">What are your skills?</h1>
                                    <p className="text-[#1C1C1E]/50 font-medium">Select at least 2 skills. We'll use these to match you with challenges.</p>
                                </div>

                                <div className="space-y-6">
                                    {skillCategories.map(cat => (
                                        <div key={cat.label} className="bg-white/60 backdrop-blur-2xl border border-white rounded-2xl p-6 shadow-glass">
                                            <div className="flex items-center gap-2 mb-4">
                                                <cat.icon className="w-4 h-4 text-[#1C1C1E]/40" />
                                                <p className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30">{cat.label}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {cat.skills.map(skill => (
                                                    <button
                                                        key={skill}
                                                        onClick={() => toggleSkill(skill)}
                                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedSkills.includes(skill) ? 'bg-[#1C1C1E] text-white' : 'bg-[#F8F9FB] border border-black/5 text-[#1C1C1E]/60 hover:border-black/10'}`}
                                                    >
                                                        {selectedSkills.includes(skill) && <CheckCircle className="w-3.5 h-3.5 inline mr-1.5" />}
                                                        {skill}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-center mt-4 text-sm text-[#1C1C1E]/40 font-medium">{selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected</p>
                            </motion.div>
                        )}

                        {/* STEP 3: Preferences */}
                        {step === 3 && (
                            <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                                <div className="text-center mb-10">
                                    <div className="w-16 h-16 rounded-2xl bg-[#1C1C1E] flex items-center justify-center mx-auto mb-5">
                                        <Briefcase className="w-8 h-8 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight mb-2">Your preferences</h1>
                                    <p className="text-[#1C1C1E]/50 font-medium">Tell us what you're looking for so we can curate your feed.</p>
                                </div>

                                <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-8 shadow-glass space-y-6">
                                    <div>
                                        <label className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 block mb-3">Role Type</label>
                                        <div className="flex flex-wrap gap-2">
                                            {roleTypes.map(r => (
                                                <button
                                                    key={r}
                                                    onClick={() => toggleRole(r)}
                                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${preferredRoles.includes(r) ? 'bg-[#1C1C1E] text-white' : 'bg-[#F8F9FB] border border-black/5 text-[#1C1C1E]/60 hover:border-black/10'}`}
                                                >
                                                    {preferredRoles.includes(r) && <CheckCircle className="w-3.5 h-3.5 inline mr-1.5" />}
                                                    {r}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 block mb-3">Availability</label>
                                        <div className="flex flex-wrap gap-2">
                                            {availabilityOptions.map(a => (
                                                <button
                                                    key={a}
                                                    onClick={() => setAvailability(a)}
                                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${availability === a ? 'bg-[#1C1C1E] text-white' : 'bg-[#F8F9FB] border border-black/5 text-[#1C1C1E]/60 hover:border-black/10'}`}
                                                >
                                                    <Clock className="w-4 h-4" />{a}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 block mb-2">Min Salary (USD)</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1C1C1E]/25" />
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 80,000"
                                                    value={salaryMin}
                                                    onChange={e => setSalaryMin(e.target.value)}
                                                    className="w-full bg-[#F8F9FB] border border-black/5 rounded-xl py-4 pl-12 pr-5 text-[#1C1C1E] placeholder-[#1C1C1E]/25 focus:outline-none focus:border-[#1C1C1E]/15 transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 block mb-2">Work Mode</label>
                                            <div className="flex gap-2 mt-1">
                                                <button
                                                    onClick={() => setRemote(true)}
                                                    className={`flex-1 py-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${remote ? 'bg-[#1C1C1E] text-white' : 'bg-[#F8F9FB] border border-black/5 text-[#1C1C1E]/60'}`}
                                                >
                                                    <Globe className="w-4 h-4" /> Remote
                                                </button>
                                                <button
                                                    onClick={() => setRemote(false)}
                                                    className={`flex-1 py-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${!remote ? 'bg-[#1C1C1E] text-white' : 'bg-[#F8F9FB] border border-black/5 text-[#1C1C1E]/60'}`}
                                                >
                                                    <MapPin className="w-4 h-4" /> On-site
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: Connect Accounts */}
                        {step === 4 && (
                            <motion.div key="s4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                                <div className="text-center mb-10">
                                    <div className="w-16 h-16 rounded-2xl bg-[#1C1C1E] flex items-center justify-center mx-auto mb-5">
                                        <Globe className="w-8 h-8 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight mb-2">Connect your accounts</h1>
                                    <p className="text-[#1C1C1E]/50 font-medium">Auto-import your skills and verify your identity for higher trust scores.</p>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => setGithubConnected(!githubConnected)}
                                        className={`w-full bg-white/60 backdrop-blur-2xl border rounded-2xl p-6 shadow-glass flex items-center gap-5 transition-all ${githubConnected ? 'border-green-200 bg-green-50/30' : 'border-white hover:border-black/10'}`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${githubConnected ? 'bg-green-100' : 'bg-[#F8F9FB]'}`}>
                                            <Github className={`w-7 h-7 ${githubConnected ? 'text-green-600' : 'text-[#1C1C1E]'}`} />
                                        </div>
                                        <div className="text-left flex-1">
                                            <p className="font-bold text-base">GitHub</p>
                                            <p className="text-sm text-[#1C1C1E]/40 font-medium">Import repos, contributions, and tech stack</p>
                                        </div>
                                        {githubConnected ? (
                                            <span className="text-sm font-bold text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Connected</span>
                                        ) : (
                                            <span className="text-sm font-bold text-[#1C1C1E]/30">Connect →</span>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (!linkedinConnected) {
                                                signInWithLinkedIn(window.location.origin + '/onboarding/candidate');
                                            }
                                        }}
                                        className={`w-full bg-white/60 backdrop-blur-2xl border rounded-2xl p-6 shadow-glass flex items-center gap-5 transition-all ${linkedinConnected ? 'border-green-200 bg-green-50/30' : 'border-white hover:border-black/10 cursor-pointer'}`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${linkedinConnected ? 'bg-green-100' : 'bg-[#F8F9FB]'}`}>
                                            <Linkedin className={`w-7 h-7 ${linkedinConnected ? 'text-green-600' : 'text-[#0077B5]'}`} />
                                        </div>
                                        <div className="text-left flex-1">
                                            <p className="font-bold text-base">LinkedIn</p>
                                            <p className="text-sm text-[#1C1C1E]/40 font-medium">Verify identity and import work history</p>
                                        </div>
                                        {linkedinConnected ? (
                                            <span className="text-sm font-bold text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Connected</span>
                                        ) : (
                                            <span className="text-sm font-bold text-[#0077B5]">Connect →</span>
                                        )}
                                    </button>

                                    {/* Upload first proof CTA */}
                                    <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-2xl p-6 shadow-glass flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-proof-accent/10 flex items-center justify-center">
                                            <Camera className="w-7 h-7 text-proof-accent" />
                                        </div>
                                        <div className="text-left flex-1">
                                            <p className="font-bold text-base">Upload your first proof</p>
                                            <p className="text-sm text-[#1C1C1E]/40 font-medium">Record a 90-second video showcasing your best work</p>
                                        </div>
                                        <span className="text-sm font-bold text-[#1C1C1E]/30">After setup →</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-10 max-w-2xl mx-auto">
                        {step > 1 ? (
                            <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-sm text-[#1C1C1E]/40 hover:text-[#1C1C1E] transition-colors font-medium">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                        ) : <div />}

                        {step < totalSteps ? (
                            <button
                                onClick={() => canProceed() && setStep(step + 1)}
                                disabled={!canProceed()}
                                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all ${canProceed() ? 'bg-[#1C1C1E] text-white hover:bg-[#1C1C1E]/80' : 'bg-black/5 text-[#1C1C1E]/20 cursor-not-allowed'}`}
                            >
                                Continue <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleFinish}
                                disabled={saving}
                                className="flex items-center gap-2 bg-[#1C1C1E] text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-[#1C1C1E]/80 transition-all disabled:opacity-50"
                            >
                                {saving ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Saving Profile...</>
                                ) : (
                                    <>Go to Dashboard <ArrowRight className="w-5 h-5" /></>
                                )}
                            </button>
                        )}
                    </div>
                    {saveError && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 font-medium">
                            {saveError}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
