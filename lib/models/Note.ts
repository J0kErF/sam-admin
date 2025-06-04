// File: models/note.ts
import mongoose from 'mongoose';

export type NoteType = 'רגיל' | 'תזכורת';

export interface INote {
  _id: string;
  title: string;
  content?: string;
  type?: NoteType;
  createdAt?: string;
  notifyAt?: string;
  done?: boolean;
  seen?: boolean;
}

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  type: { type: String, enum: ['רגיל', 'תזכורת'] },
  createdAt: { type: Date, default: Date.now },
  notifyAt: { type: Date },
  done: { type: Boolean, default: false },
  seen: { type: Boolean, default: false },
});

export const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema);
