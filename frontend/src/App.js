import React from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar'
import LoginPage from './components/LoginPage'
import UserSettings from './components/UserSettings'
import HomePage from './components/HomePage'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {UserContext} from './contexts/UserContext';
import PrivateRoute from './components/util_wrappers/PrivateRoute'
import { gameManagement } from './request_utils/request_urls';
import GameManagement from './components/game_view_components/GameManagement'
import PlayerHome from './components/game_view_components/PlayerHome'

class App extends React.Component {
    constructor(props){
        super(props);

        // This will be replaced with an actual login
        this.setAuth = () => {
            this.setState((state) => ({
                // flip current auth value. simple way to fake logging in and out
                isAuth: (state.isAuth ? false : true),
                userName: (state.userName.length > 0 ? '' : 'player_1'),
                isGm: false
            }));
        };
        // default state for user context.
        this.state = { isAuth: false, userName: '', setAuth: this.setAuth, isGm: false};
    }
    render(){
        return (
            <div className="App">
                <Router>
                    <UserContext.Provider value={this.state}>
                        <NavBar />
                    </UserContext.Provider>
                    <Switch>
                        <Route path="/login">
                            <UserContext.Provider value={this.state}>
                                <LoginPage />
                            </UserContext.Provider>
                        </Route>
                        <PrivateRoute path="/user-settings" isAuth={this.state.isAuth}>
                            <UserSettings />
                        </PrivateRoute>
                        <PrivateRoute path="/gm-views/game-management" userName={this.state.userName} isAuth={this.state.isAuth}>
                            <GameManagement userName={this.state.userName} />
                        </PrivateRoute>
                        <PrivateRoute path="/player-home" userName={this.state.userName} isAuth={this.state.isAuth}>
                            <PlayerHome userName={this.state.userName} />
                        </PrivateRoute>
                        <PrivateRoute path="/" isAuth={this.state.isAuth}>
                            <UserContext.Provider value={this.state}>
                                <HomePage />
                            </UserContext.Provider>
                        </PrivateRoute>
                    </Switch>
                </Router>

            </div>
        );
    }
}

export default App;
