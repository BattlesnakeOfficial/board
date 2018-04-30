import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './styles.css'

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <p>Battlesnake 2019 Game Board</p>
        <a href='https://github.com/louisritchie/battlesnake-2019-board.git'>view source</a>
      </div>
    )
  }
}

export default Footer
