"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import { Note, Category } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";

interface NoteEditorProps {
  note: Note;
  categories: Category[];
  onUpdate: (note: Note) => void;
  onClose: () => void;
}

export default function NoteEditor({
  note,
  categories,
  onUpdate,
  onClose,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [categoryId, setCategoryId] = useState<number | null>(note.category);
  const [updatedAt, setUpdatedAt] = useState(note.updated_at);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedTitle = useDebounce(title);
  const debouncedContent = useDebounce(content);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    saveNote({ title: debouncedTitle, content: debouncedContent });
  }, [debouncedTitle, debouncedContent]);

  useEffect(() => {
    saveNote({ category: categoryId });
  }, [categoryId]);

  const saveNote = async (data: Partial<Note>) => {
    const { data: updated } = await api.patch<Note>(`/notes/${note.id}/`, data);
    setUpdatedAt(updated.updated_at);
    onUpdate(updated);
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const bgColor = selectedCategory?.color ?? "#F5F0E8";

  const formatLastEdited = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    );
  };

  return (
    <main
      className="flex-1 flex flex-col"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border outline-none bg-white/30 backdrop-blur-sm"
            style={{ borderColor: "rgba(0,0,0,0.15)", color: "#5a3e2b" }}
          >
            {selectedCategory && (
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: selectedCategory.color }}
              />
            )}
            <span>{selectedCategory?.name ?? "No category"}</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {dropdownOpen && (
            <div
              className="absolute top-full mt-1 left-0 rounded-lg z-10 py-1 w-full overflow-hidden"
              style={{
                backgroundColor: "#F5F0E8",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategoryId(cat.id);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-black/5 transition-colors"
                  style={{ color: "#5a3e2b" }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl font-light"
          aria-label="Close note"
        >
          ✕
        </button>
      </div>

      <div
        className="flex-1 rounded-2xl p-8 flex flex-col shadow-sm"
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex justify-end mb-4">
          <span className="text-xs text-gray-900">
            Last Edited: {formatLastEdited(updatedAt)}
          </span>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          className="text-xl font-semibold outline-none text-gray-900  mb-4"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Pour your heart out..."
          className="flex-1 bg-transparent outline-none text-gray-900 resize-none text-sm leading-relaxed"
        />
      </div>
    </main>
  );
}
