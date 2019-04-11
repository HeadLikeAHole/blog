from django.urls import path

from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path('posts/<slug:slug>/', views.post_detail, name='post_detail'),
    path('post-create/', views.post_create, name='post_create'),
    path('posts/<slug:slug>/edit/', views.post_edit, name='post_edit'),
    path('posts/<slug:slug>/delete/', views.post_delete, name='post_delete'),
    path('posts/<slug:slug>/like/', views.PostLikeAPI.as_view(), name='post_like_api'),
]