// Creates a dictionary of parameters based on the given query string. q should
// look like "?foo=bar&thing=blah".
export function parseQueryString(q) {
  if (!q || !q.length) {
    return {};
  }

  // Array of key/value pairs
  const args = q
    .substr(1)
    .split("&")
    .map(parseArg);

  // Convert to object
  return args.reduce((result, arg) => {
    result[arg.key] = arg.value;
    return result;
  }, {});
}

// Converts "asdf=qwer" to { asdf: "qwer" } or "asdf" to { asdf: true }. The
// latter example is to allow switch-like parameters like ?enableThing without
// an equals sign.
function parseArg(a) {
  const parts = a.split("=");
  const key = parts[0];
  const value = parts[1] === undefined ? true : decodeURIComponent(parts[1]);
  return { key, value };
}

// Converts { a: "aaa", b: "bbb" } to "?a=aaa&b=bbb"
export function makeQueryString(query) {
  if (!query) {
    return "";
  }

  let sep = "?";
  let result = "";

  for (const key in query) {
    const value = query[key];
    result += `${sep}${key}=${value}`;
    sep = "&";
  }

  return result;
}

// Converts http://foo to ws://foo or https://foo to wss://foo
export function httpToWsProtocol(url) {
  const mappings = {
    http: "ws",
    https: "wss"
  };

  for (const from in mappings) {
    const to = mappings[from];
    if (url.substr(0, from.length + 1) === from + ":") {
      return to + url.substr(from.length);
    }
  }

  throw new Error("Invalid URL: " + url);
}

// Joins path components and makes sure there is exactly one '/' separating
// them.
export function join(...parts) {
  function joinPair(a, b) {
    const cleanA = a.replace(/\/+$/, "");
    const cleanB = b.replace(/^\/+/, "");

    if (cleanA === "") {
      return cleanB;
    }

    if (cleanB === "") {
      return cleanA;
    }

    return `${cleanA}/${cleanB}`;
  }

  return parts.reduce((current, next) => joinPair(current, next), "");
}
