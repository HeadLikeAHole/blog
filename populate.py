import os
import random

import django


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog.settings')
django.setup()


from django.contrib.auth.models import User
from django.utils.text import slugify
from faker import Faker

from posts.models import Post


def create_posts(n):
    fake = Faker()
    for _ in range(n):
        user_ids = [1, 2, 4, 5]
        id = random.choice(user_ids)
        user = User.objects.get(id=id)
        title = fake.name()
        text = fake.text()
        slug = slugify(title)
        Post.objects.create(user=user, title=title, text=text, slug=slug)


create_posts(100)

print('Posts created!')
