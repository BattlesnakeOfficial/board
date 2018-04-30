import { append } from 'ramda'

const games = (state = [], {type, payload}) => {
  switch (type) {
    case 'GAME_ADD':
      return append({ ...payload }, state)
    case 'GAME_ADD':
      return append({ ...payload }, state)
    default:
      return state
  }
}

export default games