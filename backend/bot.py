import os
import django
import discord
from backend import settings
from asgiref.sync import sync_to_async

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from Bot.models import Command, Guild

class Bot(discord.Client):
    @staticmethod
    def binary_search(queryset, left, right, value):
        if left > right: return None
        mid = (left + right) // 2
        if queryset[mid].name == value: return queryset[mid]
        if queryset[mid].name > value: return Bot.binary_search(queryset, left, mid - 1, value)
        return Bot.binary_search(queryset, mid + 1, right, value)

    @sync_to_async
    def get_command(self, guild_name, command_name, *args, **kwargs):
        try:
            cmds = Guild.objects.get(name=guild_name).command_set.filter(status=True).order_by('name')
            return Bot.binary_search(cmds, 0, len(cmds) - 1, command_name)
        except:
            return None

    @sync_to_async
    def help(self, guild_name, *args, **kwargs):
        return '\n'.join([command.name for command in Guild.objects.get(name=guild_name).command_set.filter(status=True).order_by('name')])


client = Bot()
token = settings.DISCORD_BOT_TOKEN
prefix = '$'

@client.event
async def on_ready():
    print(f'{client.user} is ready!')

@client.event
async def on_message(message: discord.Message):
    if not message.content or message.content[0] != prefix: return
    msg = message.content.split()[0]
    command = msg[1:]
    if command == 'help': return await message.channel.send(await client.help(message.guild.name))
    cmd = await client.get_command(message.guild.name, command)
    if cmd: return await message.channel.send(cmd.payload)

client.run(token)