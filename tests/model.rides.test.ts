import { expect } from "chai";
import {errCodeValidation, Rides} from "../src/model/rides";

describe("Rides Object", () => {
  it("create rides", () => {
    const result = new Rides(0, "test", "test", "test", 10, 10, 10, 10);
    expect(result).instanceOf(Rides);
  });

  it("validate true", () => {
    const validation = new Rides(0, "test", "test", "test", 10, 10, 10, 10).validate();
    expect(validation.isValid).equal(true);
  });

  it("validate wrong latitude", () => {
    const validation1 = new Rides(0, "", "test", "test", -100, 10, 10, 10).validate();
    expect(validation1.isValid).equal(false);
    expect(validation1.err.errCode).equal(errCodeValidation);

    const validation2 = new Rides(0, "", "test", "test", 89, 100, 10, 10).validate();
    expect(validation2.isValid).equal(false);
    expect(validation2.err.errCode).equal(errCodeValidation);
  });

  it("validate wrong longitude", () => {
    const validation1 = new Rides(0, "", "test", "test", 10, 10, -10, 10).validate();
    expect(validation1.isValid).equal(false);
    expect(validation1.err.errCode).equal(errCodeValidation);

    const validation2 = new Rides(0, "", "test", "test", 89, 10, 10, 100).validate();
    expect(validation2.isValid).equal(false);
    expect(validation2.err.errCode).equal(errCodeValidation);
  });

  it("validate no rider", () => {
    const validation = new Rides(0, "", "test", "test", 10, 10, 10, 10).validate();
    expect(validation.isValid).equal(false);
    expect(validation.err.errCode).equal(errCodeValidation);
  });

  it("validate no driver", () => {
    const validation = new Rides(0, "test", "", "test", 10, 10, 10, 10).validate();
    expect(validation.isValid).equal(false);
    expect(validation.err.errCode).equal(errCodeValidation);
  });

  it("validate no vehicle", () => {
    const validation = new Rides(0, "test", "test", "", 10, 10, 10, 10).validate();
    expect(validation.isValid).equal(false);
    expect(validation.err.errCode).equal(errCodeValidation);
  });

});
