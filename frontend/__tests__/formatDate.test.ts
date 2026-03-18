import { formatNoteDate } from "@/lib/formatDate";

describe("formatNoteDate", () => {
  it("returns 'Today' for today's date", () => {
    const today = new Date().toISOString();
    expect(formatNoteDate(today)).toBe("Today");
  });

  it("returns 'Yesterday' for yesterday's date", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(formatNoteDate(yesterday.toISOString())).toBe("Yesterday");
  });

  it("returns formatted date for older dates", () => {
    const date = new Date("2024-06-12T10:00:00.000Z");
    const result = formatNoteDate(date.toISOString());
    expect(result).toBe("Jun 12");
  });

  it("does not include the year", () => {
    const date = new Date("2024-03-05T10:00:00.000Z");
    const result = formatNoteDate(date.toISOString());
    expect(result).not.toContain("2024");
  });
});
