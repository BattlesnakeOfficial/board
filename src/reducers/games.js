import { append } from 'ramda'

const games = (state = [], {type, payload}) => {
  switch (type) {
    case 'GAME_ADD':
      return append({ ...payload }, state)
    case 'GAME_UPDATE':
      return state.map(game => game.ID === payload.ID ? { ...game, ...payload } : game)
    default:
      return state
  }
}

export default games