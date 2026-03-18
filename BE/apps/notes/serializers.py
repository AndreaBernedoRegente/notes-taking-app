from rest_framework import serializers
from .models import Note, Category


class CategorySerializer(serializers.ModelSerializer):
    note_count = serializers.SerializerMethodField()

    def get_note_count(self, obj):
        if hasattr(obj, "note_count"):
            return obj.note_count
        return obj.notes.count()

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

    def validate_category(self, category):
        if category and category.user != self.context["request"].user:
            raise serializers.ValidationError("Category does not belong to you.")
        return category