# Notes App — Backend

Django REST Framework backend for the notes-taking app.

## Tech Stack

- Python 3.12
- Django 6
- Django REST Framework
- djangorestframework-simplejwt
- django-cors-headers
- python-decouple
- SQLite (development)

---

## Getting Started

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API will be available at `http://localhost:8000`.

### Environment Variables

Create a `.env` file in the root:

```
SECRET_KEY=your-secret-key-here
DEBUG=True
```

Generate a secure key with:

```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

---

## Running Tests

```bash
python manage.py test apps
```

Tests are located in `apps/users/tests/` and `apps/notes/tests/` and cover:

- `test_auth.py` — register, login, duplicate email, invalid credentials, auto-creation of categories
- `test_notes.py` — create note, list only own notes, filter by category, patch note, access control

---

## API Endpoints

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | `/api/auth/register/` | Register new user | No |
| POST | `/api/auth/login/` | Login | No |
| POST | `/api/auth/token/refresh/` | Refresh JWT token | No |
| GET | `/api/categories/` | List user categories | Yes |
| GET | `/api/notes/` | List notes (filter: `?category=<id>`) | Yes |
| POST | `/api/notes/` | Create note | Yes |
| GET | `/api/notes/<id>/` | Get note detail | Yes |
| PATCH | `/api/notes/<id>/` | Update note (partial) | Yes |
| DELETE | `/api/notes/<id>/` | Delete note | Yes |

---

## Project Structure

```
apps/
├── users/
│   ├── models.py       # Custom User model (email as USERNAME_FIELD)
│   ├── serializers.py  # RegisterSerializer, UserSerializer
│   ├── views.py        # RegisterView, LoginView
│   ├── urls.py
│   └── tests/
└── notes/
    ├── models.py       # Category, Note
    ├── serializers.py  # CategorySerializer, NoteSerializer
    ├── views.py        # DRF Generic Views
    ├── urls.py
    ├── signals.py      # Auto-create categories on user registration
    └── tests/
```

---

## Architecture Decisions

- **Custom User model** — uses email as the login field instead of username. Django recommends doing this from the start; changing it later requires resetting migrations
- **Django signals** — `post_save` on User triggers the creation of 3 default categories (Random Thoughts, School, Personal) automatically. This keeps the registration view clean and the logic in the right place
- **DRF Generic Views** — `ListCreateAPIView` and `RetrieveUpdateDestroyAPIView` instead of manual `APIView` for note endpoints. This is the idiomatic DRF approach for standard CRUD and reduces boilerplate significantly
- **PATCH instead of PUT** — notes use partial updates so the frontend only sends the fields that changed (e.g. just `title` during auto-save), not the entire object
- **`auto_now=True` on `updated_at`** — Django updates this field automatically on every save, so the frontend always gets the correct last-edited timestamp without any extra logic

---

## How I Used AI

AI was used as a support tool, not as the author of the application:

- **Django signals syntax:** I knew I needed to auto-create categories on user registration but hadn't used `post_save` signals recently. AI helped recall the exact decorator syntax (`@receiver`) and where to register them in `apps.py` via `ready()` — the same way you'd look up a function signature in the docs
- **`bulk_create` suggestion:** When writing the signal to create 3 categories, AI suggested using `bulk_create` instead of 3 separate `save()` calls to reduce database queries — a performance consideration I validated and applied
- **`AbstractBaseUser` setup:** Setting up a custom user model requires several specific fields and methods (`USERNAME_FIELD`, `REQUIRED_FIELDS`, `UserManager`). AI helped ensure nothing was missing from the boilerplate — the same way a checklist helps you not forget steps
- **Test structure:** AI helped scaffold the test cases quickly so I could focus on making sure the assertions were meaningful and covered the right behavior rather than spending time on setup code
