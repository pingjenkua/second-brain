import { NextResponse } from 'next/server';
import { getMemories, saveMemory, deleteMemory } from '@/lib/storage';

export async function GET() {
  const memories = await getMemories();
  return NextResponse.json(memories);
}

export async function POST(request: Request) {
  const body = await request.json();
  const now = new Date().toISOString();
  const memory = {
    ...body,
    id: body.id || crypto.randomUUID(),
    createdat: body.createdat || now,
    updatedat: now,
  };
  await saveMemory(memory);
  return NextResponse.json(memory);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    await deleteMemory(id);
  }
  return NextResponse.json({ success: true });
}
