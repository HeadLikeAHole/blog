from django.db import models
from django.contrib.auth.models import User
from django.shortcuts import reverse

from PIL import Image

from posts.models import Post


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    image = models.ImageField(default='profile_default.jpg', upload_to='profile_images')
    following = models.ManyToManyField('self', symmetrical=False, related_name='followers')

    def get_api_follow_pk(self):
        return reverse('user_follow_api', kwargs={'pk': self.pk})

    def __str__(self):
        return f'{self.user.username} Profile'

    # crop uploaded image's resolution to 360px
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # methods from PIL library
        img = Image.open(self.image.path)
        if img.height > 360 or img.width > 360:
            output_size = (360, 360)
            img.thumbnail(output_size)
            img.save(self.image.path)
