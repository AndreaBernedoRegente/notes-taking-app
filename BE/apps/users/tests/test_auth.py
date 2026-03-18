from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = "/api/auth/register/"
        self.login_url = "/api/auth/login/"

    def test_register_success(self):
        response = self.client.post(self.register_url, {
            "email": "test@test.com",
            "password": "testpass123"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_register_creates_default_categories(self):
        self.client.post(self.register_url, {
            "email": "test@test.com",
            "password": "testpass123"
        })
        user = User.objects.get(email="test@test.com")
        self.assertEqual(user.categories.count(), 3)
        category_names = list(user.categories.values_list("name", flat=True))
        self.assertIn("Random Thoughts", category_names)
        self.assertIn("School", category_names)
        self.assertIn("Personal", category_names)

    def test_register_duplicate_email(self):
        self.client.post(self.register_url, {
            "email": "test@test.com",
            "password": "testpass123"
        })
        response = self.client.post(self.register_url, {
            "email": "test@test.com",
            "password": "testpass123"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_success(self):
        User.objects.create_user(email="test@test.com", password="testpass123")
        response = self.client.post(self.login_url, {
            "email": "test@test.com",
            "password": "testpass123"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_login_invalid_credentials(self):
        response = self.client.post(self.login_url, {
            "email": "wrong@test.com",
            "password": "wrongpass"
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)