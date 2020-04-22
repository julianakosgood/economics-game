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
    game_instance = models.ForeignKey('game_management.GameInstance', on_delete=models.DO_NOTHING)
    # the round the stock belongs to, the round determines the stock value
    round_number = models.IntegerField(default=0)
    risk_rating = models.TextField(default='low')
    trend_value = models.TextField(default='stable')

    def as_dict(self):
        fields = self._meta.fields
        return {field.name: getattr(self, field.name) for field in fields if field.name is not 'game_instance'}



class PlayerPurchase(models.Model):
    '''
    Links a player purchase to a stock value.
    '''
    player = models.ForeignKey('resources.User', on_delete=models.DO_NOTHING)
    stock = models.ForeignKey('resources.Stock', on_delete=models.DO_NOTHING)
    num_owned = models.IntegerField(default=1)

