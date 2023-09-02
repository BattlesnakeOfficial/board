import tippy from "tippy.js";

type Options = {
  templateId: string;
  tippyProps: object;
};

export function tooltip(node: HTMLElement, options: Options) {
  const props = {
    ...options.tippyProps,
    allowHTML: true,
    content: document.getElementById(options.templateId)?.innerHTML.slice()
  };

  const tip = tippy(node, props);

  return {
    destroy: () => tip.destroy()
  };
}
