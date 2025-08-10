import { connectToDatabase } from '@/lib/db';
import { Board } from '@/models/Board';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const createdBoards = await Board.find({ createdBy: session.user.email }).lean();
  const joinedBoards = await Board.find({
    participants: session.user.email,
    createdBy: { $ne: session.user.email },
  }).lean();

  return NextResponse.json({ createdBoards, joinedBoards });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: 'Board name is required' }, { status: 400 });
  }

  await connectToDatabase();
  const existing = await Board.findOne({ name });
  if (existing) {
    return NextResponse.json({ error: 'Board name already exists' }, { status: 409 });
  }

  const board = await Board.create({
    name,
    createdBy: session.user.email,
    drawings: [],
    participants: [],
  });

  return NextResponse.json({ id: board._id });
}
