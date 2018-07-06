import {
  parseQueryString,
  makeQueryString,
  httpToWsProtocol,
  join
} from "./url";

describe("join", () => {
  it("joins two without slashes", () => {
    const result = join("aaa", "bbb");
    expect(result).toBe("aaa/bbb");
  });

  it("joins three without slashes", () => {
    const result = join("aaa", "bbb", "ccc");
    expect(result).toBe("aaa/bbb/ccc");
  });

  it("joins two with slashes", () => {
    const result = join("aaa/", "/bbb");
    expect(result).toBe("aaa/bbb");
  });

  it("joins three with slashes", () => {
    const result = join("aaa/", "bbb/", "/ccc");
    expect(result).toBe("aaa/bbb/ccc");
  });

  it("joins with empty middle value", () => {
    const result = join("aaa/", "", "/ccc");
    expect(result).toBe("aaa/ccc");
  });

  it("joins with empty end value", () => {
    const result = join("aaa/", "bbb", "");
    expect(result).toBe("aaa/bbb");
  });

  it("joins with empty start value", () => {
    const result = join("/", "", "/ccc");
    expect(result).toBe("ccc");
  });
});

describe("parseQueryString", () => {
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
});

describe("makeQueryString", () => {
  it("works with multiple values", () => {
    const result = makeQueryString({ a: "aaa", b: "bbb" });
    expect(result).toBe("?a=aaa&b=bbb");
  });

  it("works with singel value", () => {
    const result = makeQueryString({ a: 1 });
    expect(result).toBe("?a=1");
  });
});

describe("httpToWsProtocol", () => {
  it("works with http", () => {
    expect(httpToWsProtocol("http://test")).toBe("ws://test");
  });

  it("works with https", () => {
    expect(httpToWsProtocol("https://test")).toBe("wss://test");
  });

  it("throws on unrecognized protocol", () => {
    expect(() => httpToWsProtocol("asdf://test")).toThrow();
    expect(() => httpToWsProtocol("test")).toThrow();
  });
});
