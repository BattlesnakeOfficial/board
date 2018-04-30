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
  componentWillReceiveProps(nextProps) {
    console.log(nextProps.frames)
    if (nextProps.frames.length >= 1) {
      let counter = 0
      console.log('set counter, entering setInterval.')
      this._interval = setInterval(() => {
        if (counter === this.props.frames.length - 1) {
          clearInterval(this._interval)
        } else {
          console.log(this.props.frames[counter++])
        }
      }, 200)
    }
  }

  render() {
    return (
      <Paper style={{minWidth: `calc(${20} * var(--grid-size) + 1px)`, height: `calc(${20} * var(--grid-size) + 1px)`}} className='boardCanvas'>
        <div className='verticalGrid' />
        <div className='horizontalGrid' />
      </Paper>
    )
  }
}

export default connect(mapStateToProps)(BoardCanvas)