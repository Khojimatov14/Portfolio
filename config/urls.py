"""
URL configuration for config project.
"""
from django.contrib import admin
from django.urls import include, path
from django.views.generic.base import RedirectView
from django.urls import re_path
from django.contrib.staticfiles.storage import staticfiles_storage

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('portfolio.urls')),
    re_path(r'^favicon\.ico$', RedirectView.as_view(
        url=staticfiles_storage.url('portfolio/favicon.png'),
        permanent=True
    )),
]
