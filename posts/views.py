from django.shortcuts import render, get_object_or_404, redirect

from .models import Post
from .forms import PostModelForm


def home(request):
    posts = Post.objects.all().order_by('-published')
    return render(request, 'posts/home.html', {'posts': posts})


def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug)
    return render(request, 'posts/post_detail.html', {'post': post})


def post_create(request):
    if request.method == 'POST':
        form = PostModelForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.user = request.user
            post.save()
            return redirect('home')
    else:
        form = PostModelForm

    return render(request, 'posts/post_create.html', {'form': form})
