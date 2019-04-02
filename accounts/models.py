from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    image = models.ImageField(default='profile_default.jpg', upload_to='profile_images')

    def __str__(self):
        return f'{self.user.username} Profile'
