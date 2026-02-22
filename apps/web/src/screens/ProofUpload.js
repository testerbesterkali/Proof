import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Search, Mail, Briefcase, Inbox, Users, Video, StopCircle, RefreshCcw, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from '../components/ErrorBoundary';
export function ProofUpload() {
    const [recording, setRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(90);
    const [stream, setStream] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);
    const startRecording = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            const mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm' });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                setPreviewUrl(URL.createObjectURL(blob));
            };
            mediaRecorder.start(1000);
            setRecording(true);
            setTimeLeft(90);
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        stopRecording();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            window._proofUploadTimer = timer;
        }
        catch (err) {
            console.error('Error accessing media devices.', err);
        }
    };
    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            setRecording(false);
            clearInterval(window._proofUploadTimer);
        }
    };
    return (_jsx(ErrorBoundary, { children: _jsxs("div", { className: "w-full min-h-screen flex text-[#1C1C1E] bg-[#E4E5E7] font-sans", children: [_jsxs("aside", { className: "w-24 fixed h-full flex flex-col items-center py-8 z-20", children: [_jsx("div", { className: "mb-16 flex items-center justify-center relative", children: _jsx("div", { className: "w-12 h-12 rounded-full bg-[#FF6B52] flex items-center justify-center text-white font-bold text-xl relative z-10", children: "P" }) }), _jsx("nav", { className: "flex flex-col gap-8", children: [Search, Mail, Briefcase, Inbox, Users].map((Icon, i) => (_jsx("button", { className: "w-10 h-10 flex items-center justify-center rounded-2xl text-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-all", children: _jsx(Icon, { size: 20, strokeWidth: 2 }) }, i))) })] }), _jsxs("main", { className: "flex-1 ml-24 pl-8 pr-12 pt-8 flex flex-col relative min-h-screen", children: [_jsxs("header", { className: "flex items-center justify-between mb-12", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-medium tracking-tight mb-2", children: "Record Proof" }), _jsx("p", { className: "text-[#1C1C1E]/40 text-sm", children: "Demonstrate your skills in a 90-second video elevator pitch." })] }), _jsxs("div", { className: "bg-white/50 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-4 shadow-glass border border-white/20", children: [_jsx("div", { className: "flex -space-x-2", children: [1, 2, 3].map(i => (_jsx("div", { className: "w-6 h-6 rounded-full border-2 border-white bg-proof-bg overflow-hidden", children: _jsx("img", { src: `https://i.pravatar.cc/100?img=${i + 10}`, alt: "User" }) }, i))) }), _jsx("span", { className: "text-[10px] font-bold text-[#1C1C1E]/60 uppercase tracking-wider", children: "Recently Uploaded" })] })] }), _jsxs("div", { className: "flex-1 flex flex-col items-center justify-center pb-20", children: [_jsxs(motion.div, { layout: true, className: "w-full max-w-4xl bg-white/40 backdrop-blur-xl border border-white rounded-[2.5rem] p-4 shadow-glass relative overflow-hidden", children: [_jsxs("div", { className: "aspect-video bg-black rounded-[1.8rem] overflow-hidden relative shadow-inner", children: [previewUrl && !recording ? (_jsx("video", { src: previewUrl, controls: true, className: "w-full h-full object-cover" })) : (_jsx("video", { ref: videoRef, autoPlay: true, muted: true, playsInline: true, className: "w-full h-full object-cover opacity-90" })), _jsx(AnimatePresence, { children: recording && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "absolute inset-0 pointer-events-none", children: [_jsxs("div", { className: "absolute top-8 left-8 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur rounded-full text-white text-xs font-mono", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-red-500 animate-pulse" }), "REC 0:", timeLeft.toString().padStart(2, '0')] }), _jsx("div", { className: "absolute top-8 right-8 text-white/50 text-[10px] font-bold uppercase tracking-[0.2em]", children: "1080p 60fps" }), _jsxs("div", { className: "absolute inset-12 border border-white/10 rounded-2xl pointer-events-none flex items-center justify-center", children: [_jsx("div", { className: "w-px h-12 bg-white/5 absolute top-0" }), _jsx("div", { className: "w-px h-12 bg-white/5 absolute bottom-0" })] })] })) }), !recording && !previewUrl && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm", children: _jsxs("div", { className: "text-white text-center", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-white/10 backdrop-blur mb-4 mx-auto flex items-center justify-center border border-white/20", children: _jsx(Video, { className: "text-white/60", size: 32 }) }), _jsx("p", { className: "text-sm font-medium", children: "Camera preview will appear here" })] }) }))] }), _jsxs("div", { className: "mt-4 flex items-center justify-between px-4 py-2", children: [_jsx("div", { className: "flex items-center gap-6", children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-[10px] font-bold text-[#1C1C1E]/30 uppercase tracking-widest", children: "Mic Status" }), _jsx("div", { className: "flex gap-1 mt-1", children: [1, 2, 3, 4, 5, 6].map(i => (_jsx("div", { className: `w-1 h-3 rounded-full ${recording ? 'bg-[#FF6B52] animate-bounce' : 'bg-[#1C1C1E]/10'}`, style: { animationDelay: `${i * 0.1}s` } }, i))) })] }) }), _jsxs("div", { className: "flex items-center gap-4", children: [!recording && previewUrl && (_jsx("button", { onClick: () => { setPreviewUrl(null); startRecording(); }, className: "w-12 h-12 rounded-full border border-[#1C1C1E]/10 flex items-center justify-center text-[#1C1C1E]/40 hover:text-[#1C1C1E] hover:bg-white transition-all", children: _jsx(RefreshCcw, { size: 20 }) })), !recording ? (_jsxs("button", { onClick: startRecording, className: "group flex items-center justify-center bg-[#FF6B52] text-white p-2 rounded-full shadow-lg shadow-[#FF6B52]/20 hover:scale-105 transition-transform", children: [_jsx("div", { className: "bg-white/20 p-4 rounded-full", children: _jsx(Video, { size: 28 }) }), _jsx("span", { className: "px-6 font-bold text-lg", children: "Start Recording" })] })) : (_jsxs("button", { onClick: stopRecording, className: "group flex items-center justify-center bg-[#1C1C1E] text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform", children: [_jsx("div", { className: "bg-white/10 p-4 rounded-full", children: _jsx(StopCircle, { size: 28 }) }), _jsx("span", { className: "px-6 font-bold text-lg", children: "Stop Recording" })] }))] }), _jsx("div", { className: "w-32 flex justify-end", children: previewUrl && !recording && (_jsxs("button", { className: "flex items-center gap-2 bg-[#1C1C1E] text-white px-6 py-3 rounded-full font-bold shadow-soft hover:opacity-90 transition-opacity", children: ["Confirm ", _jsx(ArrowRight, { size: 18 })] })) })] })] }), _jsx("div", { className: "mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6", children: [
                                        { title: "Eye Contact", desc: "Look directly at the lens to build trust." },
                                        { title: "Clarity", desc: "Keep it under 90s. Focus on impact." },
                                        { title: "Lighting", desc: "Ensure your face is well lit from front." }
                                    ].map((tip, i) => (_jsxs("div", { className: "bg-white/40 p-6 rounded-3xl border border-white/60 shadow-inner-soft", children: [_jsx("h4", { className: "font-bold text-xs uppercase tracking-widest text-[#FF6B52] mb-2", children: tip.title }), _jsx("p", { className: "text-sm text-[#1C1C1E]/60 font-medium", children: tip.desc })] }, i))) })] })] }), _jsx("div", { className: "fixed -bottom-20 -right-20 w-80 h-80 bg-[#FF6B52]/5 blur-3xl rounded-full" }), _jsx("div", { className: "fixed -top-20 -left-20 w-80 h-80 bg-[#FF6B52]/3 blur-3xl rounded-full" })] }) }));
}
