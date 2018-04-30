import { combineReducers } from 'redux'
import entities from './entities'
import selection from './selection'
import tools from './tools'
import settings from './settings'

export default combineReducers({
  entities,
  selection,
  tools,
  settings
})