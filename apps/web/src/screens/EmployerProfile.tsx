import * as React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { EmployerLayout } from '../components/EmployerLayout';
import { Building2, Globe, Mail, Users, Loader2, Edit3, Briefcase } from 'lucide-react';

interface EmployerProfileData {
    id: string;
    companyName: string;
    industry: string;
    companySize: string;
    about: string;
    verifiedUrl: string;
    workEmail: string;
}

export function EmployerProfile() {
    const { user } = useAuth();
    const [loading, setLoading] = React.useState(true);
    const [profile, setProfile] = React.useState<EmployerProfileData | null>(null);

    React.useEffect(() => {
        if (user) loadProfile();
    }, [user]);

    const loadProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('EmployerProfile')
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
            <EmployerLayout>
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-proof-accent" />
                </div>
            </EmployerLayout>
        );
    }

    if (!profile) {
        return (
            <EmployerLayout>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Building2 className="w-16 h-16 text-[#1C1C1E]/20 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Profile Not Found</h2>
                        <p className="text-[#1C1C1E]/50">Please complete onboarding to set up your company profile.</p>
                    </div>
                </div>
            </EmployerLayout>
        );
    }

    return (
        <EmployerLayout>
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Company Profile</h1>
                        <p className="text-[#1C1C1E]/50 font-medium">This is how candidates see your company on Proof.</p>
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
                                    {profile.companyName.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-3xl font-black tracking-tight mb-4">{profile.companyName}</h2>

                                <div className="flex flex-wrap gap-4 text-sm font-medium text-[#1C1C1E]/60 mb-8">
                                    {profile.industry && (
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-4 h-4" /> {profile.industry}
                                        </div>
                                    )}
                                    {profile.companySize && (
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" /> {profile.companySize}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* About Company */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-black/5">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#1C1C1E]/40 mb-6">About Company</h3>
                            <p className="text-[#1C1C1E]/70 leading-relaxed font-medium whitespace-pre-line">
                                {profile.about}
                            </p>
                        </div>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        {/* Contact & Links */}
                        {(profile.verifiedUrl || profile.workEmail) && (
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-black/5">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#1C1C1E]/40 mb-6">Details</h3>
                                <div className="space-y-4">
                                    {profile.verifiedUrl && (
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-black/5 bg-[#F8F9FB]">
                                            <div className="flex items-center gap-3">
                                                <Globe className="w-5 h-5 text-[#1C1C1E]/40" />
                                                <span className="text-sm font-bold truncate max-w-[150px]">{profile.verifiedUrl.replace(/^https?:\/\//, '')}</span>
                                            </div>
                                        </div>
                                    )}
                                    {profile.workEmail && (
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-black/5 bg-[#F8F9FB]">
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-5 h-5 text-[#1C1C1E]/40" />
                                                <span className="text-sm font-bold truncate max-w-[150px]">{profile.workEmail}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </EmployerLayout>
    );
}
