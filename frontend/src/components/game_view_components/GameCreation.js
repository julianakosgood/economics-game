import React from 'react'
import axios from 'axios'
import { gameManagement, resources } from '../../request_utils/request_urls'


const InitGame = (props) => {
    return (
        <button className='button' onClick={props.createGame}> Create new Game </button>
    )
}


const SavedGameView = (props) => {
    return (
        <div className='section'>
            <span> The game has been saved. </span>
        </div>
    )
}

const PlayerAssignment = (props) => {
    const playerList = props.availablePlayers.map((player, index) => {
        return <div className='panel-block' onClick={props.assignPlayer.bind(this, player)} key={`available-player-${index}`}>
            <span> {player.username} </span>
        </div>
    })
    console.log(props.assignedPlayerList)
    const assignedPlayerList = props.assignedPlayerList.map((player, index) => {
        return <div className='planel-block' onClick={props.removePlayer.bind(this, player)} key={`assigned-player-${index}`}>
            <span> {player.username} </span>
        </div>
    })
    return (
        <div className='columns'>
            <div className='column'>
                <nav className='panel'>
                    <p className='panel-heading'> Available Players </p>
                    { playerList }
                </nav>
            </div>
            <div className='column'>
                <nav className='panel'>
                    <p className='panel-heading'> Assigned Players </p>
                    { assignedPlayerList }
                </nav>
            </div>
        </div>
    )
}


const StockTable = (props) => {
    let headers = <thead> 
            <tr key='header-rows'> 
                <td key='header-1'> Name </td> 
                <td key='header-2'> Value </td>
                <td key='header-3'> Description </td>
            </tr>
        </thead>
    let entries = props.generatedStocks.map((stock, index) => {
        return <tr key={`${stock.name}-row-${index}`}> <td> {stock.name} </td> <td> {stock.value} </td> <td> {stock.description} </td></tr>
    })
    return (
        <table className='table'>
            {headers}
            {entries}
        </table>
    )
}


const StockCreation = (props) => {
    return (
        <div className='columns'>
            <div className='column'>
                <button onClick={props.generateNewStocks}> Create new stocks </button>
                <StockTable generatedStocks={props.generatedStocks} />
            </div>
            <div className='column'>
                <h1 className='title'> Stock info for game instance </h1>
                <div> Placeholder for graph </div>
            </div>
        </div>
    )
}

const SummaryView = (props) => {
    return (
        <div className='section'> 
        <span> Summary data for game </span>
        <button onClick={props.saveGame}> Start/Save Game </button>
        </div>
    )
}

class GameCreation extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            creationStep: 0,
            gameInstance: {},
            assignedPlayers: [],
            availablePlayers: [],
            availableStocks: [],
            selectedStocks: [],
            generatedStocks: [],
            gameSaved: false
        }
        this.totalSteps = 4
    }

    componentDidMount(){
        axios.get(`${gameManagement}/get-available-players`, {}
        ).then(response => {
            this.setState({availablePlayers: response.data['players']})
        })
    }

    saveGame = () => {
        let data = {
            game: this.state.gameInstance,
            players: this.state.assignedPlayers,
            stocks: this.state.selectedStocks
        }
        // TODO: error message to user on failure
        axios.post(`${gameManagement}/save-new-game-instance`, data).then(
            response => {
                if (response.data['success']){
                    this.setState({gameSaved: true})
                }
        });
    }

    initGame = () => {
        axios.get(`${gameManagement}/create-game-instance`, {params: {username: 'gm_1'}}
        ).then(response => {
            if (response.data){
                this.setState({gameInstance: response.data['gameId'], creationStep: 1})
            }
        }).catch(err => console.log(err))
    }

    selectStock = (e) => {
        console.log(e)
    }

    nextView = () => {
        this.setState((state) => { 
            let creationStep = state.creationStep < this.totalSteps ? state.creationStep + 1 : state.creationStep
            return {creationStep}
        })
    }

    prevView = () => {
        this.setState((state) => { 
            let creationStep = state.creationStep > 0 ? state.creationStep - 1 : state.creationStep
            return {creationStep}
        })
    }

    assignPlayer = (player, e) => {
        let assignedPlayers = this.state.assignedPlayers
        assignedPlayers.push(player)
        let availablePlayers = this.state.availablePlayers.filter((availPlayer) => {
            return player !== availPlayer
        })
        this.setState({assignedPlayers, availablePlayers})
    }

    removePlayer = (player, e) => {
        let assignedPlayers = this.state.assignedPlayers.filter((assignedPlayer => {
            return assignedPlayer !== player
        }))
        let availablePlayers = this.state.availablePlayers
        availablePlayers.push(player)
        this.setState({assignedPlayers, availablePlayers})

    }

    generateNewStocks = () => {
        axios.get(`${resources}/generate-stocks`, {}
        ).then(response => {
            this.setState({generatedStocks: response.data['generatedStocks']})
        })
    }


    whichView = () => {
        if (this.state.creationStep === 0){
            return <InitGame key={`view-0`} createGame={this.initGame.bind(this)} />
        } else if (this.state.creationStep === 1){
            return <PlayerAssignment assignPlayer={this.assignPlayer} availablePlayers={this.state.availablePlayers}
            assignedPlayerList={this.state.assignedPlayers} removePlayer={this.removePlayer} />
        } else if (this.state.creationStep === 2){
            return <StockCreation generatedStocks={this.state.generatedStocks} generateNewStocks={this.generateNewStocks} 
            selectStock={this.selectStock} />
        } else if (this.state.creationStep === 3){
            return <SummaryView saveGame={this.saveGame} />
        } else if (this.state.gameSaved){
            return <SavedGameView />
        }
    }

    render(){
        console.log(this.state)
        let currentView = this.whichView()
        return (
        <div className='container'>
            <h1 className='title'> Creating A New Game... </h1>
            <div className='section'> 
            { currentView }
            </div>
            <div className='section'>
                <button onClick={this.nextView}> Next </button>
                <button onClick={this.prevView}> Previous </button>
            </div>
        </div>
        )
    }
}

export default GameCreation