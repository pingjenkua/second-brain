import { NextResponse } from 'next/server';
import { getDocuments, saveDocument, deleteDocument } from '@/lib/storage';

export async function GET() {
  const documents = await getDocuments();
  return NextResponse.json(documents);
}

export async function POST(request: Request) {
  const body = await request.json();
  const now = new Date().toISOString();
  const doc = {
    ...body,
    id: body.id || crypto.randomUUID(),
    createdat: body.createdat || now,
    updatedat: now,
  };
  await saveDocument(doc);
  return NextResponse.json(doc);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    await deleteDocument(id);
  }
  return NextResponse.json({ success: true });
}
