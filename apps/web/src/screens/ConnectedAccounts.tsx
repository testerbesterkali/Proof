import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import {
    Github, Linkedin, Chrome, Globe, Shield, CheckCircle,
    ExternalLink, RefreshCw, Trash2, Plus, Mail, Figma, LogOut, Loader2
} from 'lucide-react';

interface AccountConfig {
    id: string;
    provider: 'github' | 'google' | 'linkedin_oidc' | null;
    name: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    description: string;
}

const accountConfigs: AccountConfig[] = [
    {
        id: 'github',
        provider: 'github',
        name: 'GitHub',
        icon: Github,
        color: 'text-[#1C1C1E]',
        bgColor: 'bg-[#1C1C1E]',
        description: 'Import repos, contributions, and tech stack',
    },
    {
        id: 'linkedin_oidc',
        provider: 'linkedin_oidc',
        name: 'LinkedIn',
        icon: Linkedin,
        color: 'text-[#0077B5]',
        bgColor: 'bg-[#0077B5]',
        description: 'Verify identity and import work history',
    },
    {
        id: 'google',
        provider: 'google',
        name: 'Google',
        icon: Chrome,
        color: 'text-[#4285F4]',
        bgColor: 'bg-[#4285F4]',
        description: 'Sign in with Google and sync calendar for interviews',
    },
    {
        id: 'figma',
        provider: null,
        name: 'Figma',
        icon: Figma,
        color: 'text-[#F24E1E]',
        bgColor: 'bg-[#F24E1E]',
        description: 'Link design files as proof of work (coming soon)',
    },
    {
        id: 'portfolio',
        provider: null,
        name: 'Personal Website',
        icon: Globe,
        color: 'text-purple-600',
        bgColor: 'bg-purple-600',
        description: 'Showcase your portfolio and personal brand (coming soon)',
    },
];

export function ConnectedAccounts() {
    const { user, signInWithGoogle, signInWithGitHub, signInWithLinkedIn, signOut, linkedProviders, loading } = useAuth();
    const [syncing, setSyncing] = useState<string | null>(null);
    const [connecting, setConnecting] = useState<string | null>(null);

    const isProviderLinked = (provider: string | null) => {
        if (!provider || !user) return false;
        return linkedProviders.includes(provider);
    };

    const getIdentityForProvider = (provider: string | null) => {
        if (!provider || !user?.identities) return null;
        return user.identities.find(i => i.provider === provider);
    };

    const handleConnect = async (account: AccountConfig) => {
        if (!account.provider) return;
        setConnecting(account.id);
        try {
            switch (account.provider) {
                case 'google':
                    await signInWithGoogle();
                    break;
                case 'github':
                    await signInWithGitHub();
                    break;
                case 'linkedin_oidc':
                    await signInWithLinkedIn();
                    break;
            }
        } catch (err) {
            console.error('OAuth error:', err);
        }
        setConnecting(null);
    };

    const syncAccount = (id: string) => {
        setSyncing(id);
        setTimeout(() => setSyncing(null), 2000);
    };

    const connectedCount = accountConfigs.filter(a => isProviderLinked(a.provider)).length;

    return (
        <Layout>
            <div className="flex-1 flex flex-col pb-20">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Connected Accounts</h1>
                    <p className="text-[#1C1C1E]/50 font-medium">
                        Manage linked services to auto-import skills, verify identity, and strengthen your profile.
                    </p>
                </div>

                {/* User info banner if logged in */}
                {user && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/60 backdrop-blur-2xl border border-white rounded-2xl p-5 shadow-glass mb-6 flex items-center gap-4"
                    >
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                            <img
                                src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=1C1C1E&color=fff`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm">{user.user_metadata?.full_name || user.user_metadata?.name || user.email}</p>
                            <p className="text-xs text-[#1C1C1E]/40 font-medium">{user.email}</p>
                        </div>
                        <button
                            onClick={signOut}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-100 text-red-500 text-xs font-bold hover:bg-red-100 transition-colors"
                        >
                            <LogOut size={14} /> Sign Out
                        </button>
                    </motion.div>
                )}

                {/* Trust Score Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-[#1C1C1E] to-[#2C2C2E] rounded-2xl p-6 mb-8 text-white flex items-center gap-5"
                >
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                        <Shield className="w-7 h-7 text-proof-accent" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-base">Trust Score</p>
                        <p className="text-white/50 text-sm">Each connected account increases your credibility with employers.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-proof-accent">{connectedCount}/{accountConfigs.length}</p>
                        <p className="text-xs text-white/40 font-medium">accounts linked</p>
                    </div>
                </motion.div>

                {/* Accounts List */}
                <div className="space-y-4">
                    {accountConfigs.map((account, i) => {
                        const linked = isProviderLinked(account.provider);
                        const identity = getIdentityForProvider(account.provider);
                        const displayName = identity?.identity_data?.full_name
                            || identity?.identity_data?.name
                            || identity?.identity_data?.preferred_username
                            || identity?.identity_data?.user_name
                            || identity?.identity_data?.email
                            || null;
                        const connectedDate = identity?.created_at
                            ? new Date(identity.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : null;

                        return (
                            <motion.div
                                key={account.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className={`bg-white/60 backdrop-blur-2xl border rounded-2xl p-6 shadow-glass transition-all ${linked ? 'border-green-100' : 'border-white hover:border-black/10'}`}
                            >
                                <div className="flex items-start gap-5">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${linked ? 'bg-green-50' : 'bg-[#F8F9FB]'}`}>
                                        <account.icon className={`w-6 h-6 ${linked ? 'text-green-600' : account.color}`} />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-bold text-base">{account.name}</p>
                                            {linked && (
                                                <span className="text-[10px] font-bold tracking-widest uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <CheckCircle size={10} /> Connected
                                                </span>
                                            )}
                                            {!account.provider && (
                                                <span className="text-[10px] font-bold tracking-widest uppercase bg-[#F8F9FB] text-[#1C1C1E]/30 px-2 py-0.5 rounded-full">Coming Soon</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-[#1C1C1E]/40 font-medium">{account.description}</p>

                                        {linked && displayName && (
                                            <div className="mt-3 bg-[#F8F9FB] rounded-xl p-3 border border-black/5">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {identity?.identity_data?.avatar_url && (
                                                            <img src={identity.identity_data.avatar_url} alt="" className="w-5 h-5 rounded-full" />
                                                        )}
                                                        <p className="text-sm font-semibold text-[#1C1C1E]">{displayName}</p>
                                                    </div>
                                                    {connectedDate && (
                                                        <p className="text-xs text-[#1C1C1E]/30 font-medium">since {connectedDate}</p>
                                                    )}
                                                </div>
                                                {identity?.identity_data?.email && (
                                                    <span className="text-xs bg-white border border-black/5 text-[#1C1C1E]/60 px-2.5 py-1 rounded-lg font-medium">
                                                        {identity.identity_data.email}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {linked ? (
                                            <>
                                                <button
                                                    onClick={() => syncAccount(account.id)}
                                                    className="w-9 h-9 rounded-xl bg-[#F8F9FB] border border-black/5 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                    title="Re-sync"
                                                >
                                                    <RefreshCw className={`w-4 h-4 text-[#1C1C1E]/40 ${syncing === account.id ? 'animate-spin' : ''}`} />
                                                </button>
                                            </>
                                        ) : account.provider ? (
                                            <button
                                                onClick={() => handleConnect(account)}
                                                disabled={connecting === account.id}
                                                className={`flex items-center gap-2 ${account.bgColor} text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50`}
                                            >
                                                {connecting === account.id ? (
                                                    <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</>
                                                ) : (
                                                    <><Plus className="w-4 h-4" /> Connect</>
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                disabled
                                                className="flex items-center gap-2 bg-[#F8F9FB] text-[#1C1C1E]/30 px-5 py-2.5 rounded-xl font-bold text-sm cursor-not-allowed"
                                            >
                                                <Plus className="w-4 h-4" /> Connect
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Email Notifications Setting */}
                <div className="mt-8 bg-white/60 backdrop-blur-2xl border border-white rounded-2xl p-6 shadow-glass">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#F8F9FB] flex items-center justify-center">
                            <Mail className="w-5 h-5 text-[#1C1C1E]/40" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm">Sync Notifications</p>
                            <p className="text-xs text-[#1C1C1E]/40 font-medium">Get notified when new data is imported from connected accounts.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1C1C1E]"></div>
                        </label>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
