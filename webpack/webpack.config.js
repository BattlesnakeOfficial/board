const path = require('path');
const projectClientPath = path.join(__dirname, '../src')
const webpack = require('webpack')

module.exports = {
  entry: './src/entry.js',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [
      {
        test: /\.json5$/,
        use: ['json5-loader']
      },
      {
        test: /\.svg$/,
        use: ['svg-react-loader']
      },
      {
        test: /\.png$/,
        use: ['file-loader']
      },
      {
        test: /\.gif$/,
        use: ['file-loader']
      },
      {
        test: /\.jpg$/,
        use: ['file-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
            options: {
              babelrc: false,
              cacheDirectory: path.resolve('node_modules/.cache/babel-loader/client'),
              presets: [
                // A Babel preset that can automatically determine the Babel plugins and polyfills
                // https://github.com/babel/babel-preset-env

                // Experimental ECMAScript proposals
                // https://babeljs.io/docs/plugins/#presets-stage-x-experimental-presets-
                'babel-preset-stage-2',

                // JSX
                // https://github.com/babel/babel/tree/master/packages/babel-preset-react
                'babel-preset-react'
              ]
            }
          }
        ]
      }
    ]
  },

  resolve: {
    alias: {
      components: path.join(projectClientPath, 'components'),
      containers: path.join(projectClientPath, 'containers'),
      actions: path.join(projectClientPath, 'actions'),
      reducers: path.join(projectClientPath, 'reducers'),
      static: path.join(projectClientPath, 'static'),
      lib: path.join(projectClientPath, 'lib'),
      src: projectClientPath,
      styles: path.join(projectClientPath, 'styles')
    },
    extensions: ['.js', '.jsx']
  },

  plugins: [
    new webpack.DefinePlugin({
      __APP_CONFIG__: JSON.stringify(require('./config.json'))
    })
  ]
}
