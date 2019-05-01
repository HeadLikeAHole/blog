from django import forms

from .models import Comment


class CommentForm(forms.ModelForm):
    text = forms.CharField(label='', widget=forms.Textarea(
        attrs={'placeholder': 'Add a comment...'}))

    class Meta:
        model = Comment
        fields = ['text']
