// Creates a dictionary of parameters based on the browser window's url.
export function parseUrl() {
    return parseQueryString(window.location.search);
}

// Creates a dictionary of parameters based on the given query string. q should
// look like "?foo=bar&thing=blah".
function parseQueryString(q) {
    if (!q || !q.length) {
        return {};
    }

    // Array of key/value pairs
    const args = q.substr(1).split('&').map(parseArg);

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
    const parts = a.split('=');
    const key = parts[0];
    const value = parts[1] === undefined ? true : decodeURIComponent(parts[1]);
    return { key, value };
}