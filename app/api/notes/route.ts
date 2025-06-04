import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoDB';
import { Note } from '@/lib/models/Note';

// GET all notes
export async function GET() {
  await connectToDB();
  const notes = await Note.find().sort({ createdAt: -1 });
  return NextResponse.json(notes);
}

// CREATE a new note
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await connectToDB();
    const newNote = await Note.create(data);
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}

// UPDATE a note (e.g., mark as seen/done, update fields)
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { _id, ...update } = data;

    if (!_id) {
      return NextResponse.json({ error: 'Missing _id' }, { status: 400 });
    }

    await connectToDB();
    const updated = await Note.findByIdAndUpdate(_id, update, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

// DELETE a note
export async function DELETE(req: NextRequest) {
  try {
    const { _id } = await req.json();
    if (!_id) {
      return NextResponse.json({ error: 'Missing _id' }, { status: 400 });
    }

    await connectToDB();
    await Note.findByIdAndDelete(_id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
