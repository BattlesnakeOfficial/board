import { parseQueryString } from "./args";

function sum(a, b) {
  return a + b;
}

it("parses basic query", () => {
  const result = parseQueryString("?foo=bar");
  expect(result.foo).toEqual("bar");
});

it("parses multiple values", () => {
  const result = parseQueryString("?foo=bar&one=two");
  expect(result.foo).toEqual("bar");
  expect(result.one).toEqual("two");
});

it("decodes values", () => {
  const result = parseQueryString(
    "?engine=http%3A%2F%2Flocalhost%3A3005&game=3bb6f305-04fd-4e16-935a-d7a240154dd6"
  );
  expect(result.engine).toEqual("http://localhost:3005");
  expect(result.game).toEqual("3bb6f305-04fd-4e16-935a-d7a240154dd6");
});

it("handles value-less args", () => {
  const result = parseQueryString("?foo=bar&test");
  expect(result.foo).toEqual("bar");
  expect(result.test).toEqual(true);
});
