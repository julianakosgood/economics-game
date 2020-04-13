from django.urls import path
from . import views

urlpatterns = [
    path('', views.test_game_management, name='test-game-management'),
    path('create-game-instance', views.create_game_instance, name='create-game-instance'),
    path('assign-players', views.assign_players, name='assign-players'),
    path('increment-game-round', views.increment_game_round, name='increment-game-round'),
    path('generate-stocks', views.generate_stocks, name='generate-stocks'),
    path('give-money-to-players', views.give_money_to_players, name='give-money'),
    path('end-game-instance', views.end_game_instance, name='end-game-instance'),
    path('get-available-players', views.get_available_players, name='get-available-players')
]