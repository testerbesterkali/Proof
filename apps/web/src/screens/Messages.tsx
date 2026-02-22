import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Search, Send, Phone, Video, MoreVertical, Smile, Paperclip, ShieldCheck, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/Layout';
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
    id: string; // This is the other user's ID
    name: string;
    role: string;
    avatar: string;
    lastMessage?: string;
    status: 'online' | 'offline';
}

export function Messages() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) return;
        loadConversations();
    }, [user]);

    const loadConversations = async () => {
        if (!user) return;
        try {
            // 1. Fetch all messages involving the current user
            const { data: messageData, error: msgError } = await supabase
                .from('Message')
                .select('*')
                .or(`senderId.eq.${user.id},receiverId.eq.${user.id}`)
                .order('createdAt', { ascending: true });

            if (msgError) throw msgError;

            const allMessages = messageData as Message[];
            if (!allMessages.length) {
                // If no actual messages, provide a mock conversation to start with so the UI isn't empty,
                // but wire it to a specific mock employer ID so it works.
                setConversations([
                    {
                        id: 'mock-employer-123',
                        name: 'Stripe Hiring Team',
                        role: 'EMPLOYER',
                        avatar: 'https://i.pravatar.cc/150?u=stripe',
                        status: 'online',
                        lastMessage: 'Welcome to Proof messaging!'
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

            // 3. Fetch Employer Profiles to get names
            const { data: employers, error: empError } = await supabase
                .from('EmployerProfile')
                .select('userId, companyName')
                .in('userId', Array.from(partnerIds));

            if (empError) throw empError;

            const empMap = new Map(employers?.map(e => [e.userId, e.companyName]));

            const loadedConvos: Conversation[] = Array.from(partnerIds).map(id => ({
                id,
                name: empMap.get(id) || `Employer #${id.substring(0, 6)}`,
                role: 'EMPLOYER',
                avatar: `https://i.pravatar.cc/150?u=${id}`,
                status: 'online', // Mock online status
                lastMessage: lastMessageMap.get(id) || ''
            }));

            setConversations(loadedConvos);

            // Auto-select the first conversation if none is selected
            if (loadedConvos.length > 0 && !selectedConvo) {
                setSelectedConvo(loadedConvos[0]);
            }

        } catch (err) {
            console.error('Error loading conversations:', err);
        }
    };

    // Load messages for selected conversation
    useEffect(() => {
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
                    // Filter messages where we are either sender or receiver
                },
                (payload) => {
                    const newMsg = payload.new as Message;
                    // Check if it belongs to this conversation threading
                    if (
                        (newMsg.senderId === user.id && newMsg.receiverId === selectedConvo.id) ||
                        (newMsg.senderId === selectedConvo.id && newMsg.receiverId === user.id)
                    ) {
                        setMessages((prev) => {
                            // Deduplicate just in case
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

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConvo || !user) return;

        const content = newMessage;
        setNewMessage(''); // optimistic clear

        const msgData = {
            id: crypto.randomUUID(),
            senderId: user.id,
            receiverId: selectedConvo.id,
            content,
            isRead: false
        };

        // Optimistic UI update
        // We add an optimistic timestamp, the real one will come from Supabase via Realtime,
        // but since we deduct local echoes in Realtime it handles smoothly. Note: Realtime might send it back.
        setMessages(prev => [...prev, { ...msgData, createdAt: new Date().toISOString() }]);

        try {
            const { error } = await supabase.from('Message').insert(msgData);
            if (error) throw error;
        } catch (err) {
            console.error('Failed to send message:', err);
            // Revert optimistic update? For now simply log.
        }
    };

    return (
        <Layout>
            <div className="flex-1 flex gap-8 pb-12 overflow-hidden h-[calc(100vh-160px)]">
                {/* Inbox Card */}
                <div className="w-[400px] bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-glass-soft border border-white/60 flex flex-col overflow-hidden">
                    <div className="p-8 pb-4">
                        <h2 className="text-3xl font-black tracking-tighter mb-6 uppercase">Inbox</h2>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1C1E]/30 group-focus-within:text-proof-accent transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                className="w-full bg-white/60 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-proof-accent/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 space-y-2 py-4">
                        {conversations.map((convo, i) => (
                            <motion.div
                                key={convo.id}
                                onClick={() => setSelectedConvo(convo)}
                                className={`p-5 rounded-[2rem] flex gap-4 cursor-pointer transition-all relative ${selectedConvo?.id === convo.id
                                    ? 'bg-white shadow-glass scale-[1.02]'
                                    : 'hover:bg-white/40'
                                    }`}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm">
                                        <img src={convo.avatar} alt={convo.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-white ${convo.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-black text-sm tracking-tight">{convo.name}</h4>
                                    </div>
                                    <p className={`text-xs truncate font-bold ${selectedConvo?.id === convo.id ? 'text-proof-accent' : 'text-[#1C1C1E]/50'}`}>
                                        {convo.lastMessage}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Chat Card */}
                <div className="flex-1 bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-glass-soft border border-white/60 flex flex-col overflow-hidden relative">
                    {selectedConvo ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-8 border-b border-white/40 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md">
                                        <img src={selectedConvo.avatar} alt={selectedConvo.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-black text-xl tracking-tighter">{selectedConvo.name}</h3>
                                            <ShieldCheck size={16} className="text-proof-accent" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1E]/40 font-mono">{selectedConvo.role}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#1C1C1E]/30 hover:bg-white hover:text-proof-accent transition-all shadow-sm"><Phone size={18} /></button>
                                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#1C1C1E]/30 hover:bg-white hover:text-proof-accent transition-all shadow-sm"><Video size={18} /></button>
                                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#1C1C1E]/30 hover:bg-white hover:text-[#1C1C1E] transition-all shadow-sm"><MoreVertical size={18} /></button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-8 py-8 flex flex-col gap-6">
                                <div className="flex-1" />
                                {messages.map((msg, i) => {
                                    const isMe = msg.senderId === user?.id;
                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`p-5 rounded-[2rem] text-[13px] leading-relaxed shadow-glass-soft max-w-[70%] font-bold ${isMe
                                                ? 'bg-[#1C1C1E] text-white rounded-tr-none'
                                                : 'bg-white border border-white text-[#1C1C1E] rounded-tl-none'
                                                }`}>
                                                {msg.content}
                                                <div className={`text-[9px] font-black uppercase mt-3 tracking-widest opacity-40`}>
                                                    {msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                <div ref={scrollRef} />
                            </div>

                            {/* Chat Input */}
                            <div className="p-8">
                                <form
                                    onSubmit={handleSendMessage}
                                    className="bg-white/80 backdrop-blur-3xl p-3 border border-white rounded-[2.5rem] shadow-glass flex items-center gap-2"
                                >
                                    <button type="button" className="w-12 h-12 flex items-center justify-center text-[#1C1C1E]/30 hover:text-proof-accent transition-colors"><Paperclip size={20} /></button>
                                    <input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a high-affinity message..."
                                        className="flex-1 bg-transparent border-none py-3 px-2 text-sm font-bold focus:ring-0"
                                    />
                                    <button type="button" className="w-12 h-12 flex items-center justify-center text-[#1C1C1E]/30 hover:text-proof-accent transition-colors"><Smile size={20} /></button>
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="w-12 h-12 bg-proof-accent text-white rounded-full flex items-center justify-center shadow-lg hover:scale-[1.05] active:scale-[0.95] transition-all disabled:opacity-30 disabled:grayscale"
                                    >
                                        <Send size={20} className="ml-1" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                            <motion.div
                                animate={{ rotate: [0, 10, 0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="w-40 h-40 bg-white/60 rounded-[4rem] shadow-glass flex items-center justify-center text-proof-accent mb-10 border border-white"
                            >
                                <Mail size={56} strokeWidth={1} />
                            </motion.div>
                            <h3 className="text-5xl font-black tracking-tighter mb-4">INBOX</h3>
                            <p className="text-[#1C1C1E]/30 text-xs font-black tracking-[0.2em] uppercase max-w-xs leading-loose">
                                Select a conversation from the sidebar to start collaborating.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
