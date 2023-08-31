import { initWindowMessages } from "$lib/playback/messages";
import { playbackState } from "$lib/playback/stores";
import { loadSettingsWithURLOverrides } from "$lib/settings/stores";
import { setTheme } from "$lib/theme";

import type { PageLoad } from "./$types";

export const load = (({ fetch, url }) => {
  const settings = loadSettingsWithURLOverrides(url);

  setTheme(settings.theme);

  let settingError = true;
  if (settings.game.length > 0 && settings.engine.length > 0) {
    settingError = false;
    playbackState.load(fetch, settings);
    initWindowMessages();
  }

  return { settings, settingError };
}) satisfies PageLoad;
