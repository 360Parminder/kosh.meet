import { NextRequest, NextResponse } from 'next/server';

import { generateRoomId } from '@/lib/livekit';
import { MeetingType, MeetingStatus, PrismaClient } from '@360parminder/db';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateKey = searchParams.get('dateKey');
    const type = searchParams.get('type') as MeetingType | null;
    const status = searchParams.get('status') as MeetingStatus | null;

    const whereClause: Record<string, unknown> = {};

    if (dateKey) {
      whereClause.dateKey = dateKey;
    }
    if (type) {
      whereClause.type = type;
    }
    if (status) {
      whereClause.status = status;
    }

    const meetings = await prisma.meeting.findMany({
      where: whereClause,
      orderBy: {
        startsAt: 'asc',
      },
      include: {
        _count: {
          select: { participants: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      count: meetings.length,
      meetings,
    });
  } catch (error) {
    console.error('Error fetching meetings from Prisma:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Database query error',
        meetings: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const title = body.title?.trim() || 'Team Meeting';
    const roomCode = body.roomCode?.trim() || generateRoomId();
    const dateKey = body.dateKey || new Date().toISOString().split('T')[0];
    const startTime = body.startTime || '10:00';
    const endTime = body.endTime || '10:30';
    const description = body.description || null;
    const hostName = body.hostName || 'Host';
    const hostEmail = body.hostEmail || null;

    let type: MeetingType = MeetingType.SCHEDULED;
    if (body.type === 'INSTANT') type = MeetingType.INSTANT;
    else if (body.type === 'LATER') type = MeetingType.LATER;

    // Parse startsAt and endsAt dates
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startsAt = new Date(`${dateKey}T${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}:00Z`);
    const endsAt = new Date(`${dateKey}T${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}:00Z`);

    const meeting = await prisma.meeting.create({
      data: {
        title,
        roomCode,
        dateKey,
        startTime,
        endTime,
        startsAt,
        endsAt,
        type,
        status: type === MeetingType.INSTANT ? MeetingStatus.ACTIVE : MeetingStatus.SCHEDULED,
        hostName,
        hostEmail,
        description,
      },
    });

    return NextResponse.json(
      {
        success: true,
        meeting,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating meeting in Prisma:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create meeting in database',
      },
      { status: 500 }
    );
  }
}
