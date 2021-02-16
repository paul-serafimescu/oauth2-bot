from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('guilds', views.get_commands, name='guild_commands'),
    path('create/command', views.create_command, name='create_command'),
    path('edit/command', views.change_command_status, name='edit-command'),
    path('delete/command', views.delete_command, name='delete-command'),
]