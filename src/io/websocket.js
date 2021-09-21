import ReconnectingWebsocket from "./reconnecting-websocket";

// Establishes websocket connection on given url and then calls receive for
// every object sent from the server. Returns a promise that resolves when
// receive returns true or when the server closes the connection.
export function streamAll(url, receive) {
  const turns = {};
  let done = false;

  return new Promise((resolve, reject) => {
    const ws = new ReconnectingWebsocket(url);
    ws.addEventListener("message", e => {
      const obj = JSON.parse(e.data);
      const eventData = obj.Data;
      if (turns[eventData.Turn]) {
        return;
      }
      turns[eventData.Turn] = true;

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
