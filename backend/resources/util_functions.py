from resources.models import User, Stock


TEST_USERS = [
    {'username': 'gm_1', 'password': 'gm_pass_1', 'is_superuser':True, 'is_gamemaster':True},
    {'username': 'player_1', 'password': 'player_1_pass', 'is_gamemaster':False},
    {'username': 'player_2', 'password': 'player_2_pass', 'is_gamemaster': False}
]

def generate_test_user_base():
    try: 
        for user in TEST_USERS:
            new_user = User(**user)
            new_user.set_password(user['password'])
            new_user.save()
    except Exception as e:
        print(f'Failed to generate users\n {str(e)}\n')
        return 0
    return 1

    