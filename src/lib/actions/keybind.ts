import Mousestrap from "mousetrap";

type Options = {
  keys: string[];
  f: () => void;
};

export function keybind(node, options: Options) {
  const mousetrap = new Mousestrap(window.document);
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
