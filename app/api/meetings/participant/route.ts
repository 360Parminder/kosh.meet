import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ParticipantRole } from '@360parminder/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { roomCode, identity, name, role } = body;

    if (!roomCode || !identity) {
      return NextResponse.json(
        { error: 'Missing required fields "roomCode" or "identity"' },
        { status: 400 }
      );
    }

    // Find meeting or create instant meeting record if not exists
    let meeting = await prisma.meeting.findUnique({
      where: { roomCode },
    });

    if (!meeting) {
      const today = new Date().toISOString().split('T')[0];
      meeting = await prisma.meeting.create({
        data: {
          title: `Call (${roomCode})`,
          roomCode,
          dateKey: today,
          startTime: '00:00',
          endTime: '23:59',
          startsAt: new Date(),
          endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
          type: 'INSTANT',
          status: 'ACTIVE',
        },
      });
    }

    const participant = await prisma.meetingParticipant.create({
      data: {
        meetingId: meeting.id,
        identity,
        name: name || identity,
        role: role === 'HOST' ? ParticipantRole.HOST : ParticipantRole.ATTENDEE,
        joinedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      participantId: participant.id,
      meetingId: meeting.id,
    });
  } catch (error) {
    console.error('Error logging participant join in Prisma:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { participantId, durationSeconds } = body;

    if (!participantId) {
      return NextResponse.json({ error: 'Missing "participantId"' }, { status: 400 });
    }

    const updated = await prisma.meetingParticipant.update({
      where: { id: participantId },
      data: {
        leftAt: new Date(),
        ...(durationSeconds !== undefined && { durationSeconds }),
      },
    });

    return NextResponse.json({
      success: true,
      participant: updated,
    });
  } catch (error) {
    console.error('Error logging participant leave in Prisma:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 }
    );
  }
}
