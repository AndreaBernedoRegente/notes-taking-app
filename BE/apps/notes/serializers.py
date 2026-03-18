from rest_framework import serializers
from .models import Note, Category


class CategorySerializer(serializers.ModelSerializer):
    note_count = serializers.IntegerField(source="notes.count", read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "color", "note_count"]


class NoteSerializer(serializers.ModelSerializer):
    category_detail = CategorySerializer(source="category", read_only=True)

    class Meta:
        model = Note
        fields = [
            "id", "title", "content",
            "category", "category_detail",
            "created_at", "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]