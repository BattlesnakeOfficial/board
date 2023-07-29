# Battlesnake Game Board

![CI Build Status](https://github.com/BattlesnakeOfficial/board/actions/workflows/ci.yml/badge.svg)  ![Release Build Status](https://github.com/BattlesnakeOfficial/board/actions/workflows/release.yml/badge.svg)

The board project is used to display Battlesnake games on [play.battlesnake.com](https://play.battlesnake.com/), as well as live streams and competitions. It's built using SvelteKit to produce animated SVGs visualizations.


## Development

This project uses a standard SvelteKit development setup.

**Devcontainer**

This repo is setup to run in a [GitHub Codespace](https://github.com/features/codespaces) or [VSCode Devcontainer](https://code.visualstudio.com/docs/devcontainers/containers). See [devcontainer.json](.devcontainer/devcontainer.json) for details.


**Local Development**

You can also use these commands to launch a local dev server.

```sh
npm install
npm run dev
open https://127.0.0.1:5173
```



## Required Parameters

A valid `game` ID is required to be passed as a URL parameter.

For example:
`http://127.0.0.1/?game=ASDF-1234-QWER-6789`.


## Settings

All playback settings can be set using URL parameters. Some settings are also configurable via UI and stored in local storage.

Settings provided as URL params will override values stored in local storage. See [src/lib/settings/stores.ts](src/lib/settings/stores.ts) for more details.

### Persisted Settings

These values are configurable in the game board UI and persisted in local storage.

- `autoplay: boolean` -  Start playback as soon as game is loaded. Defaults to false.
- `fps: number` - Playback speed, defined in 'frames per second'. Defaults to 6.
- `showCoords: boolean` - Display coordinates on game board. Defaults to false.

### Other Settings

These values can be set with URL parameters and are not persisted between games.

- `engine: string` - Stream game data from an alternate game engine.
- `loop: boolean` - Loops playback when game is finished. Defaults to false.
- `showControls: boolean` - Displays playback controls under the game board. Defaults to true.
- `showScoreboard: boolean` - Displays scoreboard to right of game board. Defaults to true.
- `title: string` - Display a title above the board. Defaults to empty string.
- `turn: int` - Start playback on a specific turn. Defaults to 0.

## Tests & Linting

eslint and playwright are setup but not currently enforced.
