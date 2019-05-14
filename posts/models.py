from django.db import models
from django.contrib.auth.models import User
from django.shortcuts import reverse
from PIL import Image


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    text = models.TextField()
    image = models.ImageField(default='post_default.jpg', upload_to='post_images')
    likes = models.ManyToManyField(User, related_name='post_likes', blank=True)
    published = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    slug = models.SlugField(unique=True)

    class Meta:
        ordering = ['-published']

    def get_api_like_url(self):
        return reverse('post_like_api', kwargs={'slug': self.slug})

    def __str__(self):
        return self.title

    # decrease uploaded image's resolution to 600 px
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # methods from PIL library
        img = Image.open(self.image.path)
        if img.height > 1080 or img.width > 1080:
            output_size = (1080, 1080)
            img.thumbnail(output_size)
            img.save(self.image.path)
