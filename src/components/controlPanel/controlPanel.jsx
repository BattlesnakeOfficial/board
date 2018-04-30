import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import './styles.scss'

class ControlPanel extends Component {
  _start = () => {
    fetch(`http://localhost:3005/games/${ID}/start`, { method: 'POST' })
      .then(() => console.log('Started Game'))
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
    return (
      <Paper className='controlPanel'>
        <Typography className='typography' variant='headline'>Controls</Typography>
        <Button onClick={this._start} variant='raised'>Start Game</Button>
      </Paper>
    )
  }
}

export default ControlPanel