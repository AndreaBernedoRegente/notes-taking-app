from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.notes.models import Note, Category

User = get_user_model()


class NotesTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="test@test.com",
            password="testpass123"
        )
        self.client.force_authenticate(user=self.user)
        self.category = self.user.categories.first()

    def test_create_note(self):
        response = self.client.post("/api/notes/", {
            "title": "Test note",
            "content": "Test content",
            "category": self.category.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Note.objects.count(), 1)

    def test_list_notes_only_own(self):
        other_user = User.objects.create_user(
            email="other@test.com",
            password="testpass123"
        )
        Note.objects.create(user=self.user, title="Mine")
        Note.objects.create(user=other_user, title="Not mine")
        response = self.client.get("/api/notes/")
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Mine")

    def test_filter_notes_by_category(self):
        category2 = self.user.categories.last()
        Note.objects.create(user=self.user, category=self.category, title="Note 1")
        Note.objects.create(user=self.user, category=category2, title="Note 2")
        response = self.client.get(f"/api/notes/?category={self.category.id}")
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Note 1")

    def test_patch_note(self):
        note = Note.objects.create(user=self.user, title="Original")
        response = self.client.patch(f"/api/notes/{note.id}/", {
            "title": "Updated"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        note.refresh_from_db()
        self.assertEqual(note.title, "Updated")

    def test_cannot_access_other_users_note(self):
        other_user = User.objects.create_user(
            email="other@test.com",
            password="testpass123"
        )
        note = Note.objects.create(user=other_user, title="Private")
        response = self.client.get(f"/api/notes/{note.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)