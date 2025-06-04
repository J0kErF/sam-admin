'use client';

import { useEffect, useState } from 'react';
import { NoteType } from '@/lib/models/Note';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BellDot, Trash2, Eye, EyeOff } from 'lucide-react';
import { Pen, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';

import clsx from 'clsx';

type Note = {
    _id: string;
    title: string;
    content?: string;
    type?: NoteType;
    createdAt?: string;
    notifyAt?: string;
    done?: boolean;
    seen?: boolean;
};

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedTab, setSelectedTab] = useState('all');
    const [editNote, setEditNote] = useState<Note | null>(null);
    const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

    const [editForm, setEditForm] = useState<Pick<Note, 'title' | 'content' | 'type' | 'notifyAt' | 'done'>>({
        title: '',
        content: '',
        type: 'רגיל',
        notifyAt: '',
        done: false,
    });


    const [form, setForm] = useState<Pick<Note, 'title' | 'content' | 'type' | 'notifyAt' | 'done'>>({
        title: '',
        content: '',
        type: 'רגיל',
        notifyAt: '',
        done: false,
    });


    const fetchNotes = async () => {
        const res = await fetch('/api/notes');
        const data = await res.json();
        setNotes(data);
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleSubmit = async () => {
        const res = await fetch('/api/notes', {
            method: 'POST',
            body: JSON.stringify(form),
        });
        const newNote = await res.json();
        setNotes([newNote, ...notes]);
        setForm({ title: '', content: '', type: 'רגיל', notifyAt: '', done: false });
    };

    const updateNote = async (_id: string, update: Partial<Note>) => {
        await fetch('/api/notes', {
            method: 'PUT',
            body: JSON.stringify({ _id, ...update }),
        });
        fetchNotes();
    };

    const deleteNote = async (_id: string) => {
        await fetch('/api/notes', {
            method: 'DELETE',
            body: JSON.stringify({ _id }),
        });
        setNotes(notes.filter(note => note._id !== _id));
    };

    const isReminderDue = (note: Note) => {
        return note.type === 'תזכורת' && note.notifyAt && new Date(note.notifyAt) <= new Date() && !note.done;
    };

    return (
        <div className="p-4 max-w-2xl mx-auto space-y-4">
            <h1 className="text-xl font-bold text-center">📌 מערכת פתקים חכמה</h1>

            <div className="bg-white rounded-xl shadow-md p-4 space-y-3">
                <Input
                    placeholder="כותרת"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                />
                <Textarea
                    placeholder="תוכן"
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                />
                <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as NoteType })}
                    className="border p-2 rounded w-full"
                >
                    <option value="רגיל">פתק רגיל</option>
                    <option value="תזכורת">תזכורת</option>
                </select>
                {form.type === 'תזכורת' && (
                    <Input
                        type="datetime-local"
                        value={form.notifyAt}
                        onChange={e => setForm({ ...form, notifyAt: e.target.value })}
                    />
                )}
                <Button onClick={handleSubmit}>📝 הוסף פתק</Button>
            </div>

            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">

                <TabsList className="w-full flex justify-center gap-2 mb-4">
                    <TabsTrigger value="all">הכל</TabsTrigger>
                    <TabsTrigger value="רגיל">רגיל</TabsTrigger>
                    <TabsTrigger value="תזכורת">תזכורות</TabsTrigger>
                </TabsList>

                <div className="grid gap-4">
                    {notes
                        .filter(note => selectedTab === 'all' || note.type === selectedTab)
                        .map(note => (
                            <Card
                                key={note._id}
                                className={clsx(
                                    'relative transition hover:shadow-lg border',
                                    isReminderDue(note) && 'border-red-500'
                                )}
                                onClick={() => {
                                    updateNote(note._id, { seen: !note.seen });
                                    setNotes(prev =>
                                        prev.map(n => (n._id === note._id ? { ...n, seen: !n.seen } : n))
                                    );
                                }}
                            >
                                <CardContent className="p-4 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <h2 className="font-semibold">{note.title}</h2>
                                        <div className="flex gap-2 items-center">
                                            <Pen
                                                className="w-4 h-4 text-blue-600 cursor-pointer hover:text-blue-800"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditNote(note);
                                                    setEditForm({
                                                        title: note.title,
                                                        content: note.content || '',
                                                        type: note.type || 'רגיל',
                                                        notifyAt: note.notifyAt ? new Date(note.notifyAt).toISOString().slice(0, 16) : '',
                                                        done: note.done || false,

                                                    });
                                                }}
                                            />

                                            {note.seen ? (
                                                <Eye className="w-4 h-4 text-blue-500" />
                                            ) : (
                                                <EyeOff className="w-4 h-4 text-yellow-500" />
                                            )}
                                            {isReminderDue(note) && <BellDot className="w-4 h-4 text-red-500" />}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Trash2
                                                        className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                    />
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="bg-white rounded-xl shadow-md">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>האם אתה בטוח שברצונך למחוק?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            פעולה זו תמחק את הפתק לצמיתות. לא תוכל לשחזר אותו לאחר מכן.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter className="flex justify-end gap-2">
                                                        <AlertDialogCancel>ביטול</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className="bg-red-600 text-white hover:bg-red-700"
                                                            onClick={async () => {
                                                                await deleteNote(note._id);
                                                            }}
                                                        >
                                                            מחק פתק
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>


                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 whitespace-pre-line">{note.content}</p>
                                    <div className="text-xs text-gray-400 flex justify-between">
                                        <span>סוג: {note.type}</span>
                                        {note.notifyAt && (
                                            <span>
                                                ל {new Date(note.notifyAt).toLocaleString('he-IL', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        )}
                                        <span className={clsx('font-medium', note.done ? 'text-green-600' : 'text-yellow-600')}>
                                            {note.done ? '✔ טופל' : '⏳ בהמתנה'}
                                        </span>

                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    <Dialog open={!!editNote} onOpenChange={() => setEditNote(null)}>
                        <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-md">
                            <DialogHeader>
                                <DialogTitle>ערוך פתק</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-2">
                                <select
                                    value={editForm.done ? 'טופל' : 'בהמתנה'}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, done: e.target.value === 'טופל' })
                                    }
                                    className="border p-2 rounded w-full"
                                >
                                    <option value="בהמתנה">בהמתנה</option>
                                    <option value="טופל">טופל</option>
                                </select>

                                <Input
                                    placeholder="כותרת"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                />
                                <Textarea
                                    placeholder="תוכן"
                                    value={editForm.content}
                                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                />

                                {editForm.type === 'תזכורת' && (
                                    <Input
                                        type="datetime-local"
                                        value={editForm.notifyAt}
                                        onChange={(e) => setEditForm({ ...editForm, notifyAt: e.target.value })}
                                    />
                                )}
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setEditNote(null)}>ביטול</Button>
                                    <Button
                                        onClick={async () => {
                                            if (!editNote) return;
                                            await updateNote(editNote._id, editForm);
                                            setNotes(prev =>
                                                prev.map(n => (n._id === editNote._id ? { ...n, ...editForm } : n))
                                            );
                                            setEditNote(null);

                                        }}
                                    >
                                        שמור שינויים
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                </div>
                <AlertDialog open={!!noteToDelete} onOpenChange={(open) => !open && setNoteToDelete(null)}>
                    <AlertDialogContent className="bg-white rounded-xl shadow-md">
                        <AlertDialogHeader>
                            <AlertDialogTitle>האם אתה בטוח שברצונך למחוק?</AlertDialogTitle>
                            <AlertDialogDescription>
                                פעולה זו תמחק את הפתק לצמיתות. לא תוכל לשחזר אותו לאחר מכן.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex justify-end gap-2">
                            <AlertDialogCancel>ביטול</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={async () => {
                                    if (!noteToDelete) return;
                                    await deleteNote(noteToDelete._id);
                                    setNoteToDelete(null);
                                }}
                            >
                                מחק פתק
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </Tabs>
        </div>

    );
}
