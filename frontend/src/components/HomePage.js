import React, {useContext} from 'react'
import {UserContext} from '../contexts/UserContext'
import PlayerHome from '../components/game_view_components/PlayerHome'
import GamemasterHome from './GamemasterHome'


export default function HomePage(props){
    const userContext = useContext(UserContext)
    return (
            <div className="container">
            The Home Page
            { userContext.isGm ? <GamemasterHome /> : <PlayerHome userName={userContext.userName} />}
            </div>
    )
}
