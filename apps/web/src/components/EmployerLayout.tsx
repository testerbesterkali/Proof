import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, MessageSquare, Search, Bell, LogOut, Plus, ArrowRight, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
}

export function EmployerLayout({ children }: LayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { signOut, user } = useAuth();

    const sidebarItems = [
        { icon: LayoutDashboard, path: '/employer/dashboard', label: 'Dashboard' },
        { icon: Briefcase, path: '/employer/challenges', label: 'Challenges' },
        { icon: Users, path: '/employer/submissions', label: 'Submissions' },
        { icon: MessageSquare, path: '/employer/messages', label: 'Messages' },
        { icon: Building2, path: '/employer/profile', label: 'Profile' },
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
                <Link to="/employer/dashboard" className="mb-16 flex items-center justify-center relative group">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center relative z-10 shadow-lg border border-black/5"
                    >
                        <span className="font-black text-xl text-[#1C1C1E] leading-none">P</span><span className="font-black text-xl text-proof-accent leading-none">.</span>
                    </motion.div>
                </Link>

                <nav className="flex flex-col gap-6">
                    {sidebarItems.map((item, i) => {
                        const Icon = item.icon;
                        const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
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
                                            layoutId="sidebarActiveEmployer"
                                            className="absolute left-[-16px] w-1.5 h-6 bg-proof-accent rounded-r-full"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </AnimatePresence>
                                <div className="absolute left-16 bg-[#1C1C1E] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold uppercase tracking-widest z-50">
                                    {item.label}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto mb-4">
                    <button
                        onClick={() => signOut()}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl transition-all relative group text-[#1C1C1E]/40 hover:text-red-500 hover:bg-red-50"
                    >
                        <LogOut size={20} strokeWidth={2.5} />
                        <div className="absolute left-16 bg-[#1C1C1E] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold uppercase tracking-widest z-50">
                            Sign Out
                        </div>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 ml-24 pl-8 pr-12 pt-8 flex flex-col relative min-h-screen z-10 overflow-y-auto">
                {/* HEADER BAR */}
                <header className="flex items-center justify-between mb-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center"
                    >
                        <div className="flex items-center gap-2 bg-white/40 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/40 shadow-glass w-64">
                            <Search size={14} className="text-[#1C1C1E]/30" />
                            <input
                                type="text"
                                placeholder="Search candidates..."
                                className="bg-transparent text-xs font-medium placeholder-[#1C1C1E]/30 focus:outline-none w-full text-[#1C1C1E]"
                            />
                        </div>
                    </motion.div>

                    <div className="flex items-center gap-3">
                        <button className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-xl border border-white/40 flex items-center justify-center relative hover:bg-white/60 transition-colors shadow-sm">
                            <Bell size={16} strokeWidth={2.5} className="text-[#1C1C1E]/50" />
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-proof-accent rounded-full text-[8px] font-black text-white flex items-center justify-center">1</span>
                        </button>
                        <Link
                            to="/employer/create-challenge"
                            className="bg-[#1C1C1E] text-white px-8 py-3.5 rounded-full text-xs font-black shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center gap-2 ml-1"
                        >
                            NEW CHALLENGE <Plus size={14} strokeWidth={3} />
                        </Link>
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
}
