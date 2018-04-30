import { combineReducers } from 'redux'
import games from './games'
import board from './board'

export default combineReducers({
  games,
  board
})