import { get, writable } from "svelte/store";

import {
  fromLocalStorage,
  toLocalStorage,
  getBoolFromURL,
  getIntFromURL,
  getStringFromURL
} from "./helpers";
import { setTheme } from "$lib/theme";

// Each setting receives it's value using the following algorithm:
// If url param is set, take value from URL.
// Else if setting is backed by local storage, take value from local storage.
// Else load default value from getDefaultSettings()
//
// Only a subset of settings are backed by local storage and user preference. This is by design.

// Keys for load from URL and local storage
export enum Setting {
  AUTOPLAY = "autoplay",
  ENGINE = "engine",
  FPS = "fps",
  GAME = "game",
  LOOP = "loop",
  SHOW_CONTROLS = "showControls",
  SHOW_COORDS = "showCoords",
  SHOW_SCRUBBER = "showScrubber",
  SHOW_SCOREBOARD = "showScoreboard",
  THEME = "theme",
  TITLE = "title",
  TURN = "turn"
}

export enum Theme {
  DARK = "dark",
  LIGHT = "light",
  SYSTEM = "system"
}

export type Settings = {
  autoplay: boolean;
  engine: string;
  fps: number;
  game: string;
  loop: boolean;
  showControls: boolean;
  showCoords: boolean;
  showScrubber: boolean;
  showScoreboard: boolean;
  theme: Theme;
  title: string;
  turn: number;
};

export function getDefaultSettings(): Settings {
  return {
    autoplay: false,
    engine: "https://engine.battlesnake.com",
    fps: 6,
    game: "",
    loop: false,
    showControls: true,
    showCoords: false,
    showScrubber: false,
    showScoreboard: true,
    theme: Theme.SYSTEM,
    title: "",
    turn: 0
  };
}

// These settings are backed by user preference, stored in local storage

// Autoplay
export const autoplay = writable<boolean>(
  fromLocalStorage(Setting.AUTOPLAY, getDefaultSettings().autoplay)
);
autoplay.subscribe((value: boolean) => {
  toLocalStorage(Setting.AUTOPLAY, value);
});

// FPS
export const fps = writable<number>(fromLocalStorage(Setting.FPS, getDefaultSettings().fps));
fps.subscribe((value: number) => {
  toLocalStorage(Setting.FPS, value);
});

// Show Coordinates
export const showCoords = writable<boolean>(
  fromLocalStorage(Setting.SHOW_COORDS, getDefaultSettings().showCoords)
);
showCoords.subscribe((value: boolean) => {
  toLocalStorage(Setting.SHOW_COORDS, value);
});

// Show Turn Scrubber
export const showScrubber = writable<boolean>(
  fromLocalStorage(Setting.SHOW_SCRUBBER, getDefaultSettings().showScrubber)
);
showScrubber.subscribe((value: boolean) => {
  toLocalStorage(Setting.SHOW_SCRUBBER, value);
});

// Theme
export const theme = writable<Theme>(fromLocalStorage(Setting.THEME, getDefaultSettings().theme));
theme.subscribe((value: Theme) => {
  toLocalStorage(Setting.THEME, value);
  setTheme(value);
});

// Load settings, with option to override via URL params
export function loadSettingsWithURLOverrides(url: URL): Settings {
  const defaults = getDefaultSettings();

  // Note that defaults are already baked into the settings backed by local storage
  return {
    // Preference controlled
    autoplay: getBoolFromURL(url, Setting.AUTOPLAY, get(autoplay)),
    fps: getIntFromURL(url, Setting.FPS, get(fps)),
    showCoords: getBoolFromURL(url, Setting.SHOW_COORDS, get(showCoords)),
    showScrubber: getBoolFromURL(url, Setting.SHOW_SCRUBBER, get(showScrubber)),
    theme: getStringFromURL(url, Setting.THEME, get(theme)) as Theme,
    // URL param controlled
    engine: getStringFromURL(url, Setting.ENGINE, defaults.engine),
    game: getStringFromURL(url, Setting.GAME, defaults.game),
    loop: getBoolFromURL(url, Setting.LOOP, defaults.loop),
    showControls: getBoolFromURL(url, Setting.SHOW_CONTROLS, defaults.showControls),
    showScoreboard: getBoolFromURL(url, Setting.SHOW_SCOREBOARD, defaults.showScoreboard),
    title: getStringFromURL(url, Setting.TITLE, defaults.title),
    turn: getIntFromURL(url, Setting.TURN, defaults.turn)
  };
}
