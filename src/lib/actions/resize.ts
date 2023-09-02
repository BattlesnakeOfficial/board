type Options = {
  f: (width: number, height: number) => void;
};

export function resize(node: HTMLElement, options: Options) {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const w = entry.contentBoxSize[0].inlineSize;
      const h = entry.contentBoxSize[0].blockSize;
      options.f(w, h);
    }
  });
  resizeObserver.observe(node);

  return {
    destroy() {
      resizeObserver.unobserve(node);
    }
  };
}
