from django.urls import path
from . import views

urlpatterns = [
    path('', views.test_resources, name='test_resources'),
    path('/get-stock', views.get_stock, name='get-stock',
    path('/get-player-stocks', views.get_player_stocks, name='get-player-stocks'),
    path('/get-game-instance-stocks', views.get_game_instance_stocks, name='get-game-inst-stocks'),
    path('/player-stock-purchase', views.player_stock_purchase, name='player-stock-purchase')
]