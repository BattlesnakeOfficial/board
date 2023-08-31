let activeInterval: undefined | ReturnType<typeof setInterval>;

export function startPlayback(fps: number, callback: () => void) {
  // Do nothing if playback is active
  if (activeInterval) {
    return;
  }

  console.debug(`[playback] starting playback at ${fps} fps`);

  // Play first frame immediately
  callback();

  // Set interval for future frames
  const delayMS = 1000 / Math.ceil(fps);
  activeInterval = setInterval(() => {
    callback();
  }, delayMS);
}

export function stopPlayback(): void {
  if (activeInterval) {
    clearInterval(activeInterval);
    activeInterval = undefined;
  }
}
