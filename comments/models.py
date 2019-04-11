from django.db import models
from django.contrib.auth.models import User

from posts.models import Post


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    parent = models.ForeignKey('self', related_name='children', on_delete=models.CASCADE)
    text = models.TextField()
    published = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.username}\'s comment to {self.post.title} post'
