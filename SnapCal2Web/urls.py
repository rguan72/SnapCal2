from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('API/img_process', views.ProcessImageResponse.as_view(), name='process_image'),
]
