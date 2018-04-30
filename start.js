const path = require('path')
const express = require('express')
const webpack = require('webpack')
const config = require('./webpack/webpack.config.js')
const devConfig = require('./webpack/webpack.config.development.js')
const prodConfig = require('./webpack/webpack.config.production.js')

let PUBLIC_URL

function startWebpack() {
  console.log('[WEBPACK] Watching files.')

  const compiler = webpack(process.argv[2] === 'dev'
    ? { ...config, ...devConfig }
    : { ...config, ...prodConfig }
  )

  const watching = compiler.watch({
    aggregateTimeout: 300,
    poll: undefined
  }, (err, stats) => {
    if (err) {
      console.log('[WEBPACK] ERROR: ' + err)
    } else {
      console.log('[WEBPACK] Finished compiling.')
      console.log(stats.toString())
      // do nothing with stats, as it appears to be a big object...
    }
  })
}

function startExpress(port) {
  const app = express()
  const PUBLIC_DIR = path.join(__dirname, 'public')
  const DIST_DIR = path.join(__dirname, 'webpack/dist')
  PUBLIC_URL = `http://localhost:${port}`

  app.use(express.static(PUBLIC_DIR))

  app.get('(/|/*/)bundle.js', function (req, res) {
    res.sendFile(path.join(DIST_DIR, 'bundle.js'))
  })

  app.get('*.(png|jpg|gif)', function (req, res) {
    res.sendFile(path.join(DIST_DIR, `/${req.path.split('/')[req.path.split('/').length - 1]}`))
  })

  app.get('*.pdf', function (req, res) {
    res.sendFile(path.join(DIST_DIR, req.path))
  })

  app.get('/(*|*/*)', function (req, res) {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'))
  })

  app.listen(port)
  console.log('[EXPRESS] Listening on port 3000.')
}

startWebpack()
startExpress(3000)
