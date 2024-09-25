// src/app/api/notes/route.ts

// src/app/api/notes/route.ts

import { NextResponse } from 'next/server';
import { initializeSecretJS, getNotes, addNote } from '@/lib/secret-network';

export async function GET() {
  try {
    await initializeSecretJS();
    const response = await getNotes();
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initializeSecretJS();
    const { title, content } = await request.json();
    const tx = await addNote(title, content);
    return NextResponse.json({ success: true, tx: tx.transactionHash }, { status: 201 });
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json({ success: false, error: 'Failed to add note' }, { status: 500 });
  }
}