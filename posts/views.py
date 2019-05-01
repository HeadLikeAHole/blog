from django.shortcuts import render, get_object_or_404, redirect
from django.core.exceptions import PermissionDenied
from django.template.loader import render_to_string
from django.http import JsonResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions

from .models import Post
from .forms import PostModelForm
from comments.models import Comment
from comments.forms import CommentForm


def home(request):
    posts = Post.objects.all().order_by('-published')
    return render(request, 'posts/home.html', {'posts': posts})


def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug)

    if request.method == 'POST':
        if request.POST.get('edit'):
            comment_id = request.POST.get('comment_id')
            comment = Comment.objects.get(id=comment_id)
            form = CommentForm(request.POST, instance=comment)
            if form.is_valid:
                form.save()

        elif request.POST.get('delete'):
            form = CommentForm()
            comment_id = request.POST.get('comment_id')
            comment = Comment.objects.get(id=comment_id)
            if comment.user != request.user:
                raise PermissionDenied
            comment.delete()

        else:
            form = CommentForm(request.POST)
            if form.is_valid:
                comment = form.save(commit=False)
                comment.user = request.user
                comment.post = post
                parent_id = request.POST.get('parent_id')
                if parent_id:
                    parent_comment = Comment.objects.get(id=parent_id)
                    comment.parent = parent_comment
                comment.save()

    else:
        form = CommentForm()
    # item_to_delete is a context variable that gets displayed by delete modal
    # url_name and item are context variables that get inserted into delete button url tag
    context = {
        'post': post,
        'form': form,
        'item_to_delete': 'post',
        'url_name': 'post_delete',
        'item': post.slug
    }

    if request.is_ajax():
        html = render_to_string('posts/comments.html', context, request)
        return JsonResponse({'html': html})

    return render(request, 'posts/post_detail.html', context)


def post_create(request):
    if request.method == 'POST':
        # request.FILES contains image
        form = PostModelForm(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.user = request.user
            post.save()
            return redirect('home')
    else:
        form = PostModelForm

    return render(request, 'posts/post_create.html', {'form': form})


def post_edit(request, slug):
    post = get_object_or_404(Post, slug=slug)
    # allow editing only own posts
    if post.user != request.user:
        raise PermissionDenied

    if request.method == 'POST':
        form = PostModelForm(request.POST, request.FILES, instance=post)
        if form.is_valid():
            form.save()
            return redirect('post_detail', post.slug)

    else:
        form = PostModelForm(instance=post)

    return render(request, 'posts/post_create.html', {'form': form, 'post': post})


def post_delete(request, slug):
    post = get_object_or_404(Post, slug=slug)
    # allow editing only own posts
    if post.user != request.user:
        raise PermissionDenied

    post.delete()

    return redirect('home')


# def post_like(request, slug):
#     post = get_object_or_404(Post, slug=slug)
#     user = request.user
#
#     if user.is_authenticated:
#         if user in post.likes.all():
#             post.likes.remove(user)
#         else:
#             post.likes.add(user)
#
#         return redirect('post_detail', slug)
#
#     else:
#         return redirect('login')


class PostLikeAPI(APIView):
    authentication_classes = (authentication.SessionAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, slug):
        post = get_object_or_404(Post, slug=slug)
        user = self.request.user
        authenticated = False
        add_like = False
        likes_count = post.likes.count()

        if user.is_authenticated:
            authenticated = True
            if user in post.likes.all():
                post.likes.remove(user)
                add_like = False
            else:
                post.likes.add(user)
                add_like = True

        data = {
            'authenticated': authenticated,
            'add_like': add_like,
            'likes_count': likes_count
                }

        return Response(data)
