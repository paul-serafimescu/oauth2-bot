from django.contrib import admin
from django.urls import include, path
from Bot import urls as bot_urls

urlpatterns = [
    path('', include(bot_urls)),
    path('admin/', admin.site.urls),
]
