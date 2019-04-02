from django.urls import path, include

from accounts import views


urlpatterns = [
    path('', include('django.contrib.auth.urls')),
    path('register/', views.register, name='register'),
    path('profile/<int:pk>/', views.profile, name='profile'),
    path('profile/edit/', views.profile_edit, name='profile_edit'),
]
