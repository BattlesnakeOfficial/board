/**
 * This file contains helper functions for async loading svg files that
 * can be injected inline into an html <svg> element. This is better than
 * alternatives for the following reasons:
 *
 *    <use href="..."> has a problem where the game could start before the
 *    svg has finished loading whereas this method gives a promise we can wait
 *    for.
 *
 *    <image src="..."> has a problem where the fill color of the image cannot
 *    be overriden. Inline svg solves this problem and allows css styles to
 *    cascade into the svg content. <use> may also have this problem?
 *
 *    Directly embedding the svg xml into react components (or similar) would
 *    mostly solve everything except that it eliminates the possibility of
 *    pulling in svg data from external trusted sources.
 *
 * The main downside to this method is that the source of the svg must be
 * trusted or else you are vulnerable to xss attacks.
 */

const loaded = {};
const doesntExist = {};

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

export async function svgExists(path) {
  if (path in loaded) {
    return true;
  }
  if (path in doesntExist) {
    return false;
  }
  //not cached yet
  try {
    const response = await fetch(path);
    const svgText = await response.text();
    const exists = svgText.startsWith("<svg");
    if (!exists) {
      doesntExist[path] = true;
    }
    return exists;
  } catch (e) {
    //Most likely a CORS issue for a specific svg
    console.warn(e, path, "Fallback to default");
    return false;
  }
}
