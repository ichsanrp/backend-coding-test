import * as chai from "chai";
import * as chaiexclude from "chai-exclude";

// tslint:disable-next-line:no-var-requires
chai.use(chaiexclude.default);
const expect = chai.expect;

import { AssertionError } from "assert";
import sqlite3 = require("sqlite3");
import {errCodeValidation, Rides} from "../src/model/rides";
import {errNotFound, RidesModel} from "../src/model/ridesModel";
const mockdb = new sqlite3.Database(":memory:");

describe("Rides Model", () => {
    it("init db", () => {
        RidesModel.initDB(mockdb);
        mockdb.each("select name from sqlite_master where type='table'", (err, table) => {
            if (table.name === "Rides") {
                expect(table.name).equal("Rides");
            }
        });
    });

    it("persist", async () => {
        const ride = new Rides(0, "test", "test", "test", 10, 10, 10, 10);
        const result = await RidesModel.persist(ride);
        expect(result).to.equal(1);

        const ride2 = new Rides(0, "test", "test", "test", 10, 10, 10, 10);
        const result2 = await RidesModel.persist(ride2);
        expect(result2).to.equal(2);
    });

    it("getbyID", async () => {
        const ride = new Rides(1, "test", "test", "test", 10, 10, 10, 10);
        const result = await RidesModel.getByID(1);
        expect(result).excluding("created").to.deep.equal(ride);
    });

    it("getbyID not found",  () => {
        // tslint:disable-next-line:no-empty
        RidesModel.getByID(100).then((i) => {

        }, (e) => {
            expect(e).equal(errNotFound);
        });
    });

    it("getPage", async () => {
        const result = await RidesModel.getPagination(10, 0);
        expect(result).length(2);

        const result2 = await RidesModel.getPagination(1, 0);
        expect(result2).length(1);
    });

  });
