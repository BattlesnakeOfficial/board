import { browser } from "$app/environment";

import { Theme } from "$lib/settings/stores";

export function setTheme(theme: Theme) {
  if (browser) {
    if (theme == Theme.DARK) {
      document.documentElement.classList.add("dark");
    } else if (theme == Theme.LIGHT) {
      document.documentElement.classList.remove("dark");
    } else if (theme == Theme.SYSTEM) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }
}
