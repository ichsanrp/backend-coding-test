import { expect } from "chai";
import * as Error from "../src/utils/error";
import * as logical from "../src/utils/logical";

describe("logical operator", () => {
  it("notInRange true", () => {
    const result = logical.notInRange(10 , 2, 5);
    expect(result).equal(true);
  });

  it("notInRange false", () => {
    const result = logical.notInRange(4 , 2, 5);
    expect(result).equal(false);
  });

  it("notEmptyString true", () => {
    const result = logical.notEmptyString("test");
    expect(result).equal(true);
  });

  it("notEmptyString false", () => {
    const result = logical.notEmptyString("");
    expect(result).equal(false);
  });
});
describe("error object", () => {
    it("error creation", () => {
      const result = new Error.Error("test", "test");
      expect(result).instanceOf(Error.Error);
    });
});
