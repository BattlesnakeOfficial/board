// We're a strictly static site, disable SSR site-wide and force all pages to prerender.
// See: https://kit.svelte.dev/docs/adapter-static
export const prerender = true;
export const ssr = false;
