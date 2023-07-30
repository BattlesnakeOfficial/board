export const ssr = false;

import { initWindowMessages } from '$lib/playback/messages';
import { playbackState } from '$lib/playback/stores';
import { loadSettingsWithURLOverrides } from '$lib/settings/stores';

import type { PageLoad } from './$types';


export const load = (({ fetch, url }) => {
    let settingError = true;
    const settings = loadSettingsWithURLOverrides(url);

    if (settings.game.length > 0 && settings.engine.length > 0) {
        settingError = false;
        playbackState.load(fetch, settings);
        initWindowMessages();
    }

    return { settings, settingError }
}) satisfies PageLoad;
