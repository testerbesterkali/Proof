import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Globe, Users, ArrowRight, ArrowLeft, ShieldCheck, Mail, Zap, Loader2, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { SuggestionInput } from '../components/SuggestionInput';

const industrySuggestions = [
    'Artificial Intelligence', 'Machine Learning', 'AI/ML', 'Deep Learning',
    'Fintech', 'Banking', 'InsurTech', 'Payments', 'Blockchain',
    'SaaS', 'Enterprise Software', 'Developer Tools', 'DevOps', 'Cloud Computing',
    'Cybersecurity', 'InfoSec', 'Data Privacy',
    'HealthTech', 'MedTech', 'Biotech', 'Pharma', 'Telemedicine',
    'EdTech', 'E-Learning', 'Online Education',
    'E-Commerce', 'Retail', 'DTC', 'Marketplace',
    'Real Estate', 'PropTech', 'Construction Tech',
    'CleanTech', 'Energy', 'Sustainability', 'Climate Tech',
    'Media', 'Entertainment', 'Gaming', 'Streaming',
    'Social Media', 'Community', 'Creator Economy',
    'Logistics', 'Supply Chain', 'Shipping', 'FoodTech',
    'Automotive', 'Electric Vehicles', 'Autonomous Driving',
    'Aerospace', 'Defense', 'SpaceTech',
    'LegalTech', 'RegTech', 'GovTech',
    'HR Tech', 'Recruiting', 'Staffing', 'Workforce Management',
    'Marketing Tech', 'AdTech', 'Analytics',
    'IoT', 'Hardware', 'Robotics', 'Manufacturing',
    'Travel', 'Hospitality', 'Tourism',
    'Telecommunications', 'Networking', '5G',
    'Web3', 'Crypto', 'DeFi', 'NFTs',
    'Agriculture', 'AgriTech',
    'Consulting', 'Professional Services', 'Agency',
    'Non-Profit', 'NGO', 'Social Impact',
];

const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'];

const totalSteps = 3;

export function EmployerOnboarding() {
    const navigate = useNavigate();
    const [step, setStep] = React.useState(1);

    // Step 1 — Company Basics
    const [companyName, setCompanyName] = React.useState('');
    const [industry, setIndustry] = React.useState('');
    const [companySize, setCompanySize] = React.useState('');
    const [aboutCompany, setAboutCompany] = React.useState('');

    // Step 2 — Domain Verification
    const [website, setWebsite] = React.useState('');
    const [workEmail, setWorkEmail] = React.useState('');

    // Saving
    const [saving, setSaving] = React.useState(false);
    const [saveError, setSaveError] = React.useState('');

    const { user } = useAuth();

    const canProceed = () => {
        if (step === 1) return companyName.trim() !== '';
        if (step === 2) return website.trim() !== '';
        return true;
    };

    const handleFinish = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setSaving(true);
        setSaveError('');

        try {
            const { error: userError } = await supabase
                .from('User')
                .upsert({
                    id: user.id,
                    email: user.email || '',
                    role: 'EMPLOYER',
                    updatedAt: new Date().toISOString(),
                }, { onConflict: 'id' });

            if (userError) throw userError;

            const profileId = crypto.randomUUID();
            const { data: existing } = await supabase
                .from('EmployerProfile')
                .select('id')
                .eq('userId', user.id)
                .single();

            const profileData = {
                userId: user.id,
                companyName: companyName || null,
                industry: industry || null,
                companySize: companySize || null,
                about: aboutCompany || null,
                verifiedUrl: website || null,
                workEmail: workEmail || null,
                onboardingCompleted: true,
                updatedAt: new Date().toISOString(),
            };

            if (existing?.id) {
                const { error: profileError } = await supabase
                    .from('EmployerProfile')
                    .update(profileData)
                    .eq('id', existing.id);
                if (profileError) throw profileError;
            } else {
                const { error: profileError } = await supabase
                    .from('EmployerProfile')
                    .insert({
                        id: profileId,
                        ...profileData,
                        createdAt: new Date().toISOString(),
                    });
                if (profileError) throw profileError;
            }

            navigate('/employer/dashboard');
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
                        {/* STEP 1: Company Basics */}
                        {step === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                                <div className="text-center mb-10">
                                    <div className="w-16 h-16 rounded-2xl bg-[#1C1C1E] flex items-center justify-center mx-auto mb-5">
                                        <Building2 className="w-8 h-8 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight mb-2">Tell us about your company</h1>
                                    <p className="text-[#1C1C1E]/50 font-medium">Let's set up your employer profile for Proof.</p>
                                </div>

                                <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-8 shadow-glass space-y-5">
                                    <div>
                                        <label className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 block mb-2">Company Name</label>
                                        <SuggestionInput
                                            value={companyName}
                                            onChange={setCompanyName}
                                            suggestions={[]}
                                            placeholder="Your company name"
                                            icon={<Building2 className="w-5 h-5" />}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 block mb-2">Industry</label>
                                        <SuggestionInput
                                            value={industry}
                                            onChange={setIndustry}
                                            suggestions={industrySuggestions}
                                            placeholder="e.g. Fintech, AI, SaaS"
                                            icon={<Zap className="w-5 h-5" />}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 block mb-3">Company Size</label>
                                        <div className="flex flex-wrap gap-2">
                                            {companySizes.map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => setCompanySize(size)}
                                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${companySize === size ? 'bg-[#1C1C1E] text-white' : 'bg-[#F8F9FB] border border-black/5 text-[#1C1C1E]/60 hover:border-black/10'}`}
                                                >
                                                    {companySize === size && <CheckCircle className="w-3.5 h-3.5 inline mr-1.5" />}
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 block mb-2">About Your Company</label>
                                        <textarea
                                            placeholder="Tell candidates what makes your company special — your mission, culture, and what you're building..."
                                            className="w-full bg-[#F8F9FB] border border-black/5 rounded-xl p-4 min-h-[120px] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1C1C1E]/10 transition-all resize-none"
                                            value={aboutCompany}
                                            onChange={(e) => setAboutCompany(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: Domain Verification */}
                        {step === 2 && (
                            <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                                <div className="text-center mb-10">
                                    <div className="w-16 h-16 rounded-2xl bg-[#1C1C1E] flex items-center justify-center mx-auto mb-5">
                                        <Globe className="w-8 h-8 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight mb-2">Verify your domain</h1>
                                    <p className="text-[#1C1C1E]/50 font-medium">We only allow verified company representatives.</p>
                                </div>

                                <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-8 shadow-glass space-y-5">
                                    <div>
                                        <label className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 block mb-2">Company Website</label>
                                        <SuggestionInput
                                            value={website}
                                            onChange={setWebsite}
                                            suggestions={[]}
                                            placeholder="https://yourcompany.com"
                                            icon={<Globe className="w-5 h-5" />}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 block mb-2">Work Email</label>
                                        <SuggestionInput
                                            value={workEmail}
                                            onChange={setWorkEmail}
                                            suggestions={[]}
                                            placeholder="you@yourcompany.com"
                                            icon={<Mail className="w-5 h-5" />}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: Confirmation */}
                        {step === 3 && (
                            <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                                <div className="text-center mb-10">
                                    <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-5">
                                        <ShieldCheck className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight mb-2">You're all set!</h1>
                                    <p className="text-[#1C1C1E]/50 font-medium">Your company profile is active. Start posting challenges and reviewing proofs.</p>
                                </div>

                                <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-8 shadow-glass space-y-4">
                                    {companyName && (
                                        <div className="flex items-center gap-4 p-3 bg-[#F8F9FB] rounded-xl border border-black/5">
                                            <Building2 className="w-5 h-5 text-[#1C1C1E]/30" />
                                            <div>
                                                <p className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30">Company</p>
                                                <p className="font-semibold text-sm">{companyName}</p>
                                            </div>
                                        </div>
                                    )}
                                    {industry && (
                                        <div className="flex items-center gap-4 p-3 bg-[#F8F9FB] rounded-xl border border-black/5">
                                            <Zap className="w-5 h-5 text-[#1C1C1E]/30" />
                                            <div>
                                                <p className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30">Industry</p>
                                                <p className="font-semibold text-sm">{industry}</p>
                                            </div>
                                        </div>
                                    )}
                                    {companySize && (
                                        <div className="flex items-center gap-4 p-3 bg-[#F8F9FB] rounded-xl border border-black/5">
                                            <Users className="w-5 h-5 text-[#1C1C1E]/30" />
                                            <div>
                                                <p className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30">Size</p>
                                                <p className="font-semibold text-sm">{companySize} employees</p>
                                            </div>
                                        </div>
                                    )}
                                    {website && (
                                        <div className="flex items-center gap-4 p-3 bg-[#F8F9FB] rounded-xl border border-black/5">
                                            <Globe className="w-5 h-5 text-[#1C1C1E]/30" />
                                            <div>
                                                <p className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30">Website</p>
                                                <p className="font-semibold text-sm">{website}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation — same as candidate onboarding */}
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
                                    <>Enter Dashboard <ArrowRight className="w-5 h-5" /></>
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
