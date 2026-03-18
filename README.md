# Notes Taking App

A simple and aesthetic notes-taking app built with Django REST Framework and Next.js.

## Tech Stack

**Backend:** Python 3.12, Django 6, Django REST Framework, JWT Authentication  
**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS v4

---

## Project Structure

```
challenge/
├── BE/         # Django backend
├── frontend/   # Next.js frontend
└── README.md
```

---

## Getting Started

### Backend

```bash
cd BE
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

API available at `http://localhost:8000`.

Create a `.env` file inside `BE/`:

```
SECRET_KEY=your-secret-key-here
DEBUG=True
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at `http://localhost:3000`.

Create a `.env.local` file inside `frontend/`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Running Tests

### Backend

```bash
cd BE
source venv/bin/activate
python manage.py test apps
```

### Frontend

```bash
cd frontend
npm test
```

---

## API Endpoints

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | `/api/auth/register/` | Register new user | No |
| POST | `/api/auth/login/` | Login | No |
| POST | `/api/auth/token/refresh/` | Refresh JWT token | No |
| GET | `/api/categories/` | List user categories | Yes |
| GET | `/api/notes/` | List notes (`?category=<id>`) | Yes |
| POST | `/api/notes/` | Create note | Yes |
| GET | `/api/notes/<id>/` | Get note detail | Yes |
| PATCH | `/api/notes/<id>/` | Update note (partial) | Yes |
| DELETE | `/api/notes/<id>/` | Delete note | Yes |

---

## Architecture Decisions

### Backend
- **Custom User model** — email as login field instead of username
- **Django signals** — auto-creates 3 default categories (Random Thoughts, School, Personal) on user registration
- **DRF Generic Views** — idiomatic approach for standard CRUD, reduces boilerplate
- **PATCH instead of PUT** — notes use partial updates so the frontend only sends changed fields during auto-save
- **`auto_now=True` on `updated_at`** — Django handles the timestamp automatically on every save

### Frontend
- **AuthContext** with `localStorage` persistence — keeps the user logged in across page refreshes
- **useDebounce hook** — auto-saves notes 500ms after the user stops typing, no save button needed
- **`page.tsx` controls visibility** — sidebar hidden when editor is open, matching the Figma prototype
- **react-markdown** — renders note content so bullet lists written with `-` display as formatted lists in preview cards

---

## How I Used AI

AI was used as a support tool throughout the project — similar to how a calculator helps with arithmetic without replacing the understanding behind it.

### Backend
- **Django signals syntax** — I knew I needed to auto-create categories on registration but hadn't used `post_save` recently. AI helped recall the exact decorator and where to register it in `apps.py`, the same way you'd look up a function signature in the docs
- **`bulk_create` suggestion** — when creating 3 categories in the signal, AI suggested `bulk_create` to reduce database queries from 3 to 1 — a performance detail I validated and applied
- **`AbstractBaseUser` checklist** — setting up a custom user model requires specific fields and methods. AI helped ensure nothing was missing from the boilerplate, like a checklist

### Frontend
- **`react-markdown` integration** — I knew I needed markdown rendering but ran into a hydration error (`<ul>` inside `<p>`). AI identified the root cause and the fix (`<div>` wrapper), the same way a linter flags an issue you then fix yourself
- **Jest + ESM conflict** — `react-markdown` uses ES Modules and Jest couldn't parse it. AI helped build the `transformIgnorePatterns` regex and the mock solution, the same way a search engine helps find the right config without reading full docs
- **Tailwind class lookups** — confirming exact class names for `line-clamp`, `prose`, and backdrop blur, the same way autocomplete speeds up typing something you already know
- **`date-fns` suggestion** — AI recommended using `isToday` and `isYesterday` from `date-fns` instead of manual date comparison for better timezone reliability
