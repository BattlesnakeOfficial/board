const READY_STATE_DONE = 4;

function isSuccessResponseCode(code) {
    return 200 <= code && code < 300;
}

function getText(url) {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.onreadystatechange = () => {
            if (req.readyState === READY_STATE_DONE) {
                const res = {
                    status: req.status,
                    body: req.responseText
                };

                if (isSuccessResponseCode(res.status)) {
                    resolve(res);
                } else {
                    reject(res);
                }
            }
        }

        req.open("GET", url, true);
        req.send();
    });
}

export function getJson(url) {
    return getText(url).then(
        (res) => JSON.parse(res.body),
        (res) => ({ status: res.status, body: JSON.parse(res.body) })
    );
}