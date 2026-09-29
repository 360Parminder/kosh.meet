import { AccessToken } from 'livekit-server-sdk';

export interface TokenResponse {
  token: string;
  serverUrl: string;
  room: string;
  identity: string;
}

export function generateRoomId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const segment = (len: number) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${segment(3)}-${segment(4)}-${segment(3)}`;
}

export async function createParticipantToken(
  room: string,
  identity: string,
  name?: string
): Promise<string> {
  const apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
  const apiSecret = process.env.LIVEKIT_API_SECRET || 'secret';

  const at = new AccessToken(apiKey, apiSecret, {
    identity,
    name: name || identity,
    ttl: '4h',
  });

  at.addGrant({
    roomJoin: true,
    room,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return await at.toJwt();
}

export const SFU_ARCHITECTURE_DETAILS = {
  name: 'Selective Forwarding Unit (SFU)',
  description:
    'In SFU architecture, each client uploads their media streams (audio, video, screen share) exactly once to the central LiveKit SFU server. The SFU dynamically forwards each stream to all subscribed participants without re-encoding, minimizing client bandwidth and CPU usage.',
  benefits: [
    'O(1) Upload bandwidth per participant (scales to 50+ participants)',
    'Simulcast support (multi-bitrate layers for unstable network connections)',
    'Zero transcoding server delay (ultra-low latency <100ms)',
    'Selective stream delivery based on viewport visibility and active speakers',
  ],
};
