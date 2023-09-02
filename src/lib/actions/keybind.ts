import Mousestrap from "mousetrap";

type Options = {
  keys: string[];
  f: () => void;
};

export function keybind(node: HTMLElement, options: Options) {
  const mousetrap = new Mousestrap(document.getElementsByTagName("main")[0]);
  mousetrap.bind(options.keys, () => {
    options.f();

    // Always prevent default behavior
    return false;
  });

  return {
    destroy() {
      mousetrap.reset();
    }
  };
}
