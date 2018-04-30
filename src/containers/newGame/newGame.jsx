import React, { Component } from 'react'
import { connect } from 'react-redux'
import { pick } from 'ramda'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Input, { InputLabel } from 'material-ui/Input'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import { addGame } from 'actions/games'
import './styles.scss'

class NewGame extends Component {
  state = {
    width: 20,
    height: 20,
    food: 10,
    snakes: [
      {
        name: "snake 1",
        url: "https://snake1.herokuapp.com",
        id: ""
      }
    ],
    submitting: false
  }

  _submit = () => {
    console.log(this.props)
    this.setState({ submitting: true })

    fetch('http://localhost:3005/games', {
      body: JSON.stringify(pick(['width', 'height', 'food', 'snakes'], this.state)),
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    })
      .then(response => response.json())
      .then(({ ID }) => {
        this.props.addGame({
          status: 'stopped',
          ID,
          ...pick(['width', 'height', 'food', 'snakes'], this.state)
        })
        this.props.history.push(`/game/${ID}`)
      })
      .catch(console.error)
  }

  _handleRangeChange = ({target: {value, dataset: {path}}}) => this.setState({[path]: Number(value)})

  render() {
    console.log(this.props)
    console.log(this.state)
    return (
      <div className='newGame'>
        <Paper className='fieldsContainer'>
          <Typography variant='button' align='center'>New Game</Typography>
          <br />
          <br />
          <div>
            <InputLabel><Typography className='fieldLabel' variant='caption'>Width: {this.state.width}</Typography></InputLabel>
            <Input disableUnderline type='range' onChange={this._handleRangeChange} inputProps={{min: '4', max: '100', defaultValue: '20', 'data-path': 'width' }} />
          </div>
          <div>
            <InputLabel><Typography className='fieldLabel' variant='caption'>Height: {this.state.height}</Typography></InputLabel>
            <Input disableUnderline type='range' onChange={this._handleRangeChange} inputProps={{min: '4', max: '100', defaultValue: '20', 'data-path': 'height' }} />
          </div>
          <div>
            <InputLabel><Typography className='fieldLabel' variant='caption'>Food: {this.state.food}</Typography></InputLabel>
            <Input disableUnderline type='range' onChange={this._handleRangeChange} inputProps={{min: '0', max: '50', defaultValue: '10', 'data-path': 'food' }} />
          </div>
          <div>
            <InputLabel><Typography className='fieldLabel' variant='caption'>Snake 1 URL</Typography></InputLabel>
            <TextField />
          </div>
          <div>
            <InputLabel><Typography className='fieldLabel' variant='caption'>Snake 2 URL</Typography></InputLabel>
            <TextField />
          </div>
          <div>
            <InputLabel><Typography className='fieldLabel' variant='caption'>Snake 3 URL</Typography></InputLabel>
            <TextField />
          </div>
          <div>
            <InputLabel><Typography className='fieldLabel' variant='caption'>Snake 4 URL</Typography></InputLabel>
            <TextField />
          </div>
          <br />
          <Button onClick={this._submit} variant='raised' disabled={this.state.submitting}>{this.state.submitting ? 'Creating...' : 'Create Game'}</Button>
        </Paper>
      </div>
    )
  }
}

export default connect(null, {addGame})(NewGame)