"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Track,
  ConnectionState,
} from 'livekit-client';
import {
  useTracks,
  useLocalParticipant,
  useRemoteParticipants,
  useRoomContext,
  useConnectionState,
  useChat,
  VideoTrack,
  RoomAudioRenderer,
} from '@livekit/components-react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PhoneOff,
  Users,
  MessageSquare,
  Copy,
  Check,
  Server,
  X,
  Send,
  Signal,
  Radio,
  ExternalLink,
} from 'lucide-react';
import SfuInfoModal from './SfuInfoModal';

interface MeetingRoomProps {
  roomId: string;
  serverUrl?: string;
  isConfigured?: boolean;
}

export default function MeetingRoom({ roomId, serverUrl, isConfigured }: MeetingRoomProps) {
  const router = useRouter();
  const room = useRoomContext();
  const connectionState = useConnectionState();
  const { localParticipant, isMicrophoneEnabled, isCameraEnabled, isScreenShareEnabled } =
    useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const trackRefs = useTracks([Track.Source.Camera, Track.Source.ScreenShare]);

  // Chat hooks
  const { chatMessages, send, isSending } = useChat();
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isSfuModalOpen, setIsSfuModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // Meeting duration timer
  const [duration, setDuration] = useState(0);
  const participantIdRef = useRef<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Register participant in Prisma database
  useEffect(() => {
    if (localParticipant?.identity) {
      fetch('/api/meetings/participant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: roomId,
          identity: localParticipant.identity,
          name: localParticipant.name || localParticipant.identity,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.participantId) {
            participantIdRef.current = data.participantId;
          }
        })
        .catch((err) => console.warn('Prisma participant logging deferred:', err));
    }
  }, [localParticipant?.identity, roomId]);

  // Format seconds to mm:ss or hh:mm:ss
  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Track unread messages when chat drawer is closed
  useEffect(() => {
    if (!isChatOpen && chatMessages.length > 0) {
      setUnreadChatCount((prev) => prev + 1);
    }
  }, [chatMessages.length, isChatOpen]);

  useEffect(() => {
    if (isChatOpen) {
      setUnreadChatCount(0);
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isChatOpen, chatMessages]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isSending) return;
    try {
      await send(chatInput.trim());
      setChatInput('');
    } catch (err) {
      console.error('Failed to send chat message via SFU data channel:', err);
    }
  };

  const handleLeave = () => {
    if (participantIdRef.current) {
      fetch('/api/meetings/participant', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: participantIdRef.current,
          durationSeconds: duration,
        }),
      }).catch(() => {});
    }
    try {
      room.disconnect();
    } catch (e) {
      console.warn('Disconnect error:', e);
    }
    router.push('/dashboard');
  };

  const allParticipantsCount = 1 + remoteParticipants.length;

  // Find if there is any active screen share
  const screenShareTrack = trackRefs.find((t) => t.source === Track.Source.ScreenShare);
  const cameraTracks = trackRefs.filter((t) => t.source === Track.Source.Camera);

  return (
    <div className="relative w-screen h-screen bg-[#0d0908] text-white flex flex-col overflow-hidden select-none">
      {/* Automatic Audio Playback for SFU Remote Tracks */}
      <RoomAudioRenderer />

      {/* SFU Architecture Modal */}
      <SfuInfoModal
        isOpen={isSfuModalOpen}
        onClose={() => setIsSfuModalOpen(false)}
        serverUrl={serverUrl}
        roomId={roomId}
        participantCount={allParticipantsCount}
      />

      {/* LiveKit Server Connection Status Banner (if not yet connected or local server not running) */}
      {connectionState !== ConnectionState.Connected && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-amber-200 z-30">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 animate-spin text-amber-400" />
            <span>
              <strong>SFU Status:</strong>{' '}
              {connectionState === ConnectionState.Connecting
                ? 'Connecting to LiveKit SFU server...'
                : connectionState === ConnectionState.Reconnecting
                ? 'Reconnecting to SFU...'
                : 'Connecting to WebRTC SFU endpoint.'}
            </span>
          </div>
          {!isConfigured && (
            <div className="hidden sm:flex items-center gap-2 text-white/80">
              <span className="text-[11px]">Local Dev: docker run -p 7880:7880 livekit/livekit-server --dev</span>
              <a
                href="https://cloud.livekit.io"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-white flex items-center gap-1"
              >
                Cloud Keys <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Top Header Bar */}
      <header className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md z-20">
        {/* Left: Room Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-white/50 font-medium">Room:</span>
            <span className="text-xs font-mono font-semibold text-white">{roomId}</span>
            <button
              onClick={handleCopyLink}
              title="Copy invite link"
              className="p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors ml-1"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {copiedLink && (
            <span className="hidden sm:inline-block text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg animate-fade-in">
              Invite link copied!
            </span>
          )}
        </div>

        {/* Center: Timer & Live SFU Architecture Indicator */}
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs text-white/80 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
            {formatDuration(duration)}
          </div>

          <button
            onClick={() => setIsSfuModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 border border-orange-500/40 text-orange-300 text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
            title="Click to view SFU stream routing topology"
          >
            <Server className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden md:inline font-medium">SFU Active</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

        {/* Right: Participant Count */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsParticipantsOpen((prev) => !prev)}
            className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl border transition-all ${
              isParticipantsOpen
                ? 'bg-orange-500/20 border-orange-500/50 text-white'
                : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{allParticipantsCount}</span>
          </button>
        </div>
      </header>

      {/* Main Video Grid Canvas & Slide-out Panels */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Video Canvas Area */}
        <div className="flex-1 p-3 md:p-6 flex flex-col justify-center items-center overflow-auto relative">
          {screenShareTrack ? (
            /* Screen Share Spotlight Layout */
            <div className="w-full h-full flex flex-col gap-3">
              {/* Main Screen Share View */}
              <div className="flex-1 bg-neutral-900 rounded-2xl overflow-hidden border border-white/15 relative shadow-2xl flex items-center justify-center">
                <VideoTrack trackRef={screenShareTrack} className="w-full h-full object-contain" />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-medium text-white flex items-center gap-2 border border-white/10">
                  <Monitor className="w-3.5 h-3.5 text-orange-400" />
                  <span>{screenShareTrack.participant.identity}&apos;s Screen</span>
                </div>
              </div>

              {/* Horizontal Participant Camera Bar */}
              <div className="h-32 flex gap-3 overflow-x-auto py-1">
                {cameraTracks.map((ref) => {
                  const isSpeaking = ref.participant.isSpeaking;
                  const isLocal = ref.participant.isLocal;
                  return (
                    <div
                      key={ref.publication.trackSid || ref.participant.identity}
                      className={`relative w-48 shrink-0 bg-neutral-900 rounded-xl overflow-hidden border transition-all ${
                        isSpeaking ? 'border-orange-500 ring-2 ring-orange-500/50' : 'border-white/15'
                      }`}
                    >
                      {ref.publication.isMuted ? (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-white/50 text-xs">
                          {ref.participant.identity.slice(0, 2).toUpperCase()}
                        </div>
                      ) : (
                        <VideoTrack
                          trackRef={ref}
                          className={`w-full h-full object-cover ${isLocal ? '-scale-x-100' : ''}`}
                        />
                      )}
                      <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white flex items-center gap-1">
                        <span>{ref.participant.name || ref.participant.identity}</span>
                        {isLocal && <span className="text-orange-400">(You)</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Standard Adaptive Video Grid */
            <div
              className={`w-full h-full grid gap-4 max-w-7xl max-h-[80vh] items-center justify-center ${
                allParticipantsCount <= 1
                  ? 'grid-cols-1'
                  : allParticipantsCount === 2
                  ? 'grid-cols-1 md:grid-cols-2'
                  : allParticipantsCount <= 4
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-2 sm:grid-cols-3'
              }`}
            >
              {/* Local Participant Tile */}
              <div
                className={`relative w-full h-full min-h-[220px] bg-neutral-900/90 rounded-2xl overflow-hidden border transition-all flex items-center justify-center shadow-xl ${
                  localParticipant.isSpeaking
                    ? 'border-orange-500 ring-4 ring-orange-500/30'
                    : 'border-white/15'
                }`}
              >
                {isCameraEnabled ? (
                  (() => {
                    const localCamTrack = cameraTracks.find((t) => t.participant.isLocal);
                    return localCamTrack ? (
                      <VideoTrack
                        trackRef={localCamTrack}
                        className="w-full h-full object-cover -scale-x-100"
                      />
                    ) : (
                      <div className="text-xs text-white/50">Camera initializing...</div>
                    );
                  })()
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/30 to-amber-500/30 border flex items-center justify-center text-white font-bold text-2xl transition-all ${
                        localParticipant.isSpeaking
                          ? 'border-orange-400 scale-105 shadow-lg shadow-orange-500/30'
                          : 'border-white/10'
                      }`}
                    >
                      {localParticipant.identity ? localParticipant.identity.slice(0, 2).toUpperCase() : 'YOU'}
                    </div>
                    <span className="text-xs text-white/60">Camera is off</span>
                  </div>
                )}

                {/* Local Participant Info Badge */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                  <span className="text-xs font-medium text-white">
                    {localParticipant.name || localParticipant.identity || 'You'} (You)
                  </span>
                  {isMicrophoneEnabled ? (
                    <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <MicOff className="w-3.5 h-3.5 text-red-400" />
                  )}
                </div>

                {/* SFU Uplink Quality */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1 text-[10px] text-emerald-400">
                  <Signal className="w-3 h-3" />
                  <span>SFU Stream</span>
                </div>
              </div>

              {/* Remote Participants Tiles */}
              {remoteParticipants.map((p) => {
                const pCamTrack = cameraTracks.find((t) => t.participant.identity === p.identity);
                const hasVideo = pCamTrack && !pCamTrack.publication.isMuted;

                return (
                  <div
                    key={p.identity}
                    className={`relative w-full h-full min-h-[220px] bg-neutral-900/90 rounded-2xl overflow-hidden border transition-all flex items-center justify-center shadow-xl ${
                      p.isSpeaking
                        ? 'border-orange-500 ring-4 ring-orange-500/30'
                        : 'border-white/15'
                    }`}
                  >
                    {hasVideo ? (
                      <VideoTrack trackRef={pCamTrack} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className={`w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/30 border flex items-center justify-center text-white font-bold text-2xl transition-all ${
                            p.isSpeaking
                              ? 'border-orange-400 scale-105 shadow-lg shadow-orange-500/30'
                              : 'border-white/10'
                          }`}
                        >
                          {p.identity ? p.identity.slice(0, 2).toUpperCase() : 'USER'}
                        </div>
                        <span className="text-xs text-white/60">Camera is off</span>
                      </div>
                    )}

                    {/* Remote Info Badge */}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                      <span className="text-xs font-medium text-white">{p.name || p.identity}</span>
                      {p.isMicrophoneEnabled ? (
                        <Mic className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <MicOff className="w-3.5 h-3.5 text-red-400" />
                      )}
                    </div>

                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1 text-[10px] text-white/70">
                      <Signal className="w-3 h-3 text-emerald-400" />
                      <span>{p.connectionQuality || 'Good'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Side Panel: Participants Drawer */}
        {isParticipantsOpen && (
          <div className="w-80 border-l border-white/10 bg-neutral-950/95 backdrop-blur-2xl flex flex-col z-20 animate-slide-left">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-semibold text-white">Participants ({allParticipantsCount})</h3>
              </div>
              <button
                onClick={() => setIsParticipantsOpen(false)}
                className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {/* Local Participant Item */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center">
                    {localParticipant.identity.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {localParticipant.name || localParticipant.identity} (You)
                    </div>
                    <div className="text-[10px] text-white/50">Host / SFU Publisher</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-white/70">
                  {isMicrophoneEnabled ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-red-400" />}
                  {isCameraEnabled ? <Video className="w-3.5 h-3.5 text-emerald-400" /> : <VideoOff className="w-3.5 h-3.5 text-red-400" />}
                </div>
              </div>

              {/* Remote Participants */}
              {remoteParticipants.map((p) => (
                <div
                  key={p.identity}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center">
                      {p.identity.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{p.name || p.identity}</div>
                      <div className="text-[10px] text-white/50">SFU Subscriber</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/70">
                    {p.isMicrophoneEnabled ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-red-400" />}
                    {p.isCameraEnabled ? <Video className="w-3.5 h-3.5 text-emerald-400" /> : <VideoOff className="w-3.5 h-3.5 text-red-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Side Panel: In-Call Chat Drawer */}
        {isChatOpen && (
          <div className="w-80 border-l border-white/10 bg-neutral-950/95 backdrop-blur-2xl flex flex-col z-20 animate-slide-left">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-semibold text-white">In-Call Chat</h3>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.length === 0 ? (
                <div className="text-center text-xs text-white/40 mt-10">
                  No messages yet. Messages sent here travel over the SFU data channel in real-time.
                </div>
              ) : (
                chatMessages.map((msg, index) => {
                  const isMe = msg.from?.identity === localParticipant.identity;
                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[10px] text-white/50 mb-0.5 px-1">
                        {isMe ? 'You' : msg.from?.name || msg.from?.identity || 'User'}
                      </div>
                      <div
                        className={`px-3 py-2 rounded-xl text-xs max-w-[85%] break-words ${
                          isMe
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-xs'
                            : 'bg-white/10 border border-white/10 text-white rounded-bl-xs'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Box */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isSending}
                className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Floating Bottom Control Bar */}
      <footer className="h-20 border-t border-white/10 bg-black/60 backdrop-blur-2xl px-6 flex items-center justify-between z-20">
        {/* Left Side: Empty or quick status */}
        <div className="hidden md:flex items-center gap-2 text-xs text-white/50">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>SFU Connected</span>
        </div>

        {/* Center: Main Controls */}
        <div className="flex items-center gap-3 mx-auto">
          {/* Audio Mic Button */}
          <button
            onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
            className={`p-3.5 rounded-2xl transition-all ${
              isMicrophoneEnabled
                ? 'bg-white/15 hover:bg-white/25 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            title={isMicrophoneEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {isMicrophoneEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Video Cam Button */}
          <button
            onClick={() => localParticipant.setCameraEnabled(!isCameraEnabled)}
            className={`p-3.5 rounded-2xl transition-all ${
              isCameraEnabled
                ? 'bg-white/15 hover:bg-white/25 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            title={isCameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {isCameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Screen Share Button */}
          <button
            onClick={() => localParticipant.setScreenShareEnabled(!isScreenShareEnabled)}
            className={`p-3.5 rounded-2xl transition-all ${
              isScreenShareEnabled
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={isScreenShareEnabled ? 'Stop Presenting' : 'Share Screen'}
          >
            <Monitor className="w-5 h-5" />
          </button>

          {/* Chat Drawer Button */}
          <button
            onClick={() => setIsChatOpen((prev) => !prev)}
            className={`p-3.5 rounded-2xl relative transition-all ${
              isChatOpen
                ? 'bg-orange-500 text-white'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title="Toggle In-Call Chat"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadChatCount > 0 && !isChatOpen && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadChatCount}
              </span>
            )}
          </button>

          {/* Leave Call Button */}
          <button
            onClick={handleLeave}
            className="p-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2 transition-all shadow-lg shadow-red-600/30 ml-2"
            title="Leave Meeting"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Leave</span>
          </button>
        </div>

        {/* Right Side: SFU Architecture Button */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setIsSfuModalOpen(true)}
            className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <Server className="w-3.5 h-3.5 text-orange-400" />
            <span>SFU Info</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
