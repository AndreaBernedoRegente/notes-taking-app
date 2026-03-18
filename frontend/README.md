# Notes App — Frontend

Next.js frontend for the notes-taking app.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Axios
- date-fns
- react-markdown

---

## Getting Started

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

Make sure the backend is running at `http://localhost:8000` before starting.

### Environment Variables

Create a `.env.local` file in the root:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Running Tests

```bash
npm test
```

Tests are located in `__tests__/` and cover:

- `formatDate.test.ts` — date formatting logic (Today, Yesterday, Month Day)
- `NoteCard.test.tsx` — note card rendering and interactions
- `PasswordInput.test.tsx` — password visibility toggle

---

## Project Structure

```
src/
├── app/              # Pages (login, signup, dashboard)
├── components/
│   ├── auth/         # AuthForm, PasswordInput
│   ├── notes/        # NoteCard, NoteEditor, NoteList
│   └── ui/           # CategorySidebar
├── context/          # AuthContext (JWT + user state)
├── hooks/            # useDebounce
├── lib/              # api.ts (Axios client), formatDate.ts
└── types/            # TypeScript interfaces
```

---

## Architecture Decisions

- **AuthContext** with `localStorage` persistence — keeps the user logged in across page refreshes without a backend session
- **useDebounce hook** — auto-saves notes 500ms after the user stops typing, so no save button is needed
- **`page.tsx` controls visibility** — when a note is open, the sidebar is hidden and the editor takes full screen, matching the Figma prototype
- **react-markdown** — renders note content so users can write basic markdown (bullet lists with `-`, bold with `**`, etc.) and see it formatted in the preview cards

---

## How I Used AI

AI was used as a support tool, not as the author of the application:

- **`react-markdown` integration:** I knew I needed to render markdown in the note cards but wasn't sure which library to use or how to handle the hydration error (`<ul>` inside `<p>`). AI helped identify the root cause and suggested using a `<div>` wrapper — the same way a linter flags an issue you then fix yourself
- **`transformIgnorePatterns` in Jest config:** `react-markdown` uses ESM and Jest couldn't parse it. AI helped build the correct regex pattern to tell Jest which packages to transform — the same way a search engine helps you find the right config option without reading the full docs
- **Tailwind class lookups:** When implementing `line-clamp`, `prose`, and backdrop blur effects, AI helped confirm the exact class names — the same way autocomplete speeds up typing something you already know
- **Date formatting edge cases:** AI suggested using `date-fns` `isToday` and `isYesterday` functions instead of manual date comparison, which is more reliable across timezones
