import itertools

from django.db.models.signals import pre_save
from django.utils.text import slugify

from .models import Post


# create slug function
# if slug exists add a number to it
def create_slug(instance):
    slug = original = slugify(instance.title)
    for num in itertools.count(1):
        if not Post.objects.filter(slug=slug).exists():
            break
        slug = f'{original}-{num}'
    return slug


# signal is registered in app.py (ready method)
def pre_save_post_receiver(sender, instance, **kwargs):
    if not instance.slug:
        instance.slug = create_slug(instance)


pre_save.connect(pre_save_post_receiver, sender=Post)
