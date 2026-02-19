import { NextResponse } from 'next/server';
import { getTasks, saveTask, deleteTask } from '@/lib/storage';

export async function GET() {
  const tasks = await getTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const now = new Date().toISOString();
  const task = {
    ...body,
    id: body.id || crypto.randomUUID(),
    createdat: body.createdat || now,
    updatedat: now,
  };
  await saveTask(task);
  return NextResponse.json(task);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    await deleteTask(id);
  }
  return NextResponse.json({ success: true });
}
