import React from 'react'
import { gameManagement } from '../../request_utils/request_urls'
import axios from 'axios'

const VIEW_SELECT = 'Select View'
const PLAYER_SUMMARIES = 'Player Summaries'
const PLAYER_EDIT = 'Player Edit'
const GAME_SUMMARY = 'Game Summary'

const ViewSelect = (props) => {
    let options = [PLAYER_SUMMARIES, PLAYER_EDIT, GAME_SUMMARY]
    let optionTiles = options.map((option, index) => {
        return <div className='tile is-parent' key={`${index}`} onClick={props.changeView.bind(this, option)}>
            <div className='tile is-child notification is-info'>
                <p className='title'> {option} </p>
            </div>
        </div>
    })
    return (
        <div className='tile is-ancestor'>
            {optionTiles}
        </div>
    )
}

class GameManagement extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            selectedGame: {},
            currentGames: [],
            selectedGameData: {},
            viewOption: VIEW_SELECT
        }
    }

    componentDidMount(){
        axios.get(`${gameManagement}/get-owned-game-instances`, {params: {gmName: this.props.userName}}).then(
            response => {
                if (response.data){
                this.setState({currentGames: response.data.gameInstances})
                }
            }
        )
    }

    getGameInstanceData = (game) => {
        axios.get(`${gameManagement}/get-game-management-data`, {params: {gameId: game.id}}).then(
            response => {
                if(response.data){
                    console.log(response.data)
                    this.setState({selectedGameData: response.data, selectedGame: game})
                }
            }
        )
    }

    changeView = (option, event) => {
        this.setState({viewOption: option})
    }

    handleGameSelection = (game) => {
        console.log(game)
        this.getGameInstanceData(game)
    }

    getGameOptionView = () => {
        if (this.state.selectedGame.id === undefined){
            return null
        }
        if (this.state.viewOption === PLAYER_EDIT){
            return <div> <button className='button is-primary is-outlined' onClick={e => {this.setState({viewOption: VIEW_SELECT})}}> Back </button></div>
        }
        if (this.state.viewOption === GAME_SUMMARY){
            return <div> <button className='button is-primary is-outlined' onClick={e => {this.setState({viewOption: VIEW_SELECT})}}> Back </button></div>
        }
        if (this.state.viewOption === PLAYER_SUMMARIES){
            return <div> <button className='button is-primary is-outlined' onClick={e => {this.setState({viewOption: VIEW_SELECT})}}> Back </button></div>
        }
        return <ViewSelect changeView={this.changeView} />
    }

    render(){
        let gameList = this.state.currentGames.map(game => {
            return <div key={`game-${game.id}-entry`} className="box" onClick={this.handleGameSelection.bind(this, game)}>
                <h1 className='title'> Game - {game.id} </h1>
            </div>
        })
        return(
            <div className="container">
                <div className="columns">
                    <div className={`column has-background-white-ter ${this.state.selectedGame.id === undefined ? '' : 'is-one-fifth'}`}
                    style={{"height": "800px"}}>
                        <h1 className='title'> Current Games</h1>
                        <div className="card">
                            <div className='card-content' style={{'height': '700px', 'overflowY': 'scroll'}}>
                            {gameList}
                            </div>
                        </div>
                    </div>
                    <div className={`column ${this.state.selectedGame.id === undefined ? '' : 'is-four-fifths'}`} >
                        <h1 className='title'> Game view </h1>
                        <div className="box">
                            <h2 className='title'>Options for Game #{ this.state.selectedGame.id }</h2>
                            { this.getGameOptionView() }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default GameManagement;