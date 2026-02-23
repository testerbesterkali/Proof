import * as React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Layout } from '../components/Layout';
import { MapPin, Briefcase, Clock, DollarSign, Github, Linkedin, CheckCircle2, Loader2, Edit3, User, FileText, ExternalLink } from 'lucide-react';

interface CandidateProfileData {
    id: string;
    headline: string;
    location: string;
    experience: string;
    skills: string[];
    preferredRoles: string[];
    availability: string;
    preferredSalary: number | null;
    remote: boolean;
    githubUrl: string | null;
    linkedinUrl: string | null;
    resumeUrl: string | null;
}

export function CandidateProfile() {
    const { user } = useAuth();
    const [loading, setLoading] = React.useState(true);
    const [profile, setProfile] = React.useState<CandidateProfileData | null>(null);

    React.useEffect(() => {
        if (user) loadProfile();
    }, [user]);

    const loadProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('CandidateProfile')
                .select('*')
                .eq('userId', user?.id)
                .single();

            if (error) throw error;
            setProfile(data);
        } catch (err) {
            console.error('Error loading profile:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-proof-accent" />
                </div>
            </Layout>
        );
    }

    if (!profile) {
        return (
            <Layout>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <User className="w-16 h-16 text-[#1C1C1E]/20 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Profile Not Found</h2>
                        <p className="text-[#1C1C1E]/50">Please complete onboarding to set up your profile.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Your Profile</h1>
                        <p className="text-[#1C1C1E]/50 font-medium">This is how employers see you on Proof.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Header Card */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-black/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-proof-accent/10 blur-[50px] rounded-full translate-x-1/3 -translate-y-1/3" />

                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-[#1C1C1E] text-white rounded-2xl flex items-center justify-center text-3xl font-black mb-6 shadow-lg">
                                    {user?.email?.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-2xl font-black tracking-tight mb-2">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</h2>
                                <h3 className="text-lg font-bold text-proof-accent mb-6">{profile.headline}</h3>

                                <div className="flex flex-wrap gap-4 text-sm font-medium text-[#1C1C1E]/60">
                                    {profile.location && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" /> {profile.location}
                                        </div>
                                    )}
                                    {profile.experience && (
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-4 h-4" /> {profile.experience}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* About/Preferences */}
                        {(profile.availability || profile.preferredSalary || profile.preferredRoles?.length > 0 || profile.remote) && (
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-black/5">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#1C1C1E]/40 mb-6">Preferences</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {profile.availability && (
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1C1C1E]/30 mb-2">Availability</p>
                                            <div className="flex items-center gap-2 text-sm font-bold">
                                                <Clock className="w-4 h-4 text-proof-accent" /> {profile.availability}
                                            </div>
                                        </div>
                                    )}
                                    {profile.preferredSalary && (
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1C1C1E]/30 mb-2">Expected Salary</p>
                                            <div className="flex items-center gap-2 text-sm font-bold">
                                                <DollarSign className="w-4 h-4 text-green-500" /> ${profile.preferredSalary.toLocaleString()}/yr
                                            </div>
                                        </div>
                                    )}
                                    {(profile.preferredRoles?.length > 0 || profile.remote) && (
                                        <div className="sm:col-span-2">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1C1C1E]/30 mb-2">Preferred Roles</p>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.preferredRoles?.map(role => (
                                                    <span key={role} className="bg-[#F8F9FB] px-3 py-1.5 rounded-lg text-xs font-bold border border-black/5">
                                                        {role}
                                                    </span>
                                                ))}
                                                {profile.remote && (
                                                    <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-green-100 flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" /> Remote OK
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        {/* Resume */}
                        {profile.resumeUrl && (
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-black/5">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#1C1C1E]/40 mb-6">Resume</h3>
                                <a
                                    href={profile.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 rounded-xl border border-black/5 bg-[#F8F9FB] hover:border-black/10 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-proof-accent/10 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-proof-accent" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-[#1C1C1E] group-hover:text-proof-accent transition-colors">View Resume</p>
                                            <p className="text-xs font-medium text-[#1C1C1E]/40">PDF Document</p>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-[#1C1C1E]/30 group-hover:text-proof-accent transition-colors" />
                                </a>
                            </div>
                        )}

                        {/* Skills */}
                        {profile.skills && profile.skills.length > 0 && (
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-black/5">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#1C1C1E]/40 mb-6">Top Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map(skill => (
                                        <span key={skill} className="bg-[#1C1C1E] text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Social Links */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-black/5">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#1C1C1E]/40 mb-6">Connected Accounts</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl border border-black/5 bg-[#F8F9FB]">
                                    <div className="flex items-center gap-3">
                                        <Github className="w-5 h-5 text-[#333]" />
                                        <span className="text-sm font-bold">GitHub</span>
                                    </div>
                                    {profile.githubUrl ? (
                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md">Connected</span>
                                    ) : (
                                        <span className="text-xs font-bold text-[#1C1C1E]/30">Not connected</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl border border-black/5 bg-[#F8F9FB]">
                                    <div className="flex items-center gap-3">
                                        <Linkedin className="w-5 h-5 text-[#0077b5]" />
                                        <span className="text-sm font-bold">LinkedIn</span>
                                    </div>
                                    {profile.linkedinUrl ? (
                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md">Connected</span>
                                    ) : (
                                        <span className="text-xs font-bold text-[#1C1C1E]/30">Not connected</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
