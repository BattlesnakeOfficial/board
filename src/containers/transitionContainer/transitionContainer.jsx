import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './styles.css'

/* This is a higher-order component that adds transitions by using lifecycle methods.
 * It modifies the opacity of the parent.
 */
class TransitionContainer extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    hitLightSwitch: PropTypes.func.isRequired
  }

  componentDidMount = () => {
    window.scrollTo(0, 0)
    setTimeout(this.props.hitLightSwitch, 200)
  }

  componentWillUnmount = () => this.props.hitLightSwitch()

  render() {
    return this.props.children
  }
}

export default TransitionContainer
