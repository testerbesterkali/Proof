import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import {
    Github, Linkedin, Chrome, Globe, Shield, CheckCircle, XCircle,
    ExternalLink, RefreshCw, Trash2, Plus, Mail, FileText, Figma
} from 'lucide-react';

interface ConnectedAccount {
    id: string;
    name: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    connected: boolean;
    username?: string;
    connectedAt?: string;
    description: string;
    importedData?: string[];
}

const initialAccounts: ConnectedAccount[] = [
    {
        id: 'github',
        name: 'GitHub',
        icon: Github,
        color: 'text-[#1C1C1E]',
        bgColor: 'bg-[#1C1C1E]',
        connected: true,
        username: 'alexchen',
        connectedAt: 'Feb 14, 2026',
        description: 'Import repos, contributions, and tech stack',
        importedData: ['42 repositories', '1,247 contributions', '12 languages detected'],
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: Linkedin,
        color: 'text-[#0077B5]',
        bgColor: 'bg-[#0077B5]',
        connected: true,
        username: 'Alex Chen',
        connectedAt: 'Feb 14, 2026',
        description: 'Verify identity and import work history',
        importedData: ['5 positions imported', 'Identity verified', '127 connections'],
    },
    {
        id: 'google',
        name: 'Google',
        icon: Chrome,
        color: 'text-[#4285F4]',
        bgColor: 'bg-[#4285F4]',
        connected: false,
        description: 'Sign in with Google and sync calendar for interviews',
    },
    {
        id: 'figma',
        name: 'Figma',
        icon: Figma,
        color: 'text-[#F24E1E]',
        bgColor: 'bg-[#F24E1E]',
        connected: false,
        description: 'Link design files as proof of work',
    },
    {
        id: 'portfolio',
        name: 'Personal Website',
        icon: Globe,
        color: 'text-purple-600',
        bgColor: 'bg-purple-600',
        connected: true,
        username: 'alexchen.dev',
        connectedAt: 'Feb 16, 2026',
        description: 'Showcase your portfolio and personal brand',
        importedData: ['Website verified'],
    },
];

export function ConnectedAccounts() {
    const [accounts, setAccounts] = useState(initialAccounts);
    const [syncing, setSyncing] = useState<string | null>(null);

    const toggleConnection = (id: string) => {
        setAccounts(prev => prev.map(a =>
            a.id === id
                ? {
                    ...a,
                    connected: !a.connected,
                    ...(a.connected
                        ? { username: undefined, connectedAt: undefined, importedData: undefined }
                        : { username: 'Connected', connectedAt: 'Just now', importedData: ['Syncing data...'] }
                    ),
                }
                : a
        ));
    };

    const syncAccount = (id: string) => {
        setSyncing(id);
        setTimeout(() => setSyncing(null), 2000);
    };

    const connectedCount = accounts.filter(a => a.connected).length;

    return (
        <Layout>
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Connected Accounts</h1>
                    <p className="text-[#1C1C1E]/50 font-medium">
                        Manage linked services to auto-import skills, verify identity, and strengthen your profile.
                    </p>
                </div>

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
                        <p className="text-3xl font-bold text-proof-accent">{connectedCount}/{accounts.length}</p>
                        <p className="text-xs text-white/40 font-medium">accounts linked</p>
                    </div>
                </motion.div>

                {/* Accounts List */}
                <div className="space-y-4">
                    {accounts.map((account, i) => (
                        <motion.div
                            key={account.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className={`bg-white/60 backdrop-blur-2xl border rounded-2xl p-6 shadow-glass transition-all ${account.connected ? 'border-green-100' : 'border-white hover:border-black/10'}`}
                        >
                            <div className="flex items-start gap-5">
                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${account.connected ? 'bg-green-50' : 'bg-[#F8F9FB]'}`}>
                                    <account.icon className={`w-6 h-6 ${account.connected ? 'text-green-600' : account.color}`} />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-bold text-base">{account.name}</p>
                                        {account.connected && (
                                            <span className="text-[10px] font-bold tracking-widest uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Connected</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-[#1C1C1E]/40 font-medium">{account.description}</p>

                                    {account.connected && account.username && (
                                        <div className="mt-3 bg-[#F8F9FB] rounded-xl p-3 border border-black/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-semibold text-[#1C1C1E]">{account.username}</p>
                                                <p className="text-xs text-[#1C1C1E]/30 font-medium">since {account.connectedAt}</p>
                                            </div>
                                            {account.importedData && (
                                                <div className="flex flex-wrap gap-2">
                                                    {account.importedData.map(d => (
                                                        <span key={d} className="text-xs bg-white border border-black/5 text-[#1C1C1E]/60 px-2.5 py-1 rounded-lg font-medium">
                                                            {d}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {account.connected ? (
                                        <>
                                            <button
                                                onClick={() => syncAccount(account.id)}
                                                className="w-9 h-9 rounded-xl bg-[#F8F9FB] border border-black/5 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                title="Re-sync"
                                            >
                                                <RefreshCw className={`w-4 h-4 text-[#1C1C1E]/40 ${syncing === account.id ? 'animate-spin' : ''}`} />
                                            </button>
                                            <button
                                                onClick={() => toggleConnection(account.id)}
                                                className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center hover:bg-red-100 transition-colors"
                                                title="Disconnect"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => toggleConnection(account.id)}
                                            className={`flex items-center gap-2 ${account.bgColor} text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity`}
                                        >
                                            <Plus className="w-4 h-4" /> Connect
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
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
