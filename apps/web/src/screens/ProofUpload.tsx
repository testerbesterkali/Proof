import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Video, StopCircle, RefreshCcw, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Layout } from '../components/Layout';

export function ProofUpload() {
    const [recording, setRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(90);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

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

            (window as any)._proofUploadTimer = timer;

        } catch (err) {
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
            clearInterval((window as any)._proofUploadTimer);
        }
    };

    return (
        <ErrorBoundary>
            <Layout>
                <div className="flex-1 flex flex-col relative min-h-screen">
                    <header className="flex items-center justify-between mb-12">
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase">Record Proof</h1>
                            <p className="text-[#1C1C1E]/40 text-sm font-bold">Demonstrate your skills in a 90-second video elevator pitch.</p>
                        </div>

                        <div className="bg-white/50 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-4 shadow-glass border border-white/20">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-proof-bg overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-[10px] font-black text-[#1C1C1E]/60 uppercase tracking-widest">Recently Uploaded</span>
                        </div>
                    </header>

                    <div className="flex-1 flex flex-col items-center justify-center pb-20">
                        {/* RECORDING CONTAINER */}
                        <motion.div
                            layout
                            className="w-full max-w-4xl bg-white/40 backdrop-blur-xl border border-white rounded-[2.5rem] p-4 shadow-glass-soft relative overflow-hidden"
                        >
                            <div className="aspect-video bg-black rounded-[1.8rem] overflow-hidden relative shadow-inner">
                                {previewUrl && !recording ? (
                                    <video src={previewUrl} controls className="w-full h-full object-cover" />
                                ) : (
                                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover opacity-90" />
                                )}

                                {/* OVERLAYS */}
                                <AnimatePresence>
                                    {recording && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 pointer-events-none"
                                        >
                                            <div className="absolute top-8 left-8 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur rounded-full text-white text-xs font-mono">
                                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                REC 0:{timeLeft.toString().padStart(2, '0')}
                                            </div>

                                            <div className="absolute top-8 right-8 text-white/50 text-[10px] font-bold uppercase tracking-[0.2em]">
                                                1080p 60fps
                                            </div>

                                            {/* GUIDELINE FRAME */}
                                            <div className="absolute inset-12 border border-white/10 rounded-2xl pointer-events-none flex items-center justify-center">
                                                <div className="w-px h-12 bg-white/5 absolute top-0" />
                                                <div className="w-px h-12 bg-white/5 absolute bottom-0" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {!recording && !previewUrl && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                                        <div className="text-white text-center">
                                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur mb-4 mx-auto flex items-center justify-center border border-white/20">
                                                <Video className="text-white/60" size={32} />
                                            </div>
                                            <p className="text-sm font-black uppercase tracking-widest">Camera preview will appear here</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CONTROLS BAR */}
                            <div className="mt-4 flex items-center justify-between px-4 py-2">
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-[#1C1C1E]/30 uppercase tracking-widest">Mic Status</span>
                                        <div className="flex gap-1 mt-1">
                                            {[1, 2, 3, 4, 5, 6].map(i => (
                                                <div key={i} className={`w-1 h-3 rounded-full ${recording ? 'bg-proof-accent animate-bounce' : 'bg-[#1C1C1E]/10'}`} style={{ animationDelay: `${i * 0.1}s` }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {!recording && previewUrl && (
                                        <button
                                            onClick={() => { setPreviewUrl(null); startRecording(); }}
                                            className="w-12 h-12 rounded-full border border-[#1C1C1E]/10 flex items-center justify-center text-[#1C1C1E]/40 hover:text-[#1C1C1E] hover:bg-white transition-all shadow-sm"
                                        >
                                            <RefreshCcw size={20} />
                                        </button>
                                    )}

                                    {!recording ? (
                                        <button
                                            onClick={startRecording}
                                            className="group flex items-center justify-center bg-proof-accent text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                                        >
                                            <div className="bg-white/20 p-4 rounded-full">
                                                <Video size={28} />
                                            </div>
                                            <span className="px-6 font-black text-lg tracking-tighter uppercase">Start Recording</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={stopRecording}
                                            className="group flex items-center justify-center bg-[#1C1C1E] text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                                        >
                                            <div className="bg-white/10 p-4 rounded-full">
                                                <StopCircle size={28} />
                                            </div>
                                            <span className="px-6 font-black text-lg tracking-tighter uppercase">Stop Recording</span>
                                        </button>
                                    )}
                                </div>

                                <div className="w-32 flex justify-end">
                                    {previewUrl && !recording && (
                                        <button className="flex items-center gap-2 bg-[#1C1C1E] text-white px-6 py-3 rounded-full font-black shadow-lg hover:opacity-90 transition-opacity uppercase text-sm tracking-tighter">
                                            Confirm <ArrowRight size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* TIPS SECTION */}
                        <div className="mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: "Eye Contact", desc: "Look directly at the lens to build trust." },
                                { title: "Clarity", desc: "Keep it under 90s. Focus on impact." },
                                { title: "Lighting", desc: "Ensure your face is well lit from front." }
                            ].map((tip, i) => (
                                <div key={i} className="bg-white/40 p-6 rounded-3xl border border-white/60 shadow-glass-soft">
                                    <h4 className="font-black text-[10px] uppercase tracking-widest text-proof-accent mb-2">{tip.title}</h4>
                                    <p className="text-sm text-[#1C1C1E]/60 font-bold">{tip.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
        </ErrorBoundary>
    );
}
