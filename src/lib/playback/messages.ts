import { browser } from "$app/environment";

import { playbackState } from "./stores";
import type { PlaybackState } from "./types";

enum GameEvent {
  // Basic display messages
  RESIZE = "RESIZE",
  TURN = "TURN",
  GAME_OVER = "GAME_OVER"

  // Could do eliminations, food spawns, hazard damage, etc etc etc.
}

type Message = {
  event: GameEvent;
  data: object;
};

function postMessageToParent(message: Message) {
  if (browser) {
    try {
      window.parent.postMessage(message, "*");
    } catch (e) {
      console.error(e);
    }
  }
}

export function sendResizeMessage(width: number, height: number) {
  postMessageToParent({
    event: GameEvent.RESIZE,
    data: { width, height }
  });
}

export function initWindowMessages() {
  playbackState.subscribe((state: PlaybackState | null) => {
    if (state) {
      postMessageToParent({
        event: GameEvent.TURN,
        data: {
          turn: state.frame.turn
        }
      });
      if (state.frame.isFinalFrame) {
        postMessageToParent({
          event: GameEvent.GAME_OVER,
          data: {}
        });
      }
    }
  });
}
