import { get, writable } from "svelte/store";

import { type Settings, getDefaultSettings } from "$lib/settings/stores";

import { startPlayback, stopPlayback } from "./animation";
import { fetchGame } from "./engine";
import { type Frame, PlaybackMode, type PlaybackState } from "./types";

const AUTOPLAY_DELAY_MS = 250;
const LOOP_DELAY_MS = 1500;

let frames: Frame[] = [];
let currentFrameIndex = 0;
let settings: Settings = getDefaultSettings();

const writableState = writable<PlaybackState | null>(null);
export const playbackError = writable<string | null>(null);

const reset = () => {
  frames = [];
  currentFrameIndex = 0;
  settings = getDefaultSettings();

  writableState.set(null);
  playbackError.set(null);
};

const setCurrentFrame = (index: number) => {
  const clampedIndex = Math.min(Math.max(index, 0), frames.length - 1);
  const newFrame = frames[clampedIndex];

  writableState.update(($state) => {
    if ($state) {
      currentFrameIndex = clampedIndex;
      $state.frame = newFrame;

      if ($state.frame.isFinalFrame && $state.mode == PlaybackMode.PLAYING) {
        stopPlayback();
        $state.mode = PlaybackMode.PAUSED;
        if (settings.loop) {
          setTimeout(controls.firstFrame, LOOP_DELAY_MS);
          setTimeout(controls.play, LOOP_DELAY_MS * 2);
        }
      }
    }
    return $state;
  });
};

const setMode = (mode: PlaybackMode) => {
  writableState.update(($state) => {
    if ($state) {
      $state.mode = mode;
    }
    return $state;
  });
};

const controls = {
  firstFrame: () => {
    if (get(writableState)?.mode == PlaybackMode.PAUSED) {
      setCurrentFrame(0);
    }
  },
  lastFrame: () => {
    if (get(writableState)?.mode == PlaybackMode.PAUSED) {
      setCurrentFrame(frames.length - 1);
    }
  },
  prevFrame: () => {
    if (get(writableState)?.mode == PlaybackMode.PAUSED) {
      setCurrentFrame(currentFrameIndex - 1);
    }
  },
  nextFrame: () => {
    if (get(writableState)?.mode == PlaybackMode.PAUSED) {
      setCurrentFrame(currentFrameIndex + 1);
    }
  },
  prevEliminationFrame: () => {
    if (get(writableState)?.mode == PlaybackMode.PAUSED) {
      for (let i = currentFrameIndex; i >= 0; i--) {
        for (let s = 0; s < frames[i].snakes.length; s++) {
          const snake = frames[i].snakes[s];
          if (snake.elimination && snake.elimination.turn <= currentFrameIndex) {
            const newIndex = snake.elimination.turn - 1;
            console.debug(`[playback] jump to elimination frame ${newIndex}`);
            setCurrentFrame(newIndex);
            return;
          }
        }
        controls.firstFrame();
      }
    }
  },
  nextEliminationFrame: () => {
    if (get(writableState)?.mode == PlaybackMode.PAUSED) {
      for (let i = currentFrameIndex + 2; i < frames.length; i++) {
        for (let s = 0; s < frames[i].snakes.length; s++) {
          const snake = frames[i].snakes[s];
          if (snake.elimination && snake.elimination.turn > currentFrameIndex + 1) {
            const newIndex = snake.elimination.turn - 1;
            console.debug(`[playback] jump to elimination frame ${newIndex}`);
            setCurrentFrame(newIndex);
            return;
          }
        }
      }
      controls.lastFrame();
    }
  },
  play: () => {
    if (get(writableState)?.mode == PlaybackMode.PAUSED) {
      startPlayback(settings.fps, () => {
        setCurrentFrame(currentFrameIndex + 1);
      });
      setMode(PlaybackMode.PLAYING);
    }
  },
  pause: () => {
    stopPlayback();
    setMode(PlaybackMode.PAUSED);
  },
  togglePlayPause: () => {
    if (get(writableState)?.mode == PlaybackMode.PAUSED) {
      controls.play();
    } else if (get(writableState)?.mode == PlaybackMode.PLAYING) {
      controls.pause();
    }
  },
  jumpToFrame: (i: number) => {
    controls.pause();
    setCurrentFrame(i);
  }
};

const onFrameLoad = (frame: Frame) => {
  // Load the first frame when we see it.
  if (frame.turn == settings.turn) {
    writableState.set({
      frame: frame,
      mode: PlaybackMode.PAUSED,
      finalFrame: null
    });

    setCurrentFrame(settings.turn);
    if (settings.autoplay) {
      setTimeout(controls.play, AUTOPLAY_DELAY_MS);
    }
  }
};

const onFinalFrame = (frame: Frame) => {
  writableState.update(($state) => {
    if ($state) {
      $state.finalFrame = frame;
    }
    return $state;
  });
};

const onEngineError = (message: string) => {
  playbackError.set(message);
};

function createPlaybackState() {
  return {
    controls,
    subscribe: writableState.subscribe,
    load: (fetchFunc: typeof fetch, s: Settings) => {
      settings = { ...s };
      fetchGame(fetchFunc, s.game, s.engine, frames, onFrameLoad, onFinalFrame, onEngineError);
    },
    reset
  };
}

export const playbackState = createPlaybackState();
