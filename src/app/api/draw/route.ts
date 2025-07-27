import { connectToDatabase } from '@/lib/db';
import { Drawing } from '@/models/Drawing';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const boardId = searchParams.get('boardId');

  if (!boardId) {
    return NextResponse.json({ error: 'Missing boardId' }, { status: 400 });
  }

  const drawings = await Drawing.find({ boardId }).sort({ createdAt: 1 });
  return NextResponse.json(drawings);
}
