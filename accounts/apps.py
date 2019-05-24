from django.apps import AppConfig


class AccountsConfig(AppConfig):
    name = 'accounts'

    # this method is added if signals were defined in a separate file (not in models.py)
    def ready(self):
        import accounts.signals
