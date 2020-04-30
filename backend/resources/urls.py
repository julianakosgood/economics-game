from django.urls import path
from . import views

urlpatterns = [
    path('', views.test_resources, name='test_resources'),
    path('get-stock', views.get_stock, name='get-stock'),
    path('get-player-home-data', views.get_player_home_data, name='get-player-home-data'),
    path('get-player-stocks', views.get_player_stocks, name='get-player-stocks'),
    path('player-stock-purchase', views.player_stock_purchase, name='player-stock-purchase'),
    path('get-player-stock-options', views.get_player_stock_options, name='player-stock-options'),
    path('buy-player-stock', views.buy_player_stock, name='buy-player-stock'),
    path('sell-player-stock', views.sell_player_stock, name='sell-player-stock'),
]