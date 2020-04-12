from django.db import models

# Create your models here.

class GameInstance(models.Model):
    gamemaster = models.ForeignKey('resources.User', on_delete=models.SET_NULL)
    players = models.ForeignKey('resources.User', on_delete=models.SET_NULL)
    maxTurns = models.IntegerField(default=99)
    current_turn = models.IntegerField(default=0)


