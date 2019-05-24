from django.shortcuts import render, redirect, get_object_or_404, HttpResponse
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.core.paginator import Paginator

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions

from .forms import UserRegisterForm, UserEditForm, ProfileEditForm
from .models import Profile
from posts.models import Post


def register(request):
    next_page = request.GET.get('next')  # page to redirect to after registering (previous page)
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            # save username and password to authenticate and login user automatically after registration
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            messages.success(request, f'Account with username "{username}" has been created')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect(next_page)
            else:
                return HttpResponse('User does not exist')

    else:
        form = UserRegisterForm()

    return render(request, 'registration/register.html', {'form': form})


def profile(request, pk):
    user_profile = get_object_or_404(Profile, pk=pk)
    # by default user profile displays all user posts
    user_posts = Post.objects.filter(user__profile=user_profile)

    # paginate posts by 20 items per page
    paginator = Paginator(user_posts, 20)
    if paginator.num_pages > 1:
        paginated = True
    else:
        paginated = False
    page = request.GET.get('page')
    # variable called items so pagination works in all views from base.html
    items = paginator.get_page(page)

    context = {'profile': user_profile, 'items': items, 'paginated': paginated}

    return render(request, 'registration/profile.html', context)


# saved user posts displayed in user profile
def profile_saved(request, pk):
    user_profile = get_object_or_404(Profile, pk=pk)
    saved_posts = request.user.saved_posts.all()

    # paginate posts by 20 items per page
    paginator = Paginator(saved_posts, 20)
    if paginator.num_pages > 1:
        paginated = True
    else:
        paginated = False
    page = request.GET.get('page')
    items = paginator.get_page(page)

    context = {'profile': user_profile, 'items': items, 'paginated': paginated}

    return render(request, 'registration/profile_saved.html', context)


# users which profile's user follows
def profile_following(request, pk):
    user_profile = get_object_or_404(Profile, pk=pk)
    user_following = user_profile.following.all()

    # paginate posts by 40 items per page
    paginator = Paginator(user_following, 40)
    if paginator.num_pages > 1:
        paginated = True
    else:
        paginated = False
    page = request.GET.get('page')
    items = paginator.get_page(page)

    context = {'profile': user_profile, 'items': items, 'paginated': paginated}

    return render(request, 'registration/profile_following.html', context)


# users which profile's user is followed by
def profile_followers(request, pk):
    user_profile = get_object_or_404(Profile, pk=pk)
    user_followers = user_profile.followers.all()

    # paginate posts by 40 items per page
    paginator = Paginator(user_followers, 40)
    if paginator.num_pages > 1:
        paginated = True
    else:
        paginated = False
    page = request.GET.get('page')
    items = paginator.get_page(page)

    context = {'profile': user_profile, 'items': items, 'paginated': paginated}

    return render(request, 'registration/profile_followers.html', context)


def profile_edit(request):
    if request.method == 'POST':
        user_form = UserEditForm(request.POST, instance=request.user)
        profile_form = ProfileEditForm(request.POST, request.FILES, instance=request.user.profile)
        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            return redirect('profile', request.user.pk)

    else:
        user_form = UserEditForm(instance=request.user)
        profile_form = ProfileEditForm(instance=request.user.profile)

    # item_to_delete is a context variable that gets displayed by delete modal
    # url_name is context variable that gets inserted into delete button url tag
    context = {
        'user_form': user_form,
        'profile_form': profile_form,
        'item_to_delete': 'account',
        'url_name': 'profile_delete'
    }

    return render(request, 'registration/profile_edit.html', context)


def profile_delete(request):
    request.user.delete()
    messages.success(request, f'Account with username "{request.user.username}" has been successfully deleted')
    return redirect('home')


# creates an end point for user follow api
class UserFollowAPI(APIView):
    authentication_classes = (authentication.SessionAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, pk):
        profile_to_follow = get_object_or_404(Profile, pk=pk)
        user = self.request.user
        user_profile = self.request.user.profile
        authenticated = False
        following = False

        if user.is_authenticated:
            authenticated = True
            if user_profile in profile_to_follow.followers.all():
                profile_to_follow.followers.remove(user_profile)
                following = False
            else:
                profile_to_follow.followers.add(user_profile)
                following = True

        data = {'authenticated': authenticated, 'following': following}

        # return json data for javascript consumption
        return Response(data)
