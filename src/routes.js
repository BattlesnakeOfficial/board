import Board from 'containers/board'
import NewGame from 'containers/newGame'
import Error from 'containers/error'

export default [
  {
    path: '/404',
    regex: '/404',
    component: Error,
    name: '404',
    hidden: true
  },
  {
    path: '/new',
    regex: '/new',
    component: NewGame,
    name: 'New Game'
  },
  {
    path: '/game/default',
    regex: '/game/:id',
    component: Board,
    name: 'Board',
    hidden: true
  }
]
