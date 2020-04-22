from django.db import models

# Create your models here.

class GameInstance(models.Model):
    gamemaster = models.ForeignKey('resources.User', on_delete=models.DO_NOTHING, related_name='gamemaster')
    players = models.ManyToManyField('resources.User', related_name='players')
    default_money_grant = models.FloatField(default=0.0)
    maxTurns = models.IntegerField(default=15)
    current_turn = models.IntegerField(default=0)


