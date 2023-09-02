<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/stores";

  let gameId = $page.url.searchParams.get("game");
  let gameTitle = $page.url.searchParams.get("title") || "";

  const configs = [
    {
      id: "leaderboard-recent-games",
      title: "Leaderboard Recent Games Preview (300px)",
      url: "https://play.battlesnake.com/leaderboards",
      width: "300px",
      src: `/?game=${gameId}&title=${gameTitle}&showControls=false&showScoreboard=false&autoplay=true&fps=10`
    },
    {
      id: "sm-screen-size",
      title: "Screen Size SM (640px)",
      url: `https://play.battlesnake.com/game/${gameId}`,
      width: "640px",
      src: `/?game=${gameId}&title=${gameTitle}&autoplay=true&fps=10`
    },
    {
      id: "md-screen-size",
      title: "Screen Size MD (768px)",
      url: `https://play.battlesnake.com/game/${gameId}`,
      width: "768px",
      src: `/?game=${gameId}&title=${gameTitle}&autoplay=true&fps=10`
    },
    {
      id: "lg-screen-size",
      title: "Screen Size LG (1024px)",
      url: `https://play.battlesnake.com/game/${gameId}`,
      width: "1024px",
      src: `/?game=${gameId}&title=${gameTitle}&autoplay=true&fps=10`
    },
    {
      id: "xl-screen-size",
      title: "XL Screen Size (1280px)",
      url: `https://play.battlesnake.com/game/${gameId}`,
      width: "1280px",
      src: `/?game=${gameId}&title=${gameTitle}&autoplay=true&fps=10`
    },
    {
      id: "full-width",
      title: "Full Width (100%)",
      url: `https://play.battlesnake.com/game/${gameId}`,
      width: "100%",
      src: `/?game=${gameId}&title=${gameTitle}&autoplay=true&fps=10`
    }
  ];

  if (browser) {
    window.addEventListener(
      "message",
      function (message) {
        if (message.source && message.data.event == "RESIZE") {
          // We need to find which iframe sent the message
          for (let i = 0; i < configs.length; i++) {
            const iframeElement = this.document.getElementById(configs[i].id) as HTMLIFrameElement;
            if (iframeElement.contentWindow == message.source) {
              const height = iframeElement.contentWindow.document.body.scrollHeight;
              setTimeout(() => {
                iframeElement.style.height = `${height}px`;
              }, 100);
            }
          }
        }
      },
      false
    );
  }
</script>

<div class="w-full my-4">
  {#each configs as config}
    <div class="flex flex-col w-full mb-16">
      <p class="mb-4 text-xl font-bold text-center">{config.title}</p>
      <div
        class="w-full mx-auto rounded-sm border-2 border-solid border-pink-500"
        style:max-width={config.width}
      >
        <iframe
          id={config.id}
          title={config.title}
          src={config.src}
          scrolling="no"
          class="w-full h-full"
        />
      </div>
    </div>
  {/each}
</div>
