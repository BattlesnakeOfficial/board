import runTippy from 'tippy.js';

type Options = {
    templateId: string,
    tippyProps: object
}


export function tippy(node, options: Options) {
    const config = {
        ...options.tippyProps,
        allowHTML: true,
        content: document.getElementById(options.templateId).innerHTML
    }

    const { destroy } = runTippy(node, config);
    return {
        destroy
    };
}
