from django.urls import path, include

from accounts import views


urlpatterns = [
    path('', include('django.contrib.auth.urls')),  # default django auth urls
    path('register/', views.register, name='register'),
    path('profile/<int:pk>/', views.profile, name='profile'),
    path('profile/<int:pk>/saved/', views.profile_saved, name='profile_saved'),
    path('profile/<int:pk>/following/', views.profile_following, name='profile_following'),
    path('profile/<int:pk>/followers/', views.profile_followers, name='profile_followers'),
    path('profile/edit/', views.profile_edit, name='profile_edit'),
    path('profile/delete/', views.profile_delete, name='profile_delete'),
    path('profile/<int:pk>/follow/', views.UserFollowAPI.as_view(), name='user_follow_api'),
]
