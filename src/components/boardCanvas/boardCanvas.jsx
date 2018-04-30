import React, { Component } from 'react'
import './styles.scss'

class BoardCanvas extends Component {
  render() {
    console.log(this.props)
    return (
      <div style={{width: `calc(${this.props.size[0]} * var(--grid-size) + 1px)`, height: `calc(${this.props.size[1]} * var(--grid-size) + 1px)`}} className='boardCanvas'>
        <div className='verticalGrid' />
        <div className='horizontalGrid' />
      </div>
    )
  }
}

export default BoardCanvas
