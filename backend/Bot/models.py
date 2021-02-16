from django.db import models

"""
HOW TO GET COMMANDS FOR GIVEN GUILD
-------------------------------------
Guild.objects.get(*some filter value (likely id)*).command_set.all()

AND LIKEWISE GUILD FOR COMMAND
-------------------------------------
Command.objects.[whatever].guild
"""

class Guild(models.Model):
    guild_id = models.CharField(max_length=18)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Command(models.Model):
    name = models.CharField(max_length=150)
    payload = models.CharField(max_length=300)
    status = models.BooleanField()
    guild = models.ForeignKey(to=Guild, on_delete=models.CASCADE)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'payload': self.payload,
            'status': self.status
        }

    def __str__(self):
        return f"{self.name} : {self.guild}"
