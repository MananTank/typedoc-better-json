import { describe } from "node:test";
import { isHook } from "../src/utils/isHook";
import { expect, test } from "vitest";

describe("utils", () => {
  test("isHook", () => {
    expect(isHook("useFoo")).toBe(true);
    expect(isHook("userFoo")).toBe(false);
    expect(isHook("bar")).toBe(false);
    expect(isHook("Bar")).toBe(false);
  });
});
