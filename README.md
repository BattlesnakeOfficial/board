# Battlesnake Game Board

![Test Status](https://github.com/BattlesnakeOfficial/board/actions/workflows/test.yaml/badge.svg) ![Release Status](https://github.com/BattlesnakeOfficial/board/actions/workflows/release.yaml/badge.svg)

The board project is used to visualize and replay Battlesnake games on [play.battlesnake.com](https://play.battlesnake.com/), as well as live streams and competitions. It uses SvelteKit to orchestrate playback and renders the board with dynamic SVGs.

## Development Server

We recommend using a [VSCode Devcontainer](https://code.visualstudio.com/docs/devcontainers/containers) or [GitHub Codespaces](https://github.com/features/codespaces) for development.

Commands to start dev server:

```sh
npm install
npm run dev
```

## Required Parameters

A valid `game` ID is required to be passed as a URL parameter. For example:
`http://127.0.0.1/?game=ASDF-1234-QWER-6789`.

## Playback Settings

Playback settings are used to control playback speed, visual theme, media controls, etc. Some settings are persisted in local storage, and all settings can be overridden using URL parameters.

See [lib/settings](src/lib/settings) for more details.

### Persisted Settings

These values are configurable in the UI and persisted in local storage. They can also be overridden using URL parameters.

- `autoplay: boolean` - Start playback as soon as game is loaded. Defaults to false.
- `fps: number` - Playback speed, defined in 'frames per second'. Defaults to 6.
- `showCoords: boolean` - Display coordinates on game board. Defaults to false.
- `theme: string` - Display theme. Defaults to 'system'.

### Other Settings

These values can be set with URL parameters and are not persisted between games.

- `engine: string` - Stream game data from an alternate game engine.
- `loop: boolean` - Loops playback when game is finished. Defaults to false.
- `showControls: boolean` - Displays playback controls under the game board. Defaults to true.
- `showScoreboard: boolean` - Displays scoreboard to right of game board. Defaults to true.
- `title: string` - Display a title above the board. Defaults to empty string.
- `turn: int` - Start playback on a specific turn. Defaults to 0.

## Tests & Linting

Formatting is enforced with prettier, and linting is enforced with eslint.

Playwright is included in the repo but not yet in use.

## Usage

The board project is intended to be embedded into other webpages using an `<iframe>`. For example:

```html
<iframe scrolling="no" style="width:1280px" src="https://board.battlesnake.com/?game=1234"></iframe>
```

If you want specific settings to be used, add their values to the src URL as additional parameters.

### Sizing

It's expected that the iframe element will have a width and height of 100%, and be contained by a parent with a fixed width. Board will react to the width of the container and size accordingly, with a maximum width of 1280px and a perferred aspect ratio of 16x9 on larger screens.

If you know you're viewing on a larger screen, you can safely set the aspect ratio to 16x9, or fix both dimensions.

```html
<div style="width: 1280px; aspect-ratio: 16 / 9;">
    <iframe style="width: 100%;height: 100%" src="..."></frame>
</div>
```

Otherwise you should listen for the posted 'RESIZE' message from the iframe to know what height the board has chosen to render (see below).

### Cross-Origin Messages

The board will post messages to the parent frame to signal major playback events, such a new frame being displayed and playback ending.

These messages are useful for loading new games, triggering surrounding UI, and properly sizing the embedded iframe.

Example code for listening to these messages:

```javascript
window.addEventListener("message", (e) => {
  if (e.origin !== "https://board.battlesnake.com") {
    return;
  }
  console.log(e.data);
});
```

#### Messages

`RESIZE`: Signals the board has drawn at a new size and includes sizing information. Useful for rendering a responsive iframe.

`TURN`: Sent every time a new game state is displayed, and includes full game state information.

`GAME_OVER`: Signals that playback has concluded and the final frame is being displayed.
