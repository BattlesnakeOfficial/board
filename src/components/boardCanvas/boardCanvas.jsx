import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import './styles.scss'

class BoardCanvas extends Component {
  render() {
    return (
      <Paper style={{minWidth: `calc(${this.props.size[0]} * var(--grid-size) + 1px)`, height: `calc(${this.props.size[1]} * var(--grid-size) + 1px)`}} className='boardCanvas'>
        <div className='verticalGrid' />
        <div className='horizontalGrid' />
      </Paper>
    )
  }
}

export default BoardCanvas
