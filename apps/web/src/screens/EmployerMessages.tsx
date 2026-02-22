import * as React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Briefcase, Users, MessageSquare, Search, Send, Phone, Video, MoreVertical, Smile, Paperclip, CheckCircle2, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}

interface Conversation {
    id: string; // The other user's ID
    name: string;
    role: string;
    avatar: string;
    lastMessage?: string;
    status: 'online' | 'offline';
}

export function EmployerMessages() {
    const { user, signOut } = useAuth();
    const [conversations, setConversations] = React.useState<Conversation[]>([]);
    const [selectedConvo, setSelectedConvo] = React.useState<Conversation | null>(null);
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [newMessage, setNewMessage] = React.useState('');
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!user) return;
        loadConversations();
    }, [user]);

    const loadConversations = async () => {
        if (!user) return;
        try {
            // 1. Fetch all messages involving the current employer
            const { data: messageData, error: msgError } = await supabase
                .from('Message')
                .select('*')
                .or(`senderId.eq.${user.id},receiverId.eq.${user.id}`)
                .order('createdAt', { ascending: true });

            if (msgError) throw msgError;

            const allMessages = messageData as Message[];
            if (!allMessages.length) {
                // Mock conversation if none exist so the UI isn't completely empty during demo testing
                setConversations([
                    {
                        id: 'mock-candidate-123',
                        name: 'Candidate #A1B2C3',
                        role: 'CANDIDATE',
                        avatar: 'https://i.pravatar.cc/150?u=candidate',
                        status: 'online',
                        lastMessage: 'Waiting for a challenge...'
                    }
                ]);
                return;
            }

            // 2. Identify unique partner IDs and last messages
            const partnerIds = new Set<string>();
            const lastMessageMap = new Map<string, string>();
            allMessages.forEach(m => {
                const partnerId = m.senderId === user.id ? m.receiverId : m.senderId;
                partnerIds.add(partnerId);
                // Since messages are sorted ascending, the last one processed is the latest
                lastMessageMap.set(partnerId, m.content);
            });

            // 3. Fetch Candidate Profiles for these userIds to get their profile ID as a pseudo-name
            const { data: candidates, error: candError } = await supabase
                .from('CandidateProfile')
                .select('id, userId')
                .in('userId', Array.from(partnerIds));

            if (candError) throw candError;

            const candMap = new Map();
            candidates?.forEach(c => {
                candMap.set(c.userId, `Candidate #${c.id.substring(0, 6)}`);
            });

            const loadedConvos: Conversation[] = Array.from(partnerIds).map(id => ({
                id,
                name: candMap.get(id) || `Candidate #${id.substring(0, 6)}`,
                role: 'CANDIDATE',
                avatar: `https://i.pravatar.cc/150?u=${id}`,
                status: 'online',
                lastMessage: lastMessageMap.get(id) || ''
            }));

            setConversations(loadedConvos);

            if (loadedConvos.length > 0 && !selectedConvo) {
                setSelectedConvo(loadedConvos[0]);
            }

        } catch (err) {
            console.error('Error loading conversations:', err);
        }
    };

    // Load messages for selected conversation
    React.useEffect(() => {
        if (!user || !selectedConvo) return;

        const loadSelectedMessages = async () => {
            const { data } = await supabase
                .from('Message')
                .select('*')
                .or(`and(senderId.eq.${user.id},receiverId.eq.${selectedConvo.id}),and(senderId.eq.${selectedConvo.id},receiverId.eq.${user.id})`)
                .order('createdAt', { ascending: true });

            if (data) setMessages(data as Message[]);
        };

        loadSelectedMessages();

        // Subscribe to real-time incoming messages
        const channel = supabase.channel(`messages:${user.id}:${selectedConvo.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'Message',
                },
                (payload) => {
                    const newMsg = payload.new as Message;
                    if (
                        (newMsg.senderId === user.id && newMsg.receiverId === selectedConvo.id) ||
                        (newMsg.senderId === selectedConvo.id && newMsg.receiverId === user.id)
                    ) {
                        setMessages((prev) => {
                            if (prev.find(m => m.id === newMsg.id)) return prev;
                            return [...prev, newMsg];
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, selectedConvo]);

    React.useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConvo || !user) return;

        const content = newMessage;
        setNewMessage('');

        const msgData = {
            id: crypto.randomUUID(),
            senderId: user.id,
            receiverId: selectedConvo.id,
            content,
            isRead: false
        };

        // Optimistic UI update
        setMessages(prev => [...prev, { ...msgData, createdAt: new Date().toISOString() }]);

        try {
            const { error } = await supabase.from('Message').insert(msgData);
            if (error) throw error;
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    return (
        <div className="w-full min-h-screen flex text-[#1C1C1E] bg-[#E4E5E7] font-sans">
            {/* SIDEBAR */}
            <aside className="w-64 fixed h-full bg-white border-r border-[#1C1C1E]/5 flex flex-col p-8 z-30">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-[#1C1C1E] text-white rounded-xl flex items-center justify-center text-xl font-black">P</div>
                    <span className="font-black tracking-tighter text-xl">PROOF</span>
                </div>

                <nav className="flex flex-col gap-2">
                    <Link to="/employer/dashboard" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1E]/40 hover:text-[#1C1C1E] hover:bg-[#1C1C1E]/5 rounded-2xl font-bold text-sm transition-all">
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link to="/employer/challenges" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1E]/40 hover:text-[#1C1C1E] hover:bg-[#1C1C1E]/5 rounded-2xl font-bold text-sm transition-all">
                        <Briefcase size={18} /> Challenges
                    </Link>
                    <Link to="/employer/submissions" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1E]/40 hover:text-[#1C1C1E] hover:bg-[#1C1C1E]/5 rounded-2xl font-bold text-sm transition-all">
                        <Users size={18} /> Submissions
                    </Link>
                    <Link to="/employer/messages" className="flex items-center gap-3 px-4 py-3 bg-[#1C1C1E]/5 text-[#1C1C1E] rounded-2xl font-bold text-sm">
                        <MessageSquare size={18} /> Messages
                    </Link>
                </nav>

                <div className="mt-auto">
                    <button onClick={() => signOut()} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl font-bold text-sm transition-all shadow-sm bg-white border border-red-100">
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-64 p-8 flex flex-col h-screen">
                <div className="bg-white rounded-[3rem] shadow-soft border border-white flex-1 overflow-hidden flex">

                    {/* Conversations List */}
                    <div className="w-80 border-r border-[#1C1C1E]/5 flex flex-col bg-[#F8F9FB]/50">
                        <div className="p-8 pb-4">
                            <h2 className="text-2xl font-black tracking-tighter mb-6">MESSAGES</h2>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1C1E]/30" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search candidates..."
                                    className="w-full bg-white border border-transparent focus:border-[#1C1C1E]/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold shadow-sm transition-all focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                            {conversations.map((convo) => (
                                <button
                                    key={convo.id}
                                    onClick={() => setSelectedConvo(convo)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all text-left ${selectedConvo?.id === convo.id
                                        ? 'bg-white shadow-soft border border-white scale-[1.02]'
                                        : 'hover:bg-white/60 border border-transparent hover:border-white'
                                        }`}
                                >
                                    <div className="relative">
                                        <img src={convo.avatar} alt={convo.name} className="w-12 h-12 rounded-2xl object-cover" />
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${convo.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                                            }`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-sm truncate">{convo.name}</h4>
                                        </div>
                                        <p className={`text-xs truncate font-medium mt-0.5 ${selectedConvo?.id === convo.id ? 'text-[#1C1C1E]' : 'text-[#1C1C1E]/40'}`}>{convo.lastMessage}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    {selectedConvo ? (
                        <div className="flex-1 flex flex-col bg-white">
                            {/* Chat Header */}
                            <header className="px-8 py-6 border-b border-[#1C1C1E]/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <img src={selectedConvo.avatar} alt={selectedConvo.name} className="w-12 h-12 rounded-2xl object-cover" />
                                    <div>
                                        <h3 className="font-black text-lg tracking-tight">{selectedConvo.name}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1E]/40">{selectedConvo.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="w-10 h-10 rounded-full hover:bg-[#1C1C1E]/5 flex items-center justify-center text-[#1C1C1E]/40 hover:text-[#1C1C1E] transition-colors"><Phone size={18} /></button>
                                    <button className="w-10 h-10 rounded-full hover:bg-[#1C1C1E]/5 flex items-center justify-center text-[#1C1C1E]/40 hover:text-[#1C1C1E] transition-colors"><Video size={18} /></button>
                                    <button className="w-10 h-10 rounded-full hover:bg-[#1C1C1E]/5 flex items-center justify-center text-[#1C1C1E]/40 hover:text-[#1C1C1E] transition-colors"><MoreVertical size={18} /></button>
                                </div>
                            </header>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#F8F9FB]/30">
                                <div className="flex-1" />
                                {messages.map((msg, idx) => {
                                    const isMe = msg.senderId === user?.id;
                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[70%] p-5 rounded-3xl ${isMe
                                                ? 'bg-[#1C1C1E] text-white rounded-tr-sm'
                                                : 'bg-white border border-[#1C1C1E]/5 text-[#1C1C1E] rounded-tl-sm shadow-sm'
                                                }`}>
                                                <p className="font-medium text-[15px] leading-relaxed">{msg.content}</p>
                                                <span className={`text-[10px] font-bold mt-2 block ${isMe ? 'text-white/40' : 'text-[#1C1C1E]/30'}`}>
                                                    {msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                <div ref={scrollRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-6 bg-white border-t border-[#1C1C1E]/5">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-[#F8F9FB] border border-[#1C1C1E]/5 p-2 rounded-full pl-6 focus-within:border-[#1C1C1E]/20 focus-within:shadow-sm transition-all opacity-100">
                                    <button type="button" className="text-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-colors"><Smile size={20} /></button>
                                    <button type="button" className="text-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-colors"><Paperclip size={20} /></button>
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1 bg-transparent py-3 px-2 focus:outline-none font-medium text-[15px]"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="w-12 h-12 bg-[#1C1C1E] text-white rounded-full flex items-center justify-center shadow-md hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                                    >
                                        <Send size={18} className="translate-x-0.5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-[#F8F9FB]/30">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                                <MessageSquare className="w-8 h-8 text-[#1C1C1E]/20" />
                            </div>
                            <h3 className="text-xl font-black tracking-tight mb-2">Select a conversation</h3>
                            <p className="text-[#1C1C1E]/40 font-bold text-sm">Choose a candidate from the list to start messaging.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
