from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('api/', include('api.urls', namespace='api')),
    path('admin/', admin.site.urls),
]
