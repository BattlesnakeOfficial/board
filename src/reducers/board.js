import { append } from 'ramda'

const games = (state = [], {type, payload}) => {
  switch (type) {
    case 'FRAMES_PLAY':
      return payload
    default:
      return state
  }
}

export default games