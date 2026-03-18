from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Category

DEFAULT_CATEGORIES = [
    {"name": "Random Thoughts", "color": "#EF9C66"},
    {"name": "School", "color": "#FCDC94"},
    {"name": "Personal", "color": "#78ABA8"},
]

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_default_categories(sender, instance, created, **kwargs):
    if created:
        Category.objects.bulk_create([
            Category(name=cat["name"], color=cat["color"], user=instance)
            for cat in DEFAULT_CATEGORIES
        ])