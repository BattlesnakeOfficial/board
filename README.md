# Battlesnake 2019 Board

[![Build Status](https://travis-ci.com/battlesnakeio/board.svg?branch=master)](https://travis-ci.com/battlesnakeio/board)

## Development

```shell
npm i
npm start
```

## Production

```shell
npm run build
```

## Running a game

For now you cannot just load the index page or you'll get an error. To make it
do something you need to add the query parameters `engine` (URL of the engine
API) and `game` (ID of the game you want to run). For example:

```text
http://localhost:3000/?engine=http%3A%2F%2Flocalhost%3A3005&game=3bb6f305-04fd-4e16-935a-d7a240154dd6
```

## Board parameters

- `engine` - the Battlesnake engine to request frames from.
- `game` - the id of the game to fetch frames for.
- `boardTheme` - the theme of the board. Values dark / light. Defaults to light.
- `frameRate` - the frame rate used in the board. Takes a value equal to FPS. Defaults to 20 FPS.
- `hideScoreboard` - remove the scoreboard for embedding cool games. Values true false. Defaults to false.
- `hideMediaControls` - remove the controls for embedding cool games. Values true/false. Defaults to false.

## Keyboard Shortcuts

If you click on the board you can use:

- arrow keys to go forwards and backwards through frames.
- space bar to pause / un-pause the game.
- r to reset the game to frame 0.

## Handy tips

Since it is a common pattern to create a game, start it, and then view it in
the browser you can do something like this:

```shell
GAME_ID=`engine-cli create -c ~/snake-config.json | cut -d'"' -f 2`
engine-cli run -g $GAME_ID
xdg-open "http://localhost:3000?engine=http%3A%2F%2Flocalhost%3A3005&game=$GAME_ID"
```

## Linting and formatting

ESLint and Prettier are setup in this project so you may want to install
compatible plugins in your editor.
