from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    is_gamemaster = models.BooleanField(default=False)
    currency_balance = models.FloatField(default=0.0)


class Stock(models.Model):
    value = models.FloatField(default=0.00)
    name = models.TextField()
    description = models.TextField()
    game_instance = models.ForeignKey('game_management.GameInstance', on_delete=models.SET_NULL)
    # the round the stock belongs to, the round determines the stock value
    round_number = models.IntegerField(default=0)


class PlayerPurchase(models.Model):
    '''
    Links a player purchase to a stock value.
    '''
    player = models.ForeignKey('resources.User', on_delete=models.SET_NULL)
    stock = models.ForeignKey('resources.Stock', on_delete=models.SET_NULL)
    num_owned = models.IntegerField(default=1)

