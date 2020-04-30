import React from 'react'
import GameCreation from './game_view_components/GameCreation'
import { Link } from 'react-router-dom'

function ViewSelection(props){
    // list of tuples containing the key and button text
    let viewChoices = [['create', 'Create A New Game'], ['players', 'Manage Players'], ['games', 'Manage Games']]
    const components = viewChoices.map((choice) => {
        if (choice[0] === 'games'){
            return <Link key={choice[0]} to='/gm-views/game-management' className='button is-outlined'> Manage Games </Link>
        }
        return (
            <div className="field" key={choice[0]}>
        <button className="button is-outlined" value={choice[0]} onClick={props.updateManagementView}> {choice[1]} </button>
        </div>
        )
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