import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Mail, Inbox, Users, ArrowRight, BarChart3, Kanban, Link2 } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    showFindChallenge?: boolean;
}

export function Layout({ children, showFindChallenge = true }: LayoutProps) {
    const location = useLocation();

    const sidebarItems = [
        { icon: LayoutDashboard, path: '/dashboard', label: 'Dashboard' },
        { icon: Briefcase, path: '/challenges', label: 'Challenges' },
        { icon: Kanban, path: '/applications', label: 'Applications' },
        { icon: BarChart3, path: '/analytics', label: 'Analytics' },
        { icon: Mail, path: '/messages', label: 'Messages' },
        { icon: Inbox, path: '/upload', label: 'Record Proof' },
    ];

    const settingsItems = [
        { icon: Link2, path: '/settings/accounts', label: 'Accounts' },
    ];

    const currentPath = location.pathname;

    return (
        <div className="w-full h-screen flex text-[#1C1C1E] overflow-hidden relative bg-[#F8F9FB]">
            {/* GLOBAL MESH GRADIENT BG */}
            <div className="absolute inset-0 pointer-events-none opacity-10 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-proof-accent blur-[140px] rounded-full" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-[#1C1C1E] blur-[120px] rounded-full" />
            </div>

            {/* LEFT SIDEBAR */}
            <aside className="w-24 fixed h-full flex flex-col items-center py-10 z-50 bg-white/40 backdrop-blur-xl border-r border-white/40">
                <Link to="/" className="mb-16 flex items-center justify-center relative group">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-2xl bg-[#1C1C1E] flex items-center justify-center text-white font-black text-xl relative z-10 shadow-lg group-hover:bg-proof-accent transition-colors"
                    >
                        P
                    </motion.div>
                    <div className="absolute w-8 h-8 -bottom-3 -right-3 rounded-full border-2 border-white overflow-hidden z-20 shadow-md">
                        <img src="https://i.pravatar.cc/100?img=33" alt="User" className="w-full h-full object-cover" />
                    </div>
                </Link>

                <nav className="flex flex-col gap-6">
                    {sidebarItems.map((item, i) => {
                        const Icon = item.icon;
                        const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
                        return (
                            <Link
                                key={i}
                                to={item.path}
                                className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all relative group ${isActive
                                    ? 'bg-white text-[#1C1C1E] shadow-glass'
                                    : 'text-[#1C1C1E]/40 hover:text-[#1C1C1E] hover:bg-white/40'
                                    }`}
                            >
                                <Icon size={20} strokeWidth={2.5} />
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebarActive"
                                            className="absolute left-[-16px] w-1.5 h-6 bg-proof-accent rounded-r-full"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </AnimatePresence>
                                <div className="absolute left-16 bg-[#1C1C1E] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold uppercase tracking-widest">
                                    {item.label}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Divider */}
                <div className="w-8 h-px bg-black/5 my-4" />

                {/* Settings links */}
                <nav className="flex flex-col gap-6">
                    {settingsItems.map((item, i) => {
                        const Icon = item.icon;
                        const isActive = currentPath.startsWith(item.path);
                        return (
                            <Link
                                key={i}
                                to={item.path}
                                className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all relative group ${isActive
                                    ? 'bg-white text-[#1C1C1E] shadow-glass'
                                    : 'text-[#1C1C1E]/40 hover:text-[#1C1C1E] hover:bg-white/40'
                                    }`}
                            >
                                <Icon size={20} strokeWidth={2.5} />
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebarSettingsActive"
                                            className="absolute left-[-16px] w-1.5 h-6 bg-proof-accent rounded-r-full"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </AnimatePresence>
                                <div className="absolute left-16 bg-[#1C1C1E] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold uppercase tracking-widest">
                                    {item.label}
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 ml-24 pl-8 pr-12 pt-8 flex flex-col relative min-h-screen z-10 overflow-y-auto">
                {/* HEADER BAR */}
                <header className="flex items-center justify-between mb-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex bg-white/40 backdrop-blur-xl px-2 py-2 rounded-full gap-1 shadow-glass border border-white/40"
                    >
                        {['Overview', 'Challenges', 'Messages', 'Community'].map((item) => {
                            const path = item === 'Challenges' ? '/challenges' : (item === 'Messages' ? '/messages' : (item === 'Community' ? '/community' : '/'));
                            const isActive = currentPath === path;
                            return (
                                <Link
                                    key={item}
                                    to={path}
                                    className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${isActive
                                        ? 'bg-[#1C1C1E] text-white shadow-lg'
                                        : 'text-[#1C1C1E]/50 hover:text-[#1C1C1E] hover:bg-white/50'
                                        }`}
                                >
                                    {item}
                                </Link>
                            );
                        })}
                    </motion.div>

                    <div className="flex items-center gap-4">
                        {showFindChallenge && (
                            <Link
                                to="/challenges"
                                className="bg-proof-accent text-white px-8 py-3.5 rounded-full text-xs font-black shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center gap-2"
                            >
                                FIND A CHALLENGE <ArrowRight size={14} strokeWidth={3} />
                            </Link>
                        )}
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
}
