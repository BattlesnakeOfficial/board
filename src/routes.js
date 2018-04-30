import Board from 'containers/board'
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
    path: '/',
    regex: '/',
    component: Board,
    name: 'Board'
  }
]
