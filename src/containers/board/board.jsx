import React, { Component } from 'react'
import BoardCanvas from 'components/boardCanvas'
import ControlPanel from 'components/controlPanel'
import GameStatus from 'components/gameStatus'
import './styles.scss'

class Board extends Component {
  render() {
    return (
      <div className='board'>
        <BoardCanvas />
        <div className='panel' style={{height: `calc(var(--grid-size) * ${20}`}}>
          <GameStatus ID={this.props.match.params.id} />
          <ControlPanel ID={this.props.match.params.id} />
        </div>
      </div>
    )
  }
}

export default Board
