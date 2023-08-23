from django.contrib import admin
from django.urls import include, path

admin.site.site_header = "Grocket administration"

urlpatterns = [
    path("api/v1/messenger/", include("messenger.urls", namespace="messenger")),
    path("api/", include("api.urls", namespace="api")),
    path("admin/", admin.site.urls),
]


handler500 = "rest_framework.exceptions.server_error"
handler400 = "rest_framework.exceptions.bad_request"
