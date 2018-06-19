const loaded = {};

export function loadSvgs(paths) {
  return Promise.all(paths.map(requireSvg));
}

export function getSvg(path) {
  return loaded[path];
}

function requireSvg(path) {
  if (path in loaded) {
    return Promise.resolve(loaded[path]);
  }

  return fetchSvg(path);
}

async function fetchSvg(path) {
  const response = await fetch(path);
  const svgText = await response.text();
  const svg = makeDom(svgText);
  loaded[path] = svg;
  return svg;
}

function makeDom(svgText) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = svgText.trim();
  return wrapper.firstChild;
}
