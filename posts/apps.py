from django.apps import AppConfig


class PostsConfig(AppConfig):
    name = 'posts'

    # this method is added if signals were defined in a separate file (not in models.py)
    def ready(self):
        import posts.signals
