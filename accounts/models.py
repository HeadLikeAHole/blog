from django.db import models
from django.contrib.auth.models import User
from PIL import Image


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    image = models.ImageField(default='profile_default.jpg', upload_to='profile_images')

    def __str__(self):
        return f'{self.user.username} Profile'

    # decrease uploaded image's resolution to 600 px
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # methods from PIL library
        img = Image.open(self.image.path)
        if img.height > 360 or img.width > 360:
            output_size = (360, 360)
            img.thumbnail(output_size)
            img.save(self.image.path)
