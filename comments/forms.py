from django import forms

from .models import Comment


class CommentForm(forms.ModelForm):
    # override default text field that is remove label and add placeholder
    text = forms.CharField(label='', widget=forms.Textarea(
        attrs={'placeholder': 'Add a comment...'}))

    class Meta:
        model = Comment
        fields = ['text']
