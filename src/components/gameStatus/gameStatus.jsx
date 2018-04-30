import React, { Component } from 'react'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import './styles.scss'

const mapStateToProps = (state, {ID}) => {
  console.log(state.games)
  const game = state.games.filter(game => game.ID === ID)[0]

  return { status: game.status }
}

class GameStatus extends Component {
  render() {
    console.log(this.props)
    return (
      <Paper className='gameStatus'>
        <Typography className='typography' variant='headline'>Game Status</Typography>
        <Typography className='typography' variant='caption'>{this.props.status}</Typography>
      </Paper>
    )
  }
}

export default connect(mapStateToProps)(GameStatus)