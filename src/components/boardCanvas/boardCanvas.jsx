import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import { connect } from 'react-redux'
import './styles.scss'

const mapStateToProps = state => {
  console.log(state.board)
  if (state.board) {
    return { frames: state.board }
  }
}

class BoardCanvas extends Component {
  state = {}

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.frames)
    if (nextProps.frames.length >= 1) {
      let counter = 0
      console.log('set counter, entering setInterval.')
      this._interval = setInterval(() => {
        if (counter === this.props.frames.length - 1) {
          console.log('done.')
          clearInterval(this._interval)
        } else {
          console.log('setting state.')
          this.setState({...this.props.frames[counter++]})
        }
      }, 200)
    }
  }

  render() {
    console.log(this.state)
    return (
      <Paper style={{minWidth: `calc(${20} * var(--grid-size) + 1px)`, height: `calc(${20} * var(--grid-size) + 1px)`}} className='boardCanvas'>
        <div className='verticalGrid' />
        <div className='horizontalGrid' />
        {this.state.Snakes && this.state.Snakes.map(({Body}) =>
          Body.map(({X, Y}) => <div className='snake' style={{top: (Y - 1) * 25, left: (X - 1) * 25}} />)
        )}
      </Paper>
    )
  }
}

export default connect(mapStateToProps)(BoardCanvas)