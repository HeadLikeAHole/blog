from django.db import models
from django.contrib.auth.models import User
from django.shortcuts import reverse


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    text = models.TextField()
    image = models.ImageField(default='post_default.jpg', upload_to='post_images')
    likes = models.ManyToManyField(User, related_name='post_likes', blank=True)
    published = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    slug = models.SlugField(unique=True)

    def get_api_like_url(self):
        return reverse('post_like_api', kwargs={'slug': self.slug})

    def __str__(self):
        return self.title
