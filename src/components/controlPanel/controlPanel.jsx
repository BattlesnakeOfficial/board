import React, { Component } from 'react'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import { updateGame } from 'actions/games'
import { playFrames } from 'actions/board'
import './styles.scss'

const mapStateToProps = (state, {ID}) => {
  const game = state.games.filter(game => game.ID === ID)[0]

  return { status: game.status, Frames: game.Frames }
}

class ControlPanel extends Component {
  _start = () => {
    fetch(`http://localhost:3005/games/${this.props.ID}/start`, { method: 'POST' })
      .then(() => this.props.updateGame({ID: this.props.ID, status: 'starting'}))
      .catch(console.error)

    this._interval = setInterval(() => {
      fetch(`http://localhost:3005/games/${this.props.ID}`)
        .then(response => response.json())
        .then(({Game: {Status}}) => {
          if (Status === 'complete') {
            clearInterval(this._interval)
            this.props.updateGame({ID: this.props.ID, status: 'complete'})

            fetch(`http://localhost:3005/games/${this.props.ID}/frames`)
              .then(response => response.json())
              .then(json => {
                console.log(json)
                this.props.updateGame({ ID: this.props.ID, ...json })
              })
              .catch(console.error)
          } else {
            this.props.updateGame({ID: this.props.ID, status: Status})
          }
        })
        .catch(console.error)
    }, 1000)
  }

  _replay = () => this.props.playFrames(this.props.Frames)

  render() {
    return (
      <Paper className='controlPanel'>
        <Typography className='typography' variant='headline'>Controls</Typography>
        <Button disabled={this.props.status !== 'stopped'} onClick={this._start} variant='raised'>Start Game</Button>
        <Button disabled={this.props.status !== 'complete'} onClick={this._replay} variant='raised'>Replay</Button>
      </Paper>
    )
  }
}

export default connect(mapStateToProps, { updateGame, playFrames })(ControlPanel)