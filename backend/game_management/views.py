from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import GameInstance
from resources.models import User


def test_game_management(request):
    return HttpResponse("working")


def create_player(request):
    pass


def create_admin(request):
    pass


def create_game_instance(request):
    # set a game master User
    print(request.GET.get('username'))
    game_master = User.objects.filter(username=request.GET.get('username')).first()
    game_instance = GameInstance(gamemaster=game_master)
    game_instance.save()
    return JsonResponse({'gameId': game_instance.id})
    # set game rounds

    # return the game instance id for game config
    pass


def save_new_game_instance(request):
    # get game instance id from request
    # assign players and stocks to game instance
    # save instance
    pass


def assign_players(request):
    pass


def increment_game_round(request):
    pass


def generate_stocks(request):
    pass


def give_money_to_players(request):
    pass


def end_game_instance(request):
    pass


def get_available_players(request):
    players = list(User.objects.filter(is_gamemaster=False).all().values())
    for player in players:
        del player['password']
    return JsonResponse({'players': players})