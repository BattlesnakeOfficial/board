import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import './styles.scss'

class GameStatus extends Component {
  render() {
    return (
      <Paper className='gameStatus'>
        <Typography className='typography' variant='headline'>Game Status</Typography>
      </Paper>
    )
  }
}

export default GameStatus