import React from 'react'
import { gameManagement } from '../../request_utils/request_urls'
import axios from 'axios'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'


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


const GameSummary = (props) => {

    let playerData = props.players.map(player => {
        let currency = player.currency_balance
        if (player.stocks.length < 1){
            return {id: player.username, data: [{'x': currency, 'y': 0}]}
        }
        let netWorth = player.stocks.reduce((total, stock) => total + stock.value)
        return {id: player.username, data: [{'x': currency, 'y': netWorth}]}
    })
    return (
        <div className='container'>
                <nav className='level'>
                    <div className='level-item has-text-centered'>
                        <div>
                        <p className='heading'> Game Progress </p> <br />
                        <p className='title'> { props.gameInstance.current_turn} of {props.gameInstance.maxTurns} </p>
                        </div>
                    </div>
                    <div className='level-item has-text-centered'>
                        <div>
                        <p className='heading'> Money to players each turn </p>
                        <p className='title'> {props.gameInstance.default_money_grant} </p>
                        </div>
                    </div>
                </nav>
                <nav className='level'>
                    <div className='level-item has-text-centered'>
                        <p className='title'> Actions </p>
                    </div>
                </nav>
                <nav className='level'>
                    <div className='level-item has-text-centered'>
                                <button className='button is-primary is-outlined' onClick={props.nextGameTurn}> Start next turn </button>
                    </div>
                </nav>
                <nav className='level'>
                    <div className='level-item'>
                <div className='box' style={{height: 400, width: 400}}>
                    <h4 className='heading'> Player Finances </h4>
                    <ResponsiveScatterPlot data={playerData} 
                            margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                            //yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                            axisBottom={{
                            orient: 'bottom',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Player Currency Balance',
                            legendOffset: 36,
                            legendPosition: 'middle'
                        }}
                            axisLeft={{
                            orient: 'left',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Player Net Worth',
                            legendOffset: -40,
                            legendPosition: 'middle'
                        }}
                            colors={{ scheme: 'nivo' }}
                            pointSize={10}
                    />
                </div>
                </div>
                </nav>
                
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
                    this.setState({selectedGameData: response.data, selectedGame: game})
                }
            }
        )
    }

    refreshGames = () => {
        axios.get(`${gameManagement}/get-owned-game-instances`, {params: {gmName: this.props.userName}}).then(
            response => {
                if (response.data){
                    this.setState({currentGames: response.data.gameInstances})
                }
            }
        )
    }

    changeView = (option, event) => {
        this.setState({viewOption: option})
    }

    handleGameSelection = (game) => {
        this.getGameInstanceData(game)
    }

    nextGameTurn = () => {
        axios.get(`${gameManagement}/increment-game-turn`, {params: {gameId: this.state.selectedGame.id}}).then(
            response => {
                if (response.data.success === false){
                    console.log('error')
                }
            }
        )
    }

    getGameOptionView = () => {
        let backButton = <div style={{'paddingTop': '25px'}}><button className='button is-primary is-outlined' onClick={e => {this.setState({viewOption: VIEW_SELECT})}}> Back </button></div>
        if (this.state.selectedGame.id === undefined){
            return null
        }
        if (this.state.viewOption === PLAYER_EDIT){
            return <div> {backButton} </div>
        }
        if (this.state.viewOption === GAME_SUMMARY){
            return <div> 
                <GameSummary players={this.state.selectedGameData.players} stocks={this.state.selectedGameData.stocks}
                gameInstance={this.state.selectedGame} nextGameTurn={this.nextGameTurn} />
                {backButton}
                </div>
        }
        if (this.state.viewOption === PLAYER_SUMMARIES){
            return <div> {backButton} </div>
        }
        return <ViewSelect changeView={this.changeView} />
    }

    render(){
        let gameList = this.state.currentGames.map(game => {
            return <div key={`game-${game.id}-entry`} className="box" onClick={this.handleGameSelection.bind(this, game)}>
                <h4 className='title'> Game - {game.id} </h4>
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