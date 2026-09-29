"use client";

import React, { use, useState } from 'react';
import { LiveKitRoom } from '@livekit/components-react';
import '@livekit/components-styles';
import PreJoinLobby from '@/components/meeting/PreJoinLobby';
import MeetingRoom from '@/components/meeting/MeetingRoom';
import { Radio, AlertCircle } from 'lucide-react';

interface RoomPageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default function RoomPage({ params }: RoomPageProps) {
  const { roomId } = use(params);

  const [joined, setJoined] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [loadingToken, setLoadingToken] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [userChoices, setUserChoices] = useState({
    username: '',
    audio: true,
    video: true,
  });

  const handleJoin = async (name: string, audio: boolean, video: boolean) => {
    setUserChoices({ username: name, audio, video });
    setLoadingToken(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/token?room=${encodeURIComponent(roomId)}&username=${encodeURIComponent(name)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to acquire SFU room token');
      }

      setToken(data.token);
      setServerUrl(data.serverUrl);
      setIsConfigured(data.isConfigured);
      setJoined(true);
    } catch (err) {
      console.error('SFU connection error:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to join room');
    } finally {
      setLoadingToken(false);
    }
  };

  if (!joined) {
    return (
      <div className="min-h-screen bg-[#0d0908]">
        {loadingToken && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-lg">
            <Radio className="w-10 h-10 text-orange-400 animate-pulse mb-3" />
            <p className="text-white font-medium text-sm">Connecting to LiveKit SFU...</p>
            <p className="text-white/50 text-xs mt-1">Acquiring cryptographic media token</p>
          </div>
        )}

        {errorMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-2.5 rounded-xl backdrop-blur-md flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="ml-2 text-white/60 hover:text-white font-bold"
            >
              ×
            </button>
          </div>
        )}

        <PreJoinLobby roomId={roomId} onJoin={handleJoin} />
      </div>
    );
  }

  if (!token || !serverUrl) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#0d0908] text-white p-6">
        <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
        <h2 className="text-lg font-bold">Failed to connect to SFU</h2>
        <p className="text-white/60 text-xs max-w-md text-center mt-1 mb-4">
          Unable to generate a valid room token for this SFU session.
        </p>
        <button
          onClick={() => setJoined(false)}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
        >
          Return to Lobby
        </button>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={userChoices.video}
      audio={userChoices.audio}
      token={token}
      serverUrl={serverUrl}
      connect={true}
      data-lk-theme="default"
      onDisconnected={() => setJoined(false)}
    >
      <MeetingRoom
        roomId={roomId}
        serverUrl={serverUrl}
        isConfigured={isConfigured}
      />
    </LiveKitRoom>
  );
}
