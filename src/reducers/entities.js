import { append } from 'ramda'

let nextId = 0

const entities = (state = [], {type, payload}) => {
  switch (type) {
    case 'ENTITY_ADD':
      return append({ ...payload, id: nextId++ }, state)
    case 'ENTITY_REMOVE':
      return state.filter(({id}) => payload.id !== id)
    default:
      return state
  }
}

export default entities