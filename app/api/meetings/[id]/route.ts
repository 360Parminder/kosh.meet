import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const meeting = await prisma.meeting.findFirst({
      where: {
        OR: [{ id }, { roomCode: id }],
      },
      include: {
        participants: {
          orderBy: { joinedAt: 'desc' },
        },
        recordings: true,
      },
    });

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      meeting,
    });
  } catch (error) {
    console.error('Error retrieving meeting from Prisma:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const meeting = await prisma.meeting.findFirst({
      where: {
        OR: [{ id }, { roomCode: id }],
      },
    });

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    await prisma.meeting.delete({
      where: { id: meeting.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Meeting deleted successfully',
      id: meeting.id,
    });
  } catch (error) {
    console.error('Error deleting meeting from Prisma:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    const meeting = await prisma.meeting.findFirst({
      where: {
        OR: [{ id }, { roomCode: id }],
      },
    });

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    const updated = await prisma.meeting.update({
      where: { id: meeting.id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.status && { status: body.status }),
        ...(body.isLocked !== undefined && { isLocked: body.isLocked }),
        ...(body.startTime && { startTime: body.startTime }),
        ...(body.endTime && { endTime: body.endTime }),
      },
    });

    return NextResponse.json({
      success: true,
      meeting: updated,
    });
  } catch (error) {
    console.error('Error updating meeting in Prisma:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 }
    );
  }
}
