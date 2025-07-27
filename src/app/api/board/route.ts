import { connectToDatabase } from '@/lib/db';
import { Board } from '@/models/Board';
import { NextResponse } from 'next/server';

export async function POST() {
  await connectToDatabase();
  const board = await Board.create({
    name: 'Untitled Board',
    createdBy: 'anonymous',
    drawings: [],
  });

  return NextResponse.json({ id: board._id });
}
