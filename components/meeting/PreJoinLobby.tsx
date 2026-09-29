"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Radio,
  ArrowRight,
  ShieldCheck,
  Zap,
  ArrowLeft,
} from 'lucide-react';

interface PreJoinLobbyProps {
  roomId: string;
  onJoin: (username: string, audioEnabled: boolean, videoEnabled: boolean) => void;
}

export default function PreJoinLobby({ roomId, onJoin }: PreJoinLobbyProps) {
  const [username, setUsername] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize saved username if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kosh_meet_username');
      if (saved) {
        setUsername(saved);
      } else {
        const randomName = `User_${Math.floor(1000 + Math.random() * 9000)}`;
        setUsername(randomName);
      }
    }
  }, []);

  // Request camera and microphone stream for preview
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function initMedia() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        currentStream = mediaStream;
        setStream(mediaStream);
        setHasPermissions(true);
        setPermissionError(null);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        // Set up Web Audio API meter
        try {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;

          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          analyserRef.current = analyser;

          const source = audioCtx.createMediaStreamSource(mediaStream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateAudioLevel = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((average / 128) * 100)));
            animFrameRef.current = requestAnimationFrame(updateAudioLevel);
          };
          updateAudioLevel();
        } catch (e) {
          console.warn('Audio metering unavailable:', e);
        }
      } catch (err) {
        console.warn('Media devices error:', err);
        setHasPermissions(false);
        setPermissionError('Camera or microphone access was denied or not found.');
      }
    }

    initMedia();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Update track enabled state
  useEffect(() => {
    if (stream) {
      stream.getVideoTracks().forEach((t) => (t.enabled = videoEnabled));
    }
  }, [videoEnabled, stream]);

  useEffect(() => {
    if (stream) {
      stream.getAudioTracks().forEach((t) => (t.enabled = audioEnabled));
    }
  }, [audioEnabled, stream]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = username.trim() || `User_${Math.floor(1000 + Math.random() * 9000)}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem('kosh_meet_username', finalName);
    }
    // Stop local preview tracks so LiveKit can acquire them cleanly
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    onJoin(finalName, audioEnabled, videoEnabled);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center px-4 py-8 relative z-20">
      {/* Top Header */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm px-3 py-1.5 rounded-lg bg-black/30 hover:bg-black/50 border border-white/10 backdrop-blur-md no-underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* SFU Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
          <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span>SFU Architecture Ready</span>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
        {/* Left: Video Preview Card */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-video bg-neutral-900/90 rounded-2xl overflow-hidden border border-white/15 shadow-2xl flex items-center justify-center">
            {videoEnabled && hasPermissions !== false ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-white/60">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-white/80 font-bold text-2xl border border-white/10">
                  {username ? username.slice(0, 2).toUpperCase() : 'ME'}
                </div>
                <p className="text-sm">Camera is switched off</p>
              </div>
            )}

            {/* Audio Wave Meter Bar */}
            {audioEnabled && hasPermissions !== false && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <div className="w-12 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-75 ease-out rounded-full"
                    style={{ width: `${Math.min(100, audioLevel * 1.5)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Floating Device Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/15 shadow-lg">
              <button
                type="button"
                onClick={() => setAudioEnabled((prev) => !prev)}
                className={`p-3 rounded-full transition-all ${
                  audioEnabled
                    ? 'bg-white/15 hover:bg-white/25 text-white'
                    : 'bg-red-500/80 hover:bg-red-500 text-white'
                }`}
                title={audioEnabled ? 'Mute microphone' : 'Unmute microphone'}
              >
                {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={() => setVideoEnabled((prev) => !prev)}
                className={`p-3 rounded-full transition-all ${
                  videoEnabled
                    ? 'bg-white/15 hover:bg-white/25 text-white'
                    : 'bg-red-500/80 hover:bg-red-500 text-white'
                }`}
                title={videoEnabled ? 'Turn camera off' : 'Turn camera on'}
              >
                {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {permissionError && (
            <p className="mt-3 text-xs text-amber-300/90 text-center bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
              {permissionError} You can still join using audio or text mode.
            </p>
          )}
        </div>

        {/* Right: Meeting Join Form & SFU Architecture Overview */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/15 shadow-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Ready to connect?
            </h1>
            <p className="text-white/70 text-sm mb-6">
              Room: <span className="font-mono text-white font-semibold bg-white/10 px-2 py-0.5 rounded">{roomId}</span>
            </p>

            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label htmlFor="name-input" className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
                  Your Display Name
                </label>
                <input
                  id="name-input"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-base"
              >
                <span>Join Meeting</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* SFU Feature Highlights */}
            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-white/80">
                <Zap className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Selective Forwarding Unit (SFU):</strong> Client sends 1 stream; SFU routes to all participants efficiently without peer-to-peer mesh bottleneck.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-white/80">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Secure & Low Latency:</strong> DTLS-SRTP media encryption with sub-100ms global delivery.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="w-full text-center text-xs text-white/50 pt-4">
        Kosh Meet • Powered by LiveKit WebRTC SFU Infrastructure
      </div>
    </div>
  );
}
