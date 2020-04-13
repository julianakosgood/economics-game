from django.http import HttpResponse
from django.shortcuts import render



def test_resources(request):
    return HttpResponse("working")


def get_stock(request):
    pass


def get_player_stocks(request):
    pass


def get_game_instance_stocks(request):
    pass


def player_stock_purchase(request):
    pass