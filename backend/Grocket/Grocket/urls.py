from django.contrib import admin
from django.urls import include, path

admin.site.site_header = "Grocket administration"

urlpatterns = [
    path("api/", include("api.urls", namespace="api")),
    path("admin/", admin.site.urls),
]
