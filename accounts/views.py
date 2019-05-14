from django.shortcuts import render, redirect, get_object_or_404, HttpResponse
from django.contrib import messages
from django.contrib.auth import authenticate, login

from .forms import UserRegisterForm, UserEditForm, ProfileEditForm
from .models import Profile


def register(request):
    next_page = request.GET.get('next')
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            messages.success(request, f'Account for {username} has been created! You are now able to log in.')
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
    return render(request, 'registration/profile.html', {'profile': user_profile})


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
    return redirect('home')
