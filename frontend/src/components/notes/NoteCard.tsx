import { Note } from "@/types";
import { formatNoteDate } from "@/lib/formatDate";
import ReactMarkdown from "react-markdown";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export default function NoteCard({ note, onClick }: NoteCardProps) {
  const color = note.category_detail?.color ?? "#F5F0E8";

  return (
    <button
      onClick={onClick}
      className="text-left w-full p-5 rounded-2xl flex flex-col gap-2 hover:opacity-90 transition-opacity"
      style={{ backgroundColor: color + "cc", border: `1.5px solid ${color}` }}
    >
      <div className="flex items-center justify-start gap-2">
        <span className="text-xs text-gray-600 font-bold">
          {formatNoteDate(note.updated_at)}
        </span>
        <span className="text-xs text-gray-600">
          {note.category_detail?.name ?? "Uncategorized"}
        </span>
      </div>
      <h3 className="text-xl font-serif text-gray-800 leading-snug">
        {note.title || "Untitled"}
      </h3>
      <div className="prose prose-sm max-w-none line-clamp-4 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_*]:text-gray-700 [&_li::marker]:text-gray-700">
        <ReactMarkdown>{note.content || ""}</ReactMarkdown>
      </div>
    </button>
  );
}
