"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CategorySidebar from "@/components/ui/CategorySidebar";
import NoteList from "@/components/notes/NoteList";
import NoteEditor from "@/components/notes/NoteEditor";
import { Note, Category } from "@/types";
import api from "@/lib/api";

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      api
        .get<Category[]>("/categories/")
        .then((res) => setCategories(res.data));
    }
  }, [isAuthenticated]);

  const handleCreateNote = async () => {
    const defaultCategory = selectedCategory ?? categories[0]?.id ?? null;
    const { data } = await api.post<Note>("/notes/", {
      title: "",
      content: "",
      category: defaultCategory,
    });
    setSelectedNote(data);
  };

  if (!isAuthenticated) return null;

  if (selectedNote) {
    return (
      <div className="flex h-screen p-8 bg-background">
        <NoteEditor
          note={selectedNote}
          categories={categories}
          onUpdate={(updated) => setSelectedNote(updated)}
          onClose={() => setSelectedNote(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen px-8 pt-8 bg-background">
      <div className="flex justify-end mb-6">
        <button
          onClick={handleCreateNote}
          className="rounded-full px-5 py-2 text-sm border transition-colors border-primary text-primary"
        >
          + New Note
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden gap-8">
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <NoteList
          selectedCategory={selectedCategory}
          onSelectNote={setSelectedNote}
        />
      </div>
    </div>
  );
}
