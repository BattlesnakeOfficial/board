export const addEntity = (options) => ({
  type: 'ENTITY_ADD',
  payload: options
})

export const deleteEntity = id => ({
  type: 'ENTITY_ADD',
  payload: { id }
})