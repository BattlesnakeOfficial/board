export const addGame = (options) => ({
  type: 'GAME_ADD',
  payload: options
})

export const updateGame = (options) => ({
  type: 'GAME_UPDATE',
  payload: options
})