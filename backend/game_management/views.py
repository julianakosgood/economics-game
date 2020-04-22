from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import GameInstance
from resources.models import User, Stock
import random
from json import loads


def test_game_management(request):
    return HttpResponse("working")


def create_player(request):
    pass


def create_admin(request):
    pass


def create_game_instance(request):
    # set a game master User
    game_master = User.objects.filter(username=request.GET.get('username')).first()
    game_instance = GameInstance(gamemaster=game_master, maxTurns=request.GET.get('gameRounds'))
    game_instance.save()
    return JsonResponse({'gameId': game_instance.id})
    # set game rounds

    # return the game instance id for game config


def save_new_game_instance(request):
    data = loads(request.body)
    print(data)
    player_ids = [player['id'] for player in data.get('players')]
    player_objects = User.objects.filter(id__in=player_ids).all()
    game = GameInstance.objects.filter(id=data.get('game')).first()
    try:
        for player in player_objects:
            game.players.add(player)
    except Exception as e:
        print(e)
        return JsonResponse({'sucess': False})
    return JsonResponse({'success': True})


def assign_players(request):
    pass


def increment_game_round(request):
    pass


def generate_stocks(request):
    '''
    Generate a stock dataset for the passed GameInstance id.
    '''
    game_id = request.GET.get('gameInstanceId')
    game_instance = GameInstance.objects.get(id=game_id)
    stocks = generate_random_stocks(game_instance)
    return JsonResponse({'generatedStocks': stocks})


def generate_random_stocks(game_instance: GameInstance):
    '''
    Make a stock set with random values. Used if stock api cannot be accessed.
    '''
    trend = ['down', 'up']
    stocks = []
    for num in range(1, 101):
        value = random.uniform(0.10, 1.0) * 100
        prob_value = random.gauss(0.5, 0.2)
        risk_level = 'high' if (prob_value < .3 or prob_value > .7) else 'low'
        trend_prob = random.gammavariate(0.5, 0.5)
        trend_value = random.choice(trend) if (risk_level == 'high' or trend_prob > 0.4) else 'stable'
        stock = Stock(value=value, game_instance=game_instance,
                description=f'Stock {num} \n - Randomly generated \n - A {risk_level} risk stock.\n', name=f'Stock {num}',
                round_number=0, trend_value=trend_value, risk_rating=risk_level)
        try:
            stock.save()
            stocks.append(stock.as_dict())
        except Exception as e:
            print(f'failed to save stock {num} for game {game_instance.id}\n{e}')
    for stock in stocks:
        # generate values over time
        const_data = {'game_instance': game_instance, 'description': stock['description'],
        'name': stock['name']}
        stock['valuesOverGame'] = []
        for round_number in range(1, game_instance.maxTurns):
            next_stock = Stock(**const_data)
            next_stock.value = determine_next_stock_value(stock)
            next_stock.round_number = round_number
            try:
                next_stock.save()
            except Exception as e:
                print(f'Failed to save iterative stock {num} for {game_instance.id} \n {e}')
            stock['valuesOverGame'].append({'x': round_number, 'y': next_stock.value})
    return stocks


def determine_next_stock_value(stock):
    # high variability if the stock is high risk, low otherwise
    std_deviation = .5 if stock['risk_rating'] == 'high' else .15
    if stock['trend_value'] == 'stable':
        return (stock['value'] * random.gauss(0, 0.1)) + stock['value']
    if stock['trend_value'] == 'low':
        return (stock['value'] * random.gauss(-0.1, std_deviation)) + stock['value']
    return (stock['value'] * random.gauss(.1, std_deviation) + stock['value'])
    
    


def give_money_to_players(request):
    pass


def end_game_instance(request):
    pass


def get_available_players(request):
    players = list(User.objects.filter(is_gamemaster=False).all().values())
    for player in players:
        del player['password']
    return JsonResponse({'players': players})