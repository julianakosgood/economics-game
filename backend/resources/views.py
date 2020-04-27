from django.http import HttpResponse, JsonResponse
from .models import Stock, PlayerPurchase, User
from game_management.models import GameInstance
from json import loads



def test_resources(request):
    return HttpResponse("working")


def get_stock(request):
    pass


def get_player_home_data(request):
    player = User.objects.filter(username=request.GET.get('playerUsername')).first()
    instance = GameInstance.objects.filter(players=player).first()
    stocks_owned = PlayerPurchase.objects.filter(player=player).all()
    stocks = []
    for stock in stocks_owned:
        temp = stock.stock.as_dict()
        temp.update({'num_owned': stock.num_owned})
        stocks.append(temp)
    player = {field.name: getattr(player, field.name) for field in player._meta.fields}
    _ = player.pop('password')
    availableStocks = Stock.objects.filter(game_instance__id=instance.id, round_number=instance.current_turn)
    gameStocks = [stock.as_dict() for stock in availableStocks]
    instance = {field.name: getattr(instance, field.name) for field in instance._meta.fields}
    #instance.pop('players')
    instance.pop('gamemaster')
    return JsonResponse({'gameInstance': instance, 'stocks': stocks, 'playerInfo': player, 'availableStocks': gameStocks})


def get_player_stocks(request):
    pass

def get_player_stock_options(request):
    pass


def buy_player_stock(request):
    data = loads(request.body)
    player = User.objects.filter(id=data.get('playerId')).first()
    stock = Stock.objects.filter(id=data.get('stockId')).first()
    try:
        player.currency_balance -= stock.value
        player.save()
        purchase = PlayerPurchase.objects.filter(player=player, stock=stock).first()
        if purchase is not None:
            purchase.num_owned += 1
        else:
            purchase = PlayerPurchase(player=player, stock=stock)
        purchase.save()
    except Exception as e:
        print(e)
        JsonResponse({'success': False})
    return JsonResponse({'success': True})


def sell_player_stock(request):
    data = loads(request.body)
    player = User.objects.filter(id=data.get('playerId')).first()
    stock = Stock.objects.filter(id=data.get('stockId')).first()
    try:
        player.currency_balance += stock.value
        player.save()
        purchase = PlayerPurchase.objects.filter(player=player, stock=stock).first()
        if purchase is not None:
            if purchase.num_owned > 1:
                purchase.num_owned -= 1
                purchase.save()
            else:
                purchase.delete()
    except Exception as e:
        print(e)
        JsonResponse({'success': False})
    return JsonResponse({'success': True})




def player_stock_purchase(request):
    pass