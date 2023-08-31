import { writable } from "svelte/store";

export const highlightedSnakeID = writable<string | null>(null);
