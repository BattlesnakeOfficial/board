import React, { Component } from 'react'
import BoardCanvas from 'components/boardCanvas'
import ControlPanel from 'components/controlPanel'
import GameStatus from 'components/gameStatus'
import './styles.scss'

const sampleData = {
  size: [20, 20],
  snakes: [[[1,1], [1,2], [2,2]], [[5,10], [5,11], [5, 12]]],
  food: [[3,3], [4,4], [10, 18]]
}

class Board extends Component {
  render() {
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
