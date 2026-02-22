import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mic, Monitor, Shield, ChevronDown, CheckCircle, AlertCircle, X, ArrowRight, Eye, Volume2 } from 'lucide-react';

interface ProctoringModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: () => void;
    challengeTitle: string;
}

export function ProctoringModal({ isOpen, onClose, onStart, challengeTitle }: ProctoringModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    // Permissions
    const [cameraGranted, setCameraGranted] = useState(false);
    const [micGranted, setMicGranted] = useState(false);
    const [permissionError, setPermissionError] = useState('');

    // Devices
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [mics, setMics] = useState<MediaDeviceInfo[]>([]);
    const [selectedCamera, setSelectedCamera] = useState('');
    const [selectedMic, setSelectedMic] = useState('');
    const [showCameraDropdown, setShowCameraDropdown] = useState(false);
    const [showMicDropdown, setShowMicDropdown] = useState(false);

    // Mic level
    const [micLevel, setMicLevel] = useState(0);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number>(0);

    // Agreed to terms
    const [agreed, setAgreed] = useState(false);

    const canStart = cameraGranted && micGranted && agreed;

    const startMedia = useCallback(async (cameraId?: string, micId?: string) => {
        try {
            // Stop existing stream
            if (stream) {
                stream.getTracks().forEach(t => t.stop());
            }

            const constraints: MediaStreamConstraints = {
                video: cameraId ? { deviceId: { exact: cameraId } } : true,
                audio: micId ? { deviceId: { exact: micId } } : true,
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);
            setCameraGranted(true);
            setMicGranted(true);
            setPermissionError('');

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }

            // Enumerate devices
            const devices = await navigator.mediaDevices.enumerateDevices();
            setCameras(devices.filter(d => d.kind === 'videoinput'));
            setMics(devices.filter(d => d.kind === 'audioinput'));

            // Set selected
            const videoTrack = mediaStream.getVideoTracks()[0];
            const audioTrack = mediaStream.getAudioTracks()[0];
            if (videoTrack) setSelectedCamera(videoTrack.getSettings().deviceId || '');
            if (audioTrack) setSelectedMic(audioTrack.getSettings().deviceId || '');

            // Mic level analyser
            const audioCtx = new AudioContext();
            const source = audioCtx.createMediaStreamSource(mediaStream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            analyserRef.current = analyser;

        } catch (err: any) {
            if (err.name === 'NotAllowedError') {
                setPermissionError('Camera and microphone access was denied. Please allow access in your browser settings.');
            } else {
                setPermissionError('Unable to access camera or microphone. Please check your device settings.');
            }
        }
    }, []);

    // Animate mic level
    useEffect(() => {
        const updateLevel = () => {
            if (analyserRef.current) {
                const data = new Uint8Array(analyserRef.current.frequencyBinCount);
                analyserRef.current.getByteFrequencyData(data);
                const avg = data.reduce((a, b) => a + b, 0) / data.length;
                setMicLevel(avg / 255);
            }
            animationRef.current = requestAnimationFrame(updateLevel);
        };
        if (micGranted) {
            updateLevel();
        }
        return () => cancelAnimationFrame(animationRef.current);
    }, [micGranted]);

    // Cleanup on close
    useEffect(() => {
        if (!isOpen && stream) {
            stream.getTracks().forEach(t => t.stop());
            setStream(null);
            setCameraGranted(false);
            setMicGranted(false);
            setAgreed(false);
            setPermissionError('');
        }
    }, [isOpen]);

    const switchCamera = async (deviceId: string) => {
        setSelectedCamera(deviceId);
        setShowCameraDropdown(false);
        await startMedia(deviceId, selectedMic);
    };

    const switchMic = async (deviceId: string) => {
        setSelectedMic(deviceId);
        setShowMicDropdown(false);
        await startMedia(selectedCamera, deviceId);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-[61] flex items-center justify-center p-4"
                    >
                        <div className="bg-[#F8F9FB] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-8">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1C1C1E] to-[#3a3a3c] flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold tracking-tight">Proctoring Setup</h2>
                                            <p className="text-xs text-[#1C1C1E]/40 font-medium">{challengeTitle}</p>
                                        </div>
                                    </div>
                                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors">
                                        <X size={16} className="text-[#1C1C1E]/40" />
                                    </button>
                                </div>

                                {/* Anti-cheat explainer */}
                                <div className="bg-gradient-to-r from-[#1C1C1E] to-[#2C2C2E] rounded-2xl p-5 mb-6 text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Eye className="w-4 h-4 text-proof-accent" />
                                        <p className="text-sm font-bold">AI-Powered Integrity Check</p>
                                    </div>
                                    <p className="text-xs text-white/50 leading-relaxed mb-3">
                                        To ensure a fair assessment, our AI proctoring system requires access to your camera and microphone.
                                        The system monitors for screen-sharing, tab-switching, unauthorized assistance, and identity verification.
                                    </p>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-white/10 rounded-xl p-2.5 text-center">
                                            <Camera className="w-4 h-4 mx-auto mb-1 text-proof-accent" />
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-white/60">Face Tracking</p>
                                        </div>
                                        <div className="bg-white/10 rounded-xl p-2.5 text-center">
                                            <Mic className="w-4 h-4 mx-auto mb-1 text-proof-accent" />
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-white/60">Audio Monitor</p>
                                        </div>
                                        <div className="bg-white/10 rounded-xl p-2.5 text-center">
                                            <Monitor className="w-4 h-4 mx-auto mb-1 text-proof-accent" />
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-white/60">Tab Detection</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Camera Preview + Controls */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {/* Camera feed */}
                                    <div className="relative">
                                        <div className="aspect-video bg-[#1C1C1E] rounded-2xl overflow-hidden relative">
                                            {cameraGranted ? (
                                                <>
                                                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                                                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-green-500/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                        <span className="text-[9px] font-bold text-green-400 uppercase">Live</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-white/30">
                                                    <Camera className="w-10 h-10 mb-2" />
                                                    <p className="text-xs font-medium">Camera preview</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Controls */}
                                    <div className="flex flex-col gap-3">
                                        {/* Permission button */}
                                        {!cameraGranted && (
                                            <button
                                                onClick={() => startMedia()}
                                                className="bg-[#1C1C1E] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#1C1C1E]/80 transition-colors"
                                            >
                                                <Camera size={16} /> Enable Camera & Mic
                                            </button>
                                        )}

                                        {permissionError && (
                                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                                <p className="text-xs text-red-600 font-medium">{permissionError}</p>
                                            </div>
                                        )}

                                        {cameraGranted && (
                                            <>
                                                {/* Camera selector */}
                                                <div className="relative">
                                                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#1C1C1E]/25 mb-1.5">Camera</p>
                                                    <button
                                                        onClick={() => { setShowCameraDropdown(!showCameraDropdown); setShowMicDropdown(false); }}
                                                        className="w-full bg-white/60 border border-black/5 rounded-xl px-3.5 py-2.5 text-xs font-medium text-left flex items-center justify-between hover:bg-white transition-colors"
                                                    >
                                                        <span className="flex items-center gap-2 truncate">
                                                            <CheckCircle size={12} className="text-green-500 shrink-0" />
                                                            {cameras.find(c => c.deviceId === selectedCamera)?.label || 'Default Camera'}
                                                        </span>
                                                        <ChevronDown size={14} className="text-[#1C1C1E]/30 shrink-0" />
                                                    </button>
                                                    {showCameraDropdown && cameras.length > 0 && (
                                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-black/5 shadow-lg z-10 overflow-hidden">
                                                            {cameras.map(cam => (
                                                                <button
                                                                    key={cam.deviceId}
                                                                    onClick={() => switchCamera(cam.deviceId)}
                                                                    className={`w-full text-left px-3.5 py-2.5 text-xs font-medium transition-colors ${selectedCamera === cam.deviceId ? 'bg-[#F8F9FB] text-[#1C1C1E]' : 'text-[#1C1C1E]/60 hover:bg-[#F8F9FB]'}`}
                                                                >
                                                                    {cam.label || `Camera ${cameras.indexOf(cam) + 1}`}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Mic selector */}
                                                <div className="relative">
                                                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#1C1C1E]/25 mb-1.5">Microphone</p>
                                                    <button
                                                        onClick={() => { setShowMicDropdown(!showMicDropdown); setShowCameraDropdown(false); }}
                                                        className="w-full bg-white/60 border border-black/5 rounded-xl px-3.5 py-2.5 text-xs font-medium text-left flex items-center justify-between hover:bg-white transition-colors"
                                                    >
                                                        <span className="flex items-center gap-2 truncate">
                                                            <CheckCircle size={12} className="text-green-500 shrink-0" />
                                                            {mics.find(m => m.deviceId === selectedMic)?.label || 'Default Microphone'}
                                                        </span>
                                                        <ChevronDown size={14} className="text-[#1C1C1E]/30 shrink-0" />
                                                    </button>
                                                    {showMicDropdown && mics.length > 0 && (
                                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-black/5 shadow-lg z-10 overflow-hidden">
                                                            {mics.map(mic => (
                                                                <button
                                                                    key={mic.deviceId}
                                                                    onClick={() => switchMic(mic.deviceId)}
                                                                    className={`w-full text-left px-3.5 py-2.5 text-xs font-medium transition-colors ${selectedMic === mic.deviceId ? 'bg-[#F8F9FB] text-[#1C1C1E]' : 'text-[#1C1C1E]/60 hover:bg-[#F8F9FB]'}`}
                                                                >
                                                                    {mic.label || `Microphone ${mics.indexOf(mic) + 1}`}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Mic Level */}
                                                <div>
                                                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#1C1C1E]/25 mb-1.5">Mic Level</p>
                                                    <div className="flex items-center gap-2">
                                                        <Volume2 size={14} className="text-[#1C1C1E]/30 shrink-0" />
                                                        <div className="flex-1 h-2 bg-[#F8F9FB] border border-black/5 rounded-full overflow-hidden">
                                                            <motion.div
                                                                className="h-full bg-green-500 rounded-full"
                                                                animate={{ width: `${Math.max(micLevel * 100, 2)}%` }}
                                                                transition={{ duration: 0.1 }}
                                                            />
                                                        </div>
                                                        <span className="text-[9px] text-[#1C1C1E]/30 font-bold w-8 text-right">{Math.round(micLevel * 100)}%</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Status checklist */}
                                <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-2xl p-5 shadow-glass mb-6">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#1C1C1E]/25 mb-3">Pre-Flight Checklist</p>
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-3">
                                            {cameraGranted
                                                ? <CheckCircle size={16} className="text-green-500" />
                                                : <div className="w-4 h-4 rounded-full border-2 border-[#1C1C1E]/15" />
                                            }
                                            <span className={`text-sm font-medium ${cameraGranted ? 'text-[#1C1C1E]' : 'text-[#1C1C1E]/40'}`}>Camera access granted</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {micGranted
                                                ? <CheckCircle size={16} className="text-green-500" />
                                                : <div className="w-4 h-4 rounded-full border-2 border-[#1C1C1E]/15" />
                                            }
                                            <span className={`text-sm font-medium ${micGranted ? 'text-[#1C1C1E]' : 'text-[#1C1C1E]/40'}`}>Microphone access granted</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {agreed
                                                ? <CheckCircle size={16} className="text-green-500" />
                                                : <div className="w-4 h-4 rounded-full border-2 border-[#1C1C1E]/15" />
                                            }
                                            <span className={`text-sm font-medium ${agreed ? 'text-[#1C1C1E]' : 'text-[#1C1C1E]/40'}`}>Agreed to proctoring terms</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Terms checkbox */}
                                <label className="flex items-start gap-3 mb-6 cursor-pointer group">
                                    <div
                                        className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${agreed ? 'bg-[#1C1C1E] border-[#1C1C1E]' : 'border-[#1C1C1E]/20 group-hover:border-[#1C1C1E]/40'}`}
                                        onClick={() => setAgreed(!agreed)}
                                    >
                                        {agreed && <CheckCircle size={12} className="text-white" />}
                                    </div>
                                    <p className="text-xs text-[#1C1C1E]/50 leading-relaxed font-medium" onClick={() => setAgreed(!agreed)}>
                                        I understand that my camera and microphone will be active during the challenge for anti-cheat monitoring.
                                        My session will be analyzed by AI for integrity verification. No recordings are stored after analysis.
                                    </p>
                                </label>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-3.5 rounded-xl text-sm font-bold text-[#1C1C1E]/40 hover:text-[#1C1C1E] hover:bg-black/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (stream) stream.getTracks().forEach(t => t.stop());
                                            onStart();
                                        }}
                                        disabled={!canStart}
                                        className={`flex-1 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${canStart
                                            ? 'bg-[#1C1C1E] text-white hover:bg-[#1C1C1E]/80 shadow-lg'
                                            : 'bg-[#1C1C1E]/10 text-[#1C1C1E]/30 cursor-not-allowed'
                                            }`}
                                    >
                                        <Shield size={16} /> Start Proctored Challenge <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
