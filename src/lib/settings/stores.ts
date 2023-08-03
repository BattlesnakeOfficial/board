import { get, writable } from "svelte/store"

import { fromLocalStorage, toLocalStorage, getBoolFromURL, getIntFromURL, getStringFromURL } from "./helpers";


// Each setting receives it's value using the following algorithm:
// If url param is set, take value from URL.
// Else if setting is backed by local storage, take value from local storage.
// Else load default value from getDefaultSettings()
//
// Only a subset of settings are backed by local storage and user preference. This is by design.


// Keys for load from URL and local storage
enum Setting {
    AUTOPLAY = 'autoplay',
    DARK_MODE = 'darkMode',
    ENGINE = 'engine',
    FPS = 'fps',
    GAME = 'game',
    LOOP = 'loop',
    SHOW_CONTROLS = 'showControls',
    SHOW_COORDS = 'showCoords',
    SHOW_SCOREBOARD = 'showScoreboard',
    TITLE = 'title',
    TURN = 'turn'
}

export type Settings = {
    autoplay: boolean,
    darkMode: boolean,
    engine: string,
    fps: number,
    game: string,
    loop: boolean,
    showControls: boolean,
    showCoords: boolean,
    showScoreboard: boolean,
    title: string,
    turn: number
}

export function getDefaultSettings(): Settings {
    return {
        autoplay: false,
        darkMode: false,
        engine: 'https://engine.battlesnake.com',
        fps: 6,
        game: '',
        loop: false,
        showControls: true,
        showCoords: false,
        showScoreboard: true,
        title: '',
        turn: 0
    }
}

// These settings are backed by user preference, stored in local storage

// Autoplay
export const autoplay = writable<boolean>(fromLocalStorage(Setting.AUTOPLAY, getDefaultSettings().autoplay));
autoplay.subscribe((value: boolean) => {
    toLocalStorage(Setting.AUTOPLAY, value)
});

// FPS
export const fps = writable<number>(fromLocalStorage(Setting.FPS, getDefaultSettings().fps));
fps.subscribe((value: number) => {
    toLocalStorage(Setting.FPS, value);
})

// Show Coordinates
export const showCoords = writable<boolean>(fromLocalStorage(Setting.SHOW_COORDS, getDefaultSettings().showCoords));
showCoords.subscribe((value: boolean) => {
    toLocalStorage(Setting.SHOW_COORDS, value);
});

export const darkMode = writable<boolean>(fromLocalStorage(Setting.DARK_MODE, getDefaultSettings().darkMode));
darkMode.subscribe((value: boolean) => {
    toLocalStorage(Setting.DARK_MODE, value);
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
        darkMode: getBoolFromURL(url, Setting.DARK_MODE, get(darkMode)),
        // URL param controlled
        engine: getStringFromURL(url, Setting.ENGINE, defaults.engine),
        game: getStringFromURL(url, Setting.GAME, defaults.game),
        loop: getBoolFromURL(url, Setting.LOOP, defaults.loop),
        showControls: getBoolFromURL(url, Setting.SHOW_CONTROLS, defaults.showControls),
        showScoreboard: getBoolFromURL(url, Setting.SHOW_SCOREBOARD, defaults.showScoreboard),
        title: getStringFromURL(url, Setting.TITLE, defaults.title),
        turn: getIntFromURL(url, Setting.TURN, defaults.turn)
    }
}
