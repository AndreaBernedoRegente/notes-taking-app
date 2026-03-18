"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/api";
import { Note, Category } from "@/types";
import NoteCard from "./NoteCard";

interface NoteListProps {
  selectedCategory: number | null;
  onSelectNote: (note: Note) => void;
}

export default function NoteList({
  selectedCategory,
  onSelectNote,
}: NoteListProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError(false);
      try {
        const params = selectedCategory ? { category: selectedCategory } : {};
        const { data } = await api.get<Note[]>("/notes/", { params });
        setNotes(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [selectedCategory]);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-sm text-muted animate-pulse">Loading notes...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-sm text-red-400">
          Couldn&apos;t load notes. Please try again.
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto">
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <Image src="/boba.png" alt="No notes" width={200} height={200} />
          <p className="text-base text-primary">
            I&apos;m just here waiting for your charming notes...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={() => onSelectNote(note)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
