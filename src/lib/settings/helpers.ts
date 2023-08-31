import { browser } from "$app/environment";

export function fromLocalStorage(key: string, defaultValue: boolean | number | string) {
  if (browser) {
    const val = localStorage.getItem(`setting.${key}`);
    if (val) {
      return JSON.parse(val);
    }
  }
  return defaultValue;
}

export function toLocalStorage(key: string, value: boolean | number | string) {
  if (browser) {
    localStorage.setItem(`setting.${key}`, JSON.stringify(value));
  }
}

export function getBoolFromURL(url: URL, key: string, defaultValue: boolean): boolean {
  const val = url.searchParams.get(key);
  if (val) {
    if (val === "true") return true;
    if (val === "false") return false;
  }
  return defaultValue;
}

export function getIntFromURL(url: URL, key: string, defaultValue: number): number {
  const val = url.searchParams.get(key);
  if (val) {
    const parsedVal = parseInt(val);
    if (!isNaN(parsedVal)) {
      return parsedVal;
    }
  }
  return defaultValue;
}

export function getStringFromURL(url: URL, key: string, defaultValue: string): string {
  const val = url.searchParams.get(key);
  if (val) {
    return val;
  }
  return defaultValue;
}
