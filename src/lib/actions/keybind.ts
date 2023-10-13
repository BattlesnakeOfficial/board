import Mousestrap from "mousetrap";

type Options = {
  keys: string[];
  f: () => void;
};

export function keybind(node: HTMLElement, options: Options) {
  console.debug("[keybind] binding:", options.keys);

  const mousetrap = new Mousestrap(document.documentElement);
  mousetrap.bind(options.keys, () => {
    console.debug("[keybind] handling:", options.keys);
    options.f();

    // Always prevent default behavior
    return false;
  });

  return {
    destroy() {
      console.debug("[keybind] destorying:", options.keys);
      mousetrap.reset();
    }
  };
}
