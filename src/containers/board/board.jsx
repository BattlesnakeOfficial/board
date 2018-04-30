import React, { Component } from 'react'
import BoardCanvas from 'components/boardCanvas'
import ControlPanel from 'components/controlPanel'
import GameStatus from 'components/gameStatus'
import './styles.scss'

class Board extends Component {
  componentDidMount() {
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
