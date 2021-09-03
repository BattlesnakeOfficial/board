# Battlesnake Board FORK
![CI Build Status](https://github.com/BattlesnakeOfficial/board/actions/workflows/ci.yml/badge.svg)  ![Release Build Status](https://github.com/BattlesnakeOfficial/board/actions/workflows/release.yml/badge.svg)

The board project is used to display Battlesnake games, both during live streams and competitions, as well as on [play.battlesnake.com](https://play.battlesnake.com/). It's built using React, HTML Canvas, and SVGs.

This project follows most React conventions and tools described in the react docs: [create-react-app.dev/docs](https://create-react-app.dev/docs/getting-started)

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

The game board requires a few parameters to work, including a `game` ID and an `engine` URL to query. Loading the index page with no params will throw an error or spin indefinitely.

## Running tests

React will run tests locally in watch mode. More info: https://create-react-app.dev/docs/running-tests/#command-line-interface
```shell
npm test
```

## Board parameters

#### Required
- `engine` - the Battlesnake engine to request frames from.
- `game` - the id of the game to fetch frames for.

```text
http://localhost:3000/?engine=[ENGINE_URL]&game=[GAME_ID]
```

#### Optional
- `autoplay` - start game playback immediately. Values true / false. Defaults to false.
- `boardTheme` - the theme of the board. Values dark / light. Defaults to light.
- `frameRate` - the maximum frame rate used for playback. Takes an integer value equal to FPS. Defaults to 20 FPS.
- `hideScoreboard` - remove the scoreboard for embedding cool games. Values true false. Defaults to false.
- `hideMediaControls` - remove the controls for embedding cool games. Values true / false. Defaults to false.
- `loop` - restart playback immediately once game completes. Values true / false. Defaults to false.
- `title` - show a title string on the game board. Takes a string. Defaults to empty string.
- `turn` - load game to a specific turn. Takes an integer. Defaults to 0.

## Keyboard Shortcuts

If you click on the board you can use:

- arrow keys to go forwards and backwards through frames.
- space bar to pause / un-pause the game.
- r to reset the game to frame 0.

## Linting and formatting

ESLint and Prettier are set up in this project, so you may want to install compatible plugins in your editor.

More info on setting up in popular editors here: [create-react-app.dev/docs/setting-up-your-editor](https://create-react-app.dev/docs/setting-up-your-editor#displaying-lint-output-in-the-editor)

### Feedback

* **Do you have an issue or suggestions for this repository?** Head over to our [Feedback Repository](https://play.battlesnake.com/feedback) today and let us know!
