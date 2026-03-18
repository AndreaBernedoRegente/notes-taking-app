from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Note, Category
from .serializers import NoteSerializer, CategorySerializer


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)


class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer

    def get_queryset(self):
        queryset = Note.objects.filter(user=self.request.user)
        category_id = self.request.query_params.get("category")
        if category_id:
            queryset = queryset.filter(category__id=category_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NoteSerializer
    http_method_names = ["get", "patch", "delete"]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)