from django.urls import path
from .views import CategoryListView, NoteListCreateView, NoteDetailView

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("notes/", NoteListCreateView.as_view(), name="note-list-create"),
    path("notes/<int:pk>/", NoteDetailView.as_view(), name="note-detail"),
]