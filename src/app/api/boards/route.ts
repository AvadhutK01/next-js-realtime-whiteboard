import { connectToDatabase } from '@/lib/db';
import { Board } from '@/models/Board';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "created"; 
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 5;

  await connectToDatabase();

  let query = {};
  if (type === "created") {
    query = { createdBy: session.user.email };
  } else {
    query = { participants: session.user.email, createdBy: { $ne: session.user.email } };
  }

  const boards = await Board.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit + 1) 
    .lean();

  const hasMore = boards.length > limit;
  if (hasMore) boards.pop(); 

  return NextResponse.json({ boards, hasMore });
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

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { boardId } = await req.json();
  if (!boardId) {
    return NextResponse.json({ error: 'Board ID is required' }, { status: 400 });
  }

  await connectToDatabase();
  const board = await Board.findById(boardId);
  if (!board) {
    return NextResponse.json({ error: 'Board not found' }, { status: 404 });
  }

  if (board.createdBy === session.user.email) {
    return NextResponse.json({ error: 'You are the creator of this board' }, { status: 409 });
  }

  if (board.participants.includes(session.user.email)) {
    return NextResponse.json({ error: 'Already joined this board' }, { status: 409 });
  }

  board.participants.push(session.user.email);
  await board.save();

  return NextResponse.json({ message: 'Joined successfully', id: board._id });
}
