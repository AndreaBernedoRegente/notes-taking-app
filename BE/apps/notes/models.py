from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError


class Category(models.Model):
    COLORS = [
        ("#EF9C66", "Orange"),
        ("#FCDC94", "Yellow"),
        ("#78ABA8", "Teal"),
    ]

    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, choices=COLORS)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="categories"
    )

    def __str__(self):
        return f"{self.name} ({self.user.email})"


class Note(models.Model):
    title = models.CharField(max_length=255, blank=True, default="")
    content = models.TextField(blank=True, default="")
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name="notes"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notes"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.category and self.category.user != self.user:
            raise ValidationError("Category must belong to the same user")

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return self.title or "Untitled"
