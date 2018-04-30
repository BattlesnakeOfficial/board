import React, { Component } from 'react'
import BoardCanvas from 'components/boardCanvas'
import ControlPanel from 'components/controlPanel'
import GameStatus from 'components/gameStatus'
import './styles.scss'

const body = {
  "width": 20,
  "height": 20,
  "food": 10,
  "snakes": [
    {
      "name": "snake 1",
      "url": "https://snake1.herokuapp.com",
      "id": ""
    }
  ]
}

const sampleData = {
  size: [20, 20],
  snakes: [[[1,1], [1,2], [2,2]], [[5,10], [5,11], [5, 12]]],
  food: [[3,3], [4,4], [10, 18]]
}

class Board extends Component {
  componentDidMount() {
    fetch('http://localhost:3005/games', {
      body: JSON.stringify(body),
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    })
      .then(response => response.json())
      .then(({ ID }) => {
        console.log(ID)
        this.setState({ID})

        fetch(`http://localhost:3005/games/${ID}`)
          .then(response => response.json())
          .then(json => console.log(json))
          .catch(console.error)

        fetch(`http://localhost:3005/games/${ID}/start`, { method: 'POST' })
          .then(() => console.log('Started Game'))
          .catch(console.error)
      })
      .catch(console.error)

    this._interval = setInterval(() => {
      fetch(`http://localhost:3005/games/${this.state.ID}`)
        .then(response => response.json())
        .then(({Game: {Status}}) => {
          if (Status === 'complete') {
            clearInterval(this._interval)

            fetch(`http://localhost:3005/games/${this.state.ID}/frames`)
              .then(response => response.json())
              .then(json => this.setState(json))
              .catch(console.error)
          }
        })
        .catch(console.error)
    }, 1000)
  }

  render() {
    console.log(this.state)
    return (
      <div className='board'>
        <BoardCanvas {...sampleData} />
        <div className='panel' style={{height: `calc(var(--grid-size) * ${20}`}}>
          <GameStatus />
          <ControlPanel />
        </div>
      </div>
    )
  }
}

export default Board
