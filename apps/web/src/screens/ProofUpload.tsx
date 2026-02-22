import React, { useState, useRef } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';

export function ProofUpload() {
    const [recording, setRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(90);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                console.log('Video ready to upload to S3', blob);
                // Upload logic here directly via signed URL S3 integration
            };

            mediaRecorder.start(1000);
            setRecording(true);

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

            // Store timer to clear it if unmounted?
            (window as any)._proofUploadTimer = timer;

        } catch (err) {
            console.error('Error accessing media devices.', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
            setRecording(false);
            clearInterval((window as any)._proofUploadTimer);
        }
    };

    return (
        <ErrorBoundary>
            <div className="max-w-4xl mx-auto p-8 h-full">
                <header className="mb-8">
                    <h1 className="text-3xl font-heading font-bold text-cloud mb-2">Record Video Proof</h1>
                    <p className="text-cloud/60">Upload a 90-second explanation of your recent project.</p>
                </header>

                <div className="bg-[#020c1b] rounded-2xl overflow-hidden border border-[#112240] aspect-video relative">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover bg-black"
                        autoPlay
                        muted
                        playsInline
                    />

                    <div className="absolute top-6 right-6 flex items-center gap-3">
                        {recording && (
                            <div className="flex items-center gap-2 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-white font-mono">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                0:{timeLeft.toString().padStart(2, '0')}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                    {!recording ? (
                        <button
                            onClick={startRecording}
                            className="px-8 py-3 bg-electric text-navy font-bold rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-electric/20"
                        >
                            Start Recording
                        </button>
                    ) : (
                        <button
                            onClick={stopRecording}
                            className="px-8 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                        >
                            Stop Recording
                        </button>
                    )}
                </div>
            </div>
        </ErrorBoundary>
    );
}
