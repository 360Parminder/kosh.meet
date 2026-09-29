import { NextRequest, NextResponse } from 'next/server';
import { createParticipantToken } from '@/lib/livekit';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const room = searchParams.get('room');
    const username = searchParams.get('username') || `User_${Math.random().toString(36).substring(2, 6)}`;

    if (!room) {
      return NextResponse.json({ error: 'Missing "room" query parameter' }, { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const serverUrl = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL || 'ws://127.0.0.1:7880';

    const isConfigured = Boolean(apiKey && apiSecret && apiKey !== 'devkey');

    // Generate SFU access token
    const token = await createParticipantToken(room, username, username);

    // Auto-record or update meeting in Prisma DB if available
    try {
      const existing = await prisma.meeting.findUnique({ where: { roomCode: room } });
      if (!existing) {
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const startStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        await prisma.meeting.create({
          data: {
            title: `Instant Call (${room})`,
            roomCode: room,
            dateKey: today,
            startTime: startStr,
            endTime: '23:59',
            startsAt: now,
            endsAt: new Date(now.getTime() + 2 * 60 * 60 * 1000),
            type: 'INSTANT',
            status: 'ACTIVE',
          },
        });
      } else if (existing.status === 'SCHEDULED') {
        await prisma.meeting.update({
          where: { id: existing.id },
          data: { status: 'ACTIVE' },
        });
      }
    } catch (dbErr) {
      // Non-fatal if DB is not yet connected
      console.warn('Prisma meeting auto-registration deferred:', dbErr);
    }

    return NextResponse.json({
      token,
      serverUrl,
      room,
      identity: username,
      isConfigured,
    });
  } catch (error) {
    console.error('Failed to generate LiveKit SFU token:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const room = body.room;
    const username = body.username || `User_${Math.random().toString(36).substring(2, 6)}`;

    if (!room) {
      return NextResponse.json({ error: 'Missing "room" field in request body' }, { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const serverUrl = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL || 'ws://127.0.0.1:7880';

    const isConfigured = Boolean(apiKey && apiSecret && apiKey !== 'devkey');

    const token = await createParticipantToken(room, username, username);

    return NextResponse.json({
      token,
      serverUrl,
      room,
      identity: username,
      isConfigured,
    });
  } catch (error) {
    console.error('Failed to generate LiveKit SFU token:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
