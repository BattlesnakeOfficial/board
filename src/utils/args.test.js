import { parseQueryString } from "./args";

it("parses basic query", () => {
  const result = parseQueryString("?foo=bar");
  expect(result.foo).toBe("bar");
});

it("parses multiple values", () => {
  const result = parseQueryString("?foo=bar&one=two");
  expect(result.foo).toBe("bar");
  expect(result.one).toBe("two");
});

it("decodes values", () => {
  const result = parseQueryString(
    "?engine=http%3A%2F%2Flocalhost%3A3005&game=3bb6f305-04fd-4e16-935a-d7a240154dd6"
  );
  expect(result.engine).toBe("http://localhost:3005");
  expect(result.game).toBe("3bb6f305-04fd-4e16-935a-d7a240154dd6");
});

it("handles value-less args", () => {
  const result = parseQueryString("?foo=bar&test");
  expect(result.foo).toBe("bar");
  expect(result.test).toBe(true);
});

it("handles empty string", () => {
  const result = parseQueryString("");
  expect(result).toEqual({});
});

it("handles null", () => {
  const result = parseQueryString(null);
  expect(result).toEqual({});
});

it("handles undefined", () => {
  const result = parseQueryString(undefined);
  expect(result).toEqual({});
});
