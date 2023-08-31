const mediaCache: { [key: string]: string } = {};

export async function fetchCustomizationSvgDef(type: string, name: string) {
  const mediaPath = `snakes/${type}s/${name}.svg`;

  if (!(mediaPath in mediaCache)) {
    mediaCache[mediaPath] = await fetch(`https://media.battlesnake.com/${mediaPath}`)
      .then((response) => response.text())
      .then((textSVG) => {
        const tempElememt = document.createElement("template");
        tempElememt.innerHTML = textSVG.trim();
        console.debug(`[customizations] loaded svg definition for ${mediaPath}`);
        return tempElememt.content.firstChild.innerHTML;
      });
  }
  return mediaCache[mediaPath];
}
