from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages

from .forms import UserRegisterForm, UserEditForm, ProfileEditForm
from .models import Profile


def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account for {username} has been created! You are now able to log in.')
            return redirect('login')

    else:
        form = UserRegisterForm()

    return render(request, 'registration/register.html', {'form': form})


def profile(request, pk):
    profile = get_object_or_404(Profile, pk=pk)
    return render(request, 'registration/profile.html', {'profile': profile})


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
