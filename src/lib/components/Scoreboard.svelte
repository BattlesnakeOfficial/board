<script lang="ts">
  import { highlightedSnakeID } from "$lib/highlight";
  import { playbackState } from "$lib/playback/stores";
  import type { Elimination } from "$lib/playback/types";

  // We sort snakes by elimination state, then lowercase name alphabetical
  $: sortedSnakes = $playbackState
    ? [...$playbackState.frame.snakes].sort((a, b) => {
        if (a.isEliminated != b.isEliminated) {
          return a.isEliminated ? 1 : -1;
        }
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      })
    : [];

  function snakeIdToName(id: string) {
    if ($playbackState) {
      for (let i = 0; i < $playbackState.frame.snakes.length; i++) {
        if ($playbackState.frame.snakes[i].id == id) {
          return $playbackState.frame.snakes[i].name;
        }
      }
    }
    return "UNKNOWN";
  }

  function eliminationToString(elimination: Elimination) {
    // See https://github.com/BattlesnakeOfficial/rules/blob/master/standard.go
    switch (elimination.cause) {
      case "snake-collision":
        return `Collided with body of ${snakeIdToName(elimination.by)} on Turn ${elimination.turn}`;
      case "snake-self-collision":
        return `Collided with itself on Turn ${elimination.turn}`;
      case "out-of-health":
        return `Ran out of health on Turn ${elimination.turn}`;
      case "hazard":
        return `Eliminated by hazard on Turn ${elimination.turn}`;
      case "head-collision":
        return `Lost head-to-head with ${snakeIdToName(elimination.by)} on Turn ${
          elimination.turn
        }`;
      case "wall-collision":
        return `Moved out of bounds on Turn ${elimination.turn}`;
      default:
        return elimination.cause;
    }
  }

  function highlightSnake(id: string) {
    if ($highlightedSnakeID == id) {
      $highlightedSnakeID = null;
    } else {
      $highlightedSnakeID = id;
    }
  }
</script>

{#if $playbackState}
  <div class="flex flex-row font-bold text-lg">
    <div class="basis-1/2 text-right">TURN</div>
    <div class="basis-1/2 pl-2">{$playbackState.frame.turn}</div>
  </div>

  {#each sortedSnakes as snake}
    <div
      class="p-2 cursor-pointer rounded-sm border-solid border-2 border-transparent hover:border-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800"
      class:eliminated={snake.isEliminated}
      class:highlighted={snake.id == $highlightedSnakeID}
      on:click={() => highlightSnake(snake.id)}
      role="presentation"
    >
      <div class="flex flex-row font-bold">
        <p class="grow truncate">{snake.name}</p>
        <p class="ps-4 text-right">{snake.length}</p>
      </div>
      <div class="flex flex-row text-xs">
        <p class="grow truncate">by {snake.author}</p>
        <p class="text-right">{snake.latency ? `${snake.latency}ms` : ""}</p>
      </div>

      <div class="h-4 text-xs mt-1">
        {#if snake.elimination}
          <p>{eliminationToString(snake.elimination)}</p>
        {:else}
          <div class="text-outline w-full h-full rounded-full bg-neutral-200 dark:bg-neutral-800">
            <div
              class="transition-all h-full rounded-full text-white ps-2"
              style="background: {snake.color}; width: {snake.health}%"
            >
              {snake.health}
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/each}
{/if}

<style lang="postcss">
  .text-outline {
    text-shadow: 0 0 2px black, 0 0 2px black, 0 0 2px black, 0 0 2px black;
  }
  .eliminated {
    @apply text-neutral-500;
  }
  .highlighted {
    @apply border-pink-500 bg-neutral-200;
  }
  :global(html.dark .highlighted) {
    @apply bg-neutral-800;
  }
</style>
