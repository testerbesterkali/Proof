import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Search, User, MoreVertical, Phone, Video, Smile, Paperclip } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: string;
}

interface Conversation {
    id: string;
    email: string;
    role: string;
    lastMessage?: string;
}

export function Messages() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Mock current user ID - in a real app, this would come from auth context
    const currentUserId = "me-user-id";

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io('http://localhost:3000', {
            withCredentials: true
        });
        setSocket(newSocket);

        // Mock conversations
        setConversations([
            { id: 'user-1', email: 'sarah.design@gmail.com', role: 'CANDIDATE', lastMessage: 'The design files are ready for review.' },
            { id: 'user-2', email: 'alex.backend@proof.com', role: 'CANDIDATE', lastMessage: 'I have optimized the database queries.' },
            { id: 'user-3', email: 'hiring.manager@stripe.com', role: 'EMPLOYER', lastMessage: 'We would like to invite you for an interview.' }
        ]);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (selectedConvo && socket) {
            const roomId = [currentUserId, selectedConvo.id].sort().join('-');
            socket.emit('join_room', roomId);

            // Fetch history (Mocking for now)
            setMessages([
                { id: '1', senderId: selectedConvo.id, receiverId: currentUserId, content: 'Hey, how is it going?', createdAt: new Date().toISOString() },
                { id: '2', senderId: currentUserId, receiverId: selectedConvo.id, content: 'Pretty good! Working on the new matching algorithm.', createdAt: new Date().toISOString() }
            ]);

            socket.on('receive_message', (msg: Message) => {
                setMessages(prev => [...prev, msg]);
            });

            return () => {
                socket.off('receive_message');
            };
        }
    }, [selectedConvo, socket]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConvo || !socket) return;

        const msgData = {
            id: Date.now().toString(),
            senderId: currentUserId,
            receiverId: selectedConvo.id,
            content: newMessage,
            createdAt: new Date().toISOString(),
            roomId: [currentUserId, selectedConvo.id].sort().join('-')
        };

        socket.emit('send_message', msgData);
        setMessages(prev => [...prev, msgData]);
        setNewMessage('');
    };

    return (
        <div className="flex h-[calc(100vh-64px)] bg-[#F8F9FB] overflow-hidden">
            {/* Conversations Sidebar */}
            <div className="w-80 bg-white border-r border-[#E4E5E7] flex flex-col">
                <div className="p-4 border-b border-[#E4E5E7]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1C1C1E]/40" size={18} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full bg-[#F8F9FB] border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#1C1C1E]/5"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map((convo) => (
                        <div
                            key={convo.id}
                            onClick={() => setSelectedConvo(convo)}
                            className={`p-4 flex gap-3 cursor-pointer transition-colors ${selectedConvo?.id === convo.id ? 'bg-[#F8F9FB]' : 'hover:bg-[#F8F9FB]/50'}`}
                        >
                            <div className="w-12 h-12 bg-[#1C1C1E]/5 rounded-full flex items-center justify-center text-[#1C1C1E]">
                                <User size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                    <h4 className="font-semibold text-sm truncate">{convo.email.split('@')[0]}</h4>
                                    <span className="text-[10px] text-[#1C1C1E]/40">12:45 PM</span>
                                </div>
                                <p className="text-xs text-[#1C1C1E]/60 truncate">{convo.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedConvo ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 bg-white border-b border-[#E4E5E7] px-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#1C1C1E]/5 rounded-full flex items-center justify-center">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">{selectedConvo.email}</h3>
                                    <span className="text-[10px] text-green-500 font-medium">Online</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-[#1C1C1E]/60">
                                <button className="hover:text-[#1C1C1E] transition-colors"><Phone size={20} /></button>
                                <button className="hover:text-[#1C1C1E] transition-colors"><Video size={20} /></button>
                                <button className="hover:text-[#1C1C1E] transition-colors"><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((msg, i) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`max-w-[70%] p-3 rounded-2xl text-sm ${msg.senderId === currentUserId
                                                ? 'bg-[#1C1C1E] text-white rounded-tr-none'
                                                : 'bg-white border border-[#E4E5E7] text-[#1C1C1E] rounded-tl-none'
                                            }`}
                                    >
                                        {msg.content}
                                        <div className={`text-[10px] mt-1 ${msg.senderId === currentUserId ? 'text-white/40' : 'text-[#1C1C1E]/40'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </motion.div>
                                    <div ref={scrollRef} />
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-[#E4E5E7]">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <button type="button" className="p-2 text-[#1C1C1E]/40 hover:text-[#1C1C1E] transition-colors">
                                    <Paperclip size={20} />
                                </button>
                                <div className="flex-1 relative">
                                    <input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="w-full bg-[#F8F9FB] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#1C1C1E]/5 pr-10"
                                    />
                                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1C1C1E]/40 hover:text-[#1C1C1E]">
                                        <Smile size={20} />
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="p-3 bg-[#1C1C1E] text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-[#1C1C1E]/40">
                        <div className="w-16 h-16 bg-[#1C1C1E]/5 rounded-full flex items-center justify-center mb-4">
                            <Send size={32} />
                        </div>
                        <h3 className="font-semibold">Select a conversation</h3>
                        <p className="text-sm">Choose someone to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}
