import React from 'react'
import GameCreation from './game_view_components/GameCreation'

function ViewSelection(props){
    // list of tuples containing the key and button text
    let viewChoices = [['create', 'Create A New Game'], ['players', 'Manage by player'], ['games', 'Manage by game']]
    const components = viewChoices.map((choice) => {
        return (<button className="button" value={choice[0]} key={choice[0]} onClick={props.updateManagementView}> {choice[1]} </button>)
    })
    return (<div> {components}</div>)
}


function Players(props){
    return (<div> players </div>)
}

function Games(props){
    return (<div> Games </div>)
}

class GamemasterHome extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            currentView: null
        }
    }
    updateManagementView = (e) => {
        this.setState({currentView: e.target.value})
    }
    whichView = () => {
        let stateView = this.state.currentView
        if (stateView === 'players') {
            return <Players />
        } else if (stateView === 'games'){
            return <Games />
        } else if (stateView === 'create'){
            return <GameCreation updateManagementView={this.updateManagementView} />
        } else {
            return <ViewSelection updateManagementView={this.updateManagementView} />
        }
    }
    render(){
        const view = this.whichView()
        return (
            <div className="container">
                <h1 className="title"> Gamemaster Page </h1>
                { view }
            </div>
        )
    }
}

export default GamemasterHome