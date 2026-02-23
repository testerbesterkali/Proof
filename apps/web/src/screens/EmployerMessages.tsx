import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Briefcase, Users, MessageSquare, Search, Send, Phone, Video, MoreVertical, Smile, Paperclip, CheckCircle2, LogOut, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { EmployerLayout } from '../components/EmployerLayout';

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
    const [loading, setLoading] = React.useState(true);
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
        setLoading(true);
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
                setLoading(false);
                return;
            }

            const partnerIds = new Set<string>();
            const lastMessageMap = new Map<string, string>();
            allMessages.forEach(m => {
                const partnerId = m.senderId === user.id ? m.receiverId : m.senderId;
                partnerIds.add(partnerId);
                lastMessageMap.set(partnerId, m.content);
            });

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
        } finally {
            setLoading(false);
        }
    };

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

        const channel = supabase.channel(`messages:${user.id}:${selectedConvo.id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Message' }, (payload) => {
                const newMsg = payload.new as Message;
                if ((newMsg.senderId === user.id && newMsg.receiverId === selectedConvo.id) ||
                    (newMsg.senderId === selectedConvo.id && newMsg.receiverId === user.id)) {
                    setMessages((prev) => prev.find(m => m.id === newMsg.id) ? prev : [...prev, newMsg]);
                }
            }).subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [user, selectedConvo]);

    React.useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConvo || !user) return;
        const content = newMessage;
        setNewMessage('');
        const msgData = { id: crypto.randomUUID(), senderId: user.id, receiverId: selectedConvo.id, content, isRead: false };
        setMessages(prev => [...prev, { ...msgData, createdAt: new Date().toISOString() }]);
        try {
            const { error } = await supabase.from('Message').insert(msgData);
            if (error) throw error;
        } catch (err) { console.error('Failed to send message:', err); }
    };

    return (
        <EmployerLayout>
            <div className="flex-1 flex flex-col h-[calc(100vh-140px)]">
                <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] shadow-glass-soft border border-white flex-1 overflow-hidden flex">
                    {/* Conversations List */}
                    <div className="w-80 border-r border-white/60 flex flex-col bg-white/20">
                        <div className="p-8 pb-4">
                            <h2 className="text-2xl font-black tracking-tighter mb-6 uppercase">Talent Inbound</h2>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1C1E]/20 group-focus-within:text-proof-accent transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search candidates..."
                                    className="w-full bg-white/40 border border-transparent focus:border-proof-accent/20 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold shadow-sm transition-all focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-6 h-6 animate-spin text-proof-accent/40" />
                                </div>
                            ) : conversations.map((convo) => (
                                <button
                                    key={convo.id}
                                    onClick={() => setSelectedConvo(convo)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all text-left ${selectedConvo?.id === convo.id
                                        ? 'bg-white shadow-glass border border-white scale-[1.02]'
                                        : 'hover:bg-white/40 border border-transparent hover:border-white'
                                        }`}
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-[#1C1C1E]/5 flex items-center justify-center overflow-hidden shadow-sm">
                                            <img src={convo.avatar} alt={convo.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${convo.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-sm truncate uppercase tracking-tight">{convo.name}</h4>
                                        <p className={`text-[10px] truncate font-bold uppercase tracking-widest mt-0.5 ${selectedConvo?.id === convo.id ? 'text-[#1C1C1E]' : 'text-[#1C1C1E]/40'}`}>
                                            {convo.lastMessage || 'No messages yet'}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    {selectedConvo ? (
                        <div className="flex-1 flex flex-col bg-white/40">
                            {/* Chat Header */}
                            <header className="px-8 py-6 border-b border-white flex items-center justify-between bg-white/40 backdrop-blur-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#1C1C1E]/5 flex items-center justify-center overflow-hidden shadow-sm">
                                        <img src={selectedConvo.avatar} alt={selectedConvo.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg tracking-tight uppercase">{selectedConvo.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-proof-accent">Candidate verified</span>
                                            <div className="w-1 h-1 rounded-full bg-[#1C1C1E]/20" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-[#1C1C1E]/30">Active now</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center text-[#1C1C1E]/40 hover:text-[#1C1C1E] transition-all shadow-sm"><Phone size={18} /></button>
                                    <button className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center text-[#1C1C1E]/40 hover:text-[#1C1C1E] transition-all shadow-sm"><Video size={18} /></button>
                                    <button className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center text-[#1C1C1E]/40 hover:text-[#1C1C1E] transition-all shadow-sm"><MoreVertical size={18} /></button>
                                </div>
                            </header>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                <AnimatePresence initial={false}>
                                    {messages.map((msg, idx) => {
                                        const isMe = msg.senderId === user?.id;
                                        return (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[70%] p-5 rounded-[2rem] shadow-glass-soft ${isMe
                                                    ? 'bg-[#1C1C1E] text-white rounded-tr-sm'
                                                    : 'bg-white border border-white text-[#1C1C1E] rounded-tl-sm'
                                                    }`}>
                                                    <p className="font-medium text-[14px] leading-relaxed">{msg.content}</p>
                                                    <div className={`text-[8px] font-black uppercase tracking-widest mt-2 flex items-center gap-2 ${isMe ? 'text-white/40' : 'text-[#1C1C1E]/30'}`}>
                                                        {msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        {isMe && <CheckCircle2 size={10} />}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                                <div ref={scrollRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-6 bg-white/40 border-t border-white">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-white/60 backdrop-blur-md border border-white p-2 rounded-full pl-6 focus-within:border-proof-accent/20 shadow-soft transition-all">
                                    <button type="button" className="text-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-colors"><Smile size={20} /></button>
                                    <button type="button" className="text-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-colors"><Paperclip size={20} /></button>
                                    <input
                                        type="text"
                                        placeholder="Type a message to the candidate..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1 bg-transparent py-3 px-2 focus:outline-none font-bold text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="w-12 h-12 bg-[#1C1C1E] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                                    >
                                        <Send size={18} className="translate-x-0.5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-white/20">
                            <div className="w-24 h-24 bg-white/40 rounded-[2.5rem] shadow-glass border border-white flex items-center justify-center mb-8">
                                <MessageSquare className="w-10 h-10 text-proof-accent/20" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight uppercase mb-2">Select a conversation</h3>
                            <p className="text-[#1C1C1E]/40 font-bold text-sm uppercase tracking-widest">Connect with your top talent pool</p>
                        </div>
                    )}
                </div>
            </div>
        </EmployerLayout>
    );
}
