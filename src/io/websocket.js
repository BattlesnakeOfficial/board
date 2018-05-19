export function streamAll(url, receive) {
  let done = false;

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    ws.addEventListener("message", e => {
      const obj = JSON.parse(e.data);
      done = receive(obj);
      if (done) {
        ws.close();
        resolve();
      }
    });

    ws.addEventListener("onerror", e => {
      reject(e);
    });

    ws.addEventListener("onclose", e => {
      if (!done) {
        done = true;
        resolve();
      }
    });
  });
}
