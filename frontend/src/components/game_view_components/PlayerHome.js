import axios from 'axios'
import { resources } from '../../request_utils/request_urls'
import React from 'react'


class PlayerHome extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            availableStocks: [],
            playerInfo: {},
            gameInstance: {},
            ownedStocks: []
        }
    }

    componentDidMount(){
        axios.get(`${resources}/get-player-home-data`, {params: {playerUsername: this.props.userName}}).then(
            response => {
                if (response.data){
                    console.log(response.data)
                    this.setState({
                        ownedStocks: response.data.stocks,
                        playerInfo: response.data.playerInfo,
                        gameInstance: response.data.gameInstance,
                        availableStocks: response.data.availableStocks
                    });
                }
            }
        );
    }

    buyStock = (selectedStock) => {
        let stockId = selectedStock.id
        axios.post(`${resources}/buy-player-stock`, {playerId: this.state.playerInfo.id, stockId}).then(
            response => {
                if (response.data.success === false){
                    console.log(response.data)
                }
            }
        )
    }

    sellStock = (selectedStock) => {
        let stockId = selectedStock.id
        axios.post(`${resources}/sell-player-stock`, {playerId: this.state.playerInfo.id, stockId}).then(
            response => {
                console.log(response)
            }
        )
    }

    render(){
        let currencyBalance = this.state.playerInfo === undefined ? 0.00 : this.state.playerInfo.currency_balance
        let ownedStocks = this.state.ownedStocks.map((stock, index) => {
            return <li key={`player-owned-stock-${index}`}> 
                <p> {stock.name}: ${stock.value} x{stock.num_owned}</p>
                <button onClick={this.sellStock.bind(this, stock)} className='button is-error is-outlined'> Sell </button>
            </li>
        })
        let availableStocks = this.state.availableStocks.map((stock, index) => {
            return <li key={`player-purchase-stock-${index}`}>
                <p> {stock.name}: ${stock.value}</p>
                <button onClick={this.buyStock.bind(this, stock)} className='button is-warning is-outlined'> Purchase </button>
            </li>
        })
        return (
            <div className='container'>
                Player View
                <div className='columns'>
                    <div className='column'>
                        <h4 className='title'>Info</h4>
                        <div className='box'>
                            <p className='title'>
                                Current Balance
                            </p>
                            <p className='subtitle'> {currencyBalance} </p>
                        </div>
                        <div className='box' style={{'height': '400px', 'overflowY': 'scroll'}}>
                            <p className='titel'> Stocks Owned </p>
                            <ul> {ownedStocks} </ul>
                        </div>
                    </div>
                    <div className='column'>
                        <h4 className='title'>Actions</h4>
                        <div className='box'>
                            <p className='title'> Buy Stock </p>
                            <ul style={{'height': '400px', 'overflowY': 'scroll'}}> {availableStocks} </ul>
                        </div>
                    </div>
                </div>
           </div>
        )
    }

}

export default PlayerHome