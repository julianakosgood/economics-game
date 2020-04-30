import React from 'react'
import axios from 'axios'
import { gameManagement, resources } from '../../request_utils/request_urls'
import { ResponsiveLine } from '@nivo/line'



const InitGame = (props) => {
    return (
        <div className='box'>
            <label className='label'> Number of game rounds. </label>
            <input className='input' type='text' placeholder='Number of Game Rounds'
            value={props.gameRounds} onChange={props.setGameRounds} />
            <button className='button' onClick={props.createGame}> Create new Game </button>
        </div>
    )
}


const PlayerAssignment = (props) => {
    const playerList = props.availablePlayers.map((player, index) => {
        return <div className='panel-block' onClick={props.assignPlayer.bind(this, player)} key={`available-player-${index}`}>
            <span> {player.username} </span>
        </div>
    })
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
                <td key='header-2'> Starting Value </td>
                <td key='header-3'> Description </td>
            </tr>
        </thead>
    let entries = props.generatedStocks.map((stock, index) => {
        return <tr key={`${stock.name}-row-${index}`} onClick={props.setActiveStock.bind(this, stock)}><td>{stock.name}</td><td>{stock.value}</td><td>{stock.description}</td></tr>
    })
    return (
        <table className='table'>{headers}<tbody>{entries}</tbody></table>
    )
}


const StockCreation = (props) => {
    let chartData = [{'id': 1, data: []}]
    if (props.selectedStock !== null){
        chartData[0].data = props.selectedStock.valuesOverGame
    }
    return (
        <div className='columns'>
            <div className='column'>
                <button className="button" onClick={props.generateNewStocks}> Create new stocks </button>
                <div style={{height: '600px', overflowY: 'scroll'}} className="box">
                    { props.isLoading === true ? <p> Generating stocks... </p> : null}
                <StockTable generatedStocks={props.generatedStocks} setActiveStock={props.setActiveStock}/>
                </div>
            </div>
            <div className='column'>
                <h1 className='title'> Stock info for game instance </h1>
                <div className='box' style={{height: '600px', width: '600px'}}>
                    <ResponsiveLine data={chartData}
                            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                            axisBottom={{
                            orient: 'bottom',
                            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'round number',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'stock value',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        colors={{ scheme: 'nivo' }}
        pointSize={10}
                     /> 
                </div>
            </div>
        </div>
    )
}

const SummaryView = (props) => {
    return (
        <div className='box'> 
        <span> {props.gameSaved !== true ? 'Okay' : 'Your game has been created!'} </span> <br />
        { props.gameSaved !== true ? <button className='button' onClick={props.saveGame}> Okay </button> :
        <button className='button' onClick={props.setGameManagementView} value='home'> Exit creation view </button>
        }
        </div>
    )
}

class GameCreation extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            creationStep: 0,
            gameInstance: '',
            assignedPlayers: [],
            availablePlayers: [],
            availableStocks: [],
            selectedStock: null,
            generatedStocks: [],
            gameSaved: false,
            gameRounds: 15,
        }
        this.totalSteps = 3
    }

    componentDidMount(){
        axios.get(`${gameManagement}/get-available-players`, {}
        ).then(response => {
            this.setState({availablePlayers: response.data['players']})
        })
    }

    setActiveStock = (stock) => {
        console.log(stock)
        this.setState({selectedStock: stock})
    }

    setGameRounds = (e) => {
        let value = e.target.value
        this.setState({gameRounds: value})
    }

    saveGame = () => {
        let data = {
            game: this.state.gameInstance,
            players: this.state.assignedPlayers,
        }
        // TODO: error message to user on failure
        axios.post(`${gameManagement}/save-new-game-instance`, data, {withCredentials: true}).then(
            response => {
                if (response.data['success']){
                    this.setState({gameSaved: true})
                }
        });
    }

    initGame = () => {
        axios.get(`${gameManagement}/create-game-instance`, {params: {username: 'gm_1', gameRounds: this.state.gameRounds}}
        ).then(response => {
            if (response.data){
                this.setState({gameInstance: response.data['gameId'], creationStep: 1})
            }
        }).catch(err => console.log(err))
    }

    selectStock = (stock) => {
        this.setState({selectedStock: stock})
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
        this.setState({'isLoading': true})
        axios.get(`${gameManagement}/generate-stocks`, {params: {'gameInstanceId': this.state.gameInstance}}
        ).then(response => {
            this.setState({isLoading: false, generatedStocks: response.data['generatedStocks']})
        })
    }


    whichView = () => {
        if (this.state.creationStep === 0){
            return <InitGame key={`view-0`} createGame={this.initGame.bind(this)} gameRounds={this.state.gameRounds}
            setGameRounds={this.setGameRounds} />
        } else if (this.state.creationStep === 1){
            return <PlayerAssignment assignPlayer={this.assignPlayer} availablePlayers={this.state.availablePlayers}
            assignedPlayerList={this.state.assignedPlayers} removePlayer={this.removePlayer} />
        } else if (this.state.creationStep === 2){
            return <StockCreation generatedStocks={this.state.generatedStocks} generateNewStocks={this.generateNewStocks} 
            setActiveStock={this.setActiveStock} selectedStock={this.state.selectedStock} isLoading={this.state.isLoading}/>
        } else if (this.state.creationStep === 3){
            return <SummaryView saveGame={this.saveGame} setGameManagementView={this.props.updateManagementView} gameSaved={this.state.gameSaved} />
        }
    }

    render(){
        let currentView = this.whichView()
        return (
        <div className='container'>
            <h1 className='title'> Creating A New Game... </h1>
            <div className='section'> 
            { currentView }
            </div>
            <div className='section'>
                <button className="button" onClick={this.nextView}> Next </button>
                <button className="button" onClick={this.prevView}> Previous </button>
            </div>
        </div>
        )
    }
}

export default GameCreation