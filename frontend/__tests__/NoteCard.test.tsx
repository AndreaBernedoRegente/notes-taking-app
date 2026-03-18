import { render, screen } from "@testing-library/react";
import NoteCard from "@/components/notes/NoteCard";
import { Note } from "@/types";

const mockNote: Note = {
  id: 1,
  title: "Test Note",
  content: "Test content",
  category: 1,
  category_detail: {
    id: 1,
    name: "Random Thoughts",
    color: "#E8956D",
    note_count: 1,
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

describe("NoteCard", () => {
  it("renders the note title", () => {
    render(<NoteCard note={mockNote} onClick={() => {}} />);
    expect(screen.getByText("Test Note")).toBeInTheDocument();
  });

  it("renders the category name", () => {
    render(<NoteCard note={mockNote} onClick={() => {}} />);
    expect(screen.getByText("Random Thoughts")).toBeInTheDocument();
  });

  it("renders 'Untitled' when title is empty", () => {
    render(<NoteCard note={{ ...mockNote, title: "" }} onClick={() => {}} />);
    expect(screen.getByText("Untitled")).toBeInTheDocument();
  });

  it("renders 'Today' for today's date", () => {
    render(<NoteCard note={mockNote} onClick={() => {}} />);
    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handleClick = jest.fn();
    render(<NoteCard note={mockNote} onClick={handleClick} />);
    screen.getByText("Test Note").closest("button")?.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
