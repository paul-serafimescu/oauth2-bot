from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import *
from django.views.decorators.csrf import csrf_exempt
import json
from django.core import serializers

BASE_URL = "https://discord.com/api/v6"

def index(request):
    return HttpResponse("hello, world!")

def get_commands(request):
    guild_id, name = request.GET['id'], request.GET['name']
    try: # guild exists
        guild = Guild.objects.get(guild_id=guild_id)
        query_items = list(guild.command_set.all().values())
        return JsonResponse({'data': query_items}, safe=False)
    except: # guild doesn't exist
        new_guild = Guild(guild_id=guild_id, name=name)
        new_guild.save()
        return JsonResponse({'data': []}, safe=False)

@csrf_exempt
def create_command(request):
    if request.method == 'POST':
        request_body = json.loads(request.body)
        command_name, guild_id, payload = request_body['name'], request_body['guild_id'], request_body['data']
        new_command = Command(name=command_name, payload=payload, status=True, guild=Guild.objects.get(guild_id=guild_id))
        new_command.save()
        return JsonResponse(new_command.serialize(), safe=False)
    return HttpResponse('no')

@csrf_exempt
def change_command_status(request):
    if request.method == 'PATCH':
        request_body = json.loads(request.body)
        command_id, command_status = request_body['id'], request_body['status']
        cmd = Command.objects.get(pk=command_id)
        cmd.status = command_status
        cmd.save()
        return HttpResponse()
    return HttpResponse('no')

@csrf_exempt
def delete_command(request):
    if request.method == 'DELETE':
        request_body = json.loads(request.body)
        command_name, guild_name = request_body['cmd_name'], request_body['guild_name']
        cmd = Guild.objects.get(name=guild_name).command_set.get(name=command_name)
        cmd.delete()
        return HttpResponse()
    return HttpResponse('no')

