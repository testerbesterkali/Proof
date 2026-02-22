import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { Clock, MessageSquare, ChevronRight, Building2, ExternalLink, XCircle, CheckCircle, Eye, AlertCircle } from 'lucide-react';

type Stage = 'applied' | 'reviewing' | 'challenge' | 'interviewing' | 'decision';

interface Application {
    id: string;
    company: string;
    role: string;
    stage: Stage;
    date: string;
    daysInStage: number;
    nextAction: string;
    matchScore: number;
}

const applications: Application[] = [
    { id: '1', company: 'Stripe', role: 'Senior Frontend Engineer', stage: 'interviewing', date: 'Feb 15', daysInStage: 3, nextAction: 'Final round scheduled', matchScore: 94 },
    { id: '2', company: 'Vercel', role: 'Full Stack Developer', stage: 'reviewing', date: 'Feb 18', daysInStage: 1, nextAction: 'Proof under review', matchScore: 88 },
    { id: '3', company: 'Linear', role: 'Product Engineer', stage: 'challenge', date: 'Feb 12', daysInStage: 5, nextAction: 'Complete coding challenge', matchScore: 91 },
    { id: '4', company: 'Figma', role: 'Design Engineer', stage: 'applied', date: 'Feb 20', daysInStage: 0, nextAction: 'Awaiting employer review', matchScore: 82 },
    { id: '5', company: 'Notion', role: 'Frontend Developer', stage: 'decision', date: 'Feb 8', daysInStage: 7, nextAction: 'Offer received!', matchScore: 96 },
    { id: '6', company: 'Supabase', role: 'Backend Engineer', stage: 'applied', date: 'Feb 19', daysInStage: 1, nextAction: 'Proof submitted', matchScore: 79 },
    { id: '7', company: 'Resend', role: 'Software Engineer', stage: 'decision', date: 'Feb 5', daysInStage: 10, nextAction: 'Not selected', matchScore: 72 },
];

const columns: { key: Stage; label: string; icon: React.ElementType; color: string }[] = [
    { key: 'applied', label: 'Applied', icon: ExternalLink, color: 'text-blue-500 bg-blue-50' },
    { key: 'reviewing', label: 'Under Review', icon: Eye, color: 'text-purple-500 bg-purple-50' },
    { key: 'challenge', label: 'Challenge', icon: AlertCircle, color: 'text-amber-500 bg-amber-50' },
    { key: 'interviewing', label: 'Interviewing', icon: MessageSquare, color: 'text-cyan-500 bg-cyan-50' },
    { key: 'decision', label: 'Decision', icon: CheckCircle, color: 'text-green-500 bg-green-50' },
];

function AppCard({ app }: { app: Application }) {
    const isOffer = app.stage === 'decision' && app.nextAction.includes('Offer');
    const isRejected = app.stage === 'decision' && app.nextAction.includes('Not selected');

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow cursor-pointer ${isOffer ? 'border-green-200 bg-green-50/30' : isRejected ? 'border-red-100 opacity-60' : 'border-gray-100'}`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                        {app.company[0]}
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-[#1C1C1E]">{app.company}</p>
                        <p className="text-xs text-gray-500">{app.role}</p>
                    </div>
                </div>
                <span className="text-xs font-bold text-[#64FFDA] bg-[#64FFDA]/10 px-2 py-1 rounded-full">{app.matchScore}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <Clock className="w-3 h-3" />
                <span>{app.date} · {app.daysInStage}d in stage</span>
            </div>
            <p className={`text-xs font-medium ${isOffer ? 'text-green-600' : isRejected ? 'text-red-500' : 'text-gray-600'}`}>
                {isOffer && <CheckCircle className="w-3 h-3 inline mr-1" />}
                {isRejected && <XCircle className="w-3 h-3 inline mr-1" />}
                {app.nextAction}
            </p>
        </motion.div>
    );
}

export function ApplicationTracker() {
    const [view, setView] = useState<'kanban' | 'list'>('kanban');

    return (
        <Layout>
            <div className="p-8 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1C1C1E]">Applications</h1>
                        <p className="text-gray-500 mt-1">{applications.length} active applications</p>
                    </div>
                    <div className="flex bg-gray-100 rounded-xl p-1">
                        <button
                            onClick={() => setView('kanban')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'kanban' ? 'bg-white shadow-sm text-[#1C1C1E]' : 'text-gray-500'}`}
                        >
                            Board
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'bg-white shadow-sm text-[#1C1C1E]' : 'text-gray-500'}`}
                        >
                            List
                        </button>
                    </div>
                </div>

                {view === 'kanban' ? (
                    /* Kanban Board */
                    <div className="flex-1 grid grid-cols-5 gap-4 overflow-x-auto">
                        {columns.map((col) => {
                            const colApps = applications.filter(a => a.stage === col.key);
                            return (
                                <div key={col.key} className="flex flex-col min-w-[220px]">
                                    <div className="flex items-center gap-2 mb-4 px-1">
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${col.color}`}>
                                            <col.icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold text-[#1C1C1E]">{col.label}</span>
                                        <span className="ml-auto text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{colApps.length}</span>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        {colApps.map(app => <AppCard key={app.id} app={app} />)}
                                        {colApps.length === 0 && (
                                            <div className="flex-1 flex items-center justify-center text-sm text-gray-300 border-2 border-dashed border-gray-100 rounded-xl p-8">
                                                No applications
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* List View */
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                                    <th className="py-3 px-4 font-medium">Company</th>
                                    <th className="py-3 px-4 font-medium">Role</th>
                                    <th className="py-3 px-4 font-medium">Stage</th>
                                    <th className="py-3 px-4 font-medium">Match</th>
                                    <th className="py-3 px-4 font-medium">Applied</th>
                                    <th className="py-3 px-4 font-medium">Next Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">{app.company[0]}</div>
                                                <span className="text-sm font-medium text-[#1C1C1E]">{app.company}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">{app.role}</td>
                                        <td className="py-4 px-4">
                                            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full capitalize">{app.stage}</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm font-bold text-[#64FFDA]">{app.matchScore}%</td>
                                        <td className="py-4 px-4 text-sm text-gray-500">{app.date}</td>
                                        <td className="py-4 px-4 text-sm text-gray-600 flex items-center gap-1">
                                            {app.nextAction} <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
}
