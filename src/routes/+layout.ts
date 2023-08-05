import { browser } from '$app/environment';
import { theme } from '$lib/settings/stores';

import type { PageLoad } from './$types';


function setTheme(value: Theme) {
    if (!browser) return;

    if (value == 'dark') {
        document.documentElement.classList.add('dark');

    } else if (value == 'light') {
        document.documentElement.classList.remove('dark');

    } else if (value == 'system') {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
}

export const load = (() => {
    theme.subscribe((value: Theme) => {
        setTheme(value);
    });
}) satisfies PageLoad;
