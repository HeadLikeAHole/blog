from django import forms
from pagedown.widgets import PagedownWidget

from .models import Post


class PostModelForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'text', 'image']
        # add rich text editor by overriding default widget
        widgets = {'text': PagedownWidget}
