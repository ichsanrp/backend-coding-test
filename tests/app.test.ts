import * as chai from "chai";
import * as chaiexclude from "chai-exclude";
import chaiHttp = require("chai-http");
import express = require("express");
chai.use(chaiHttp);
chai.use(chaiexclude.default);
const expect = chai.expect;
const chaiLib = chai as any;
const chaiRequestLib = chaiLib.default.request;

import sqlite3 = require("sqlite3");
import {Controller} from "../src/controller";
import {HealthController} from "../src/controller/healthController";
import {RidesController} from "../src/controller/ridesController";
import {errNotFound} from "../src/model/ridesModel";
const mockdb = new sqlite3.Database(":memory:");
const ctrl = new RidesController();
const listEndpoints = require("express-list-endpoints");
import * as log from "../src/utils/logs";

describe("App", () => {
    log.initLogger("test.log", "debug");

    it("init routing", () => {
        Controller.route("get", "/get")(null, "", {
            value(req: express.Request, resp: express.Response) {
                resp.send("Test");
            },
        });
        Controller.route("post", "/post")(null, "", {
            value(req: express.Request, resp: express.Response) {
                resp.send("Test");
            },
        });
        Controller.route("put", "/put")(null, "", {
            value(req: express.Request, resp: express.Response) {
                resp.send("Test");
            },
        });
        Controller.route("delete", "/delete")(null, "", {
            value(req: express.Request, resp: express.Response) {
                resp.send("Test");
            },
        });
        Controller.route("default", "/default")(null, "", {
            value(req: express.Request, resp: express.Response) {
                resp.send("Test");
            },
        });
        expect(listEndpoints(Controller.app)).to.satisfy((routes: any) => {
            let valid: boolean = true;
            const paths = ["/get", "/post", "/put", "/delete", "/default"];
            for (const path of paths) {
                let check: boolean = false;
                for (const route of routes) {
                    if (path === route.path) {
                        check = true;
                        break;
                    }
                }
                if (!check) {
                    valid = valid && false;
                }
            }
            return valid;
        });
    });

    it("init controller", () => {
        RidesController.init(mockdb);
        HealthController.init();
        expect(RidesController.db).equal(mockdb);
    });

    it("healthcheck", () => {
        return chaiRequestLib(Controller.app).get("/health").then((res: { text: any; }) => {
        chai.expect(res.text).to.eql("healthy");
      });
    });

    it("insert 1", () => {
        return chaiRequestLib(Controller.app)
            .post("/rides")
            .type("application/json")
            .send({
                driver_name: "test",
                driver_vehicle: "test",
                end_lat: 20,
                end_long: 30,
                rider_name: "test",
                start_lat: 10,
                start_long: 10,
            })
            .then((res: { text: any; }) => {
                chai.expect(JSON.parse(res.text)).excluding("created").to.contain(
                {
                    driverName: "test",
                    driverVehicle: "test",
                    endLat: 20,
                    endLong: 30,
                    rideID: 1,
                    riderName: "test",
                    startLat: 10,
                    startLong: 10,
                });
            });
    });

    it("insert failed", () => {
        return chaiRequestLib(Controller.app)
            .post("/rides")
            .type("application/json")
            .send()
            .then((res: { text: any; }) => {
                chai.expect(res).have.status(400);
            });
    });

    it("insert 2", () => {
        return chaiRequestLib(Controller.app)
            .post("/rides")
            .type("application/json")
            .send({
                driver_name: "test",
                driver_vehicle: "test",
                end_lat: 20,
                end_long: 30,
                rider_name: "test",
                start_lat: 10,
                start_long: 10,
            })
            .then((res: { text: any; }) => {
                chai.expect(JSON.parse(res.text)).excluding("created").to.contain(
                {
                    driverName: "test",
                    driverVehicle: "test",
                    endLat: 20,
                    endLong: 30,
                    rideID: 2,
                    riderName: "test",
                    startLat: 10,
                    startLong: 10,
                });
            });
    });

    it("get by id", () => {
        return chaiRequestLib(Controller.app).get("/rides/1")
            .then((res: { text: any; }) => {
                chai.expect(JSON.parse(res.text)).excluding("created").to.contain({
                    driverName: "test",
                    driverVehicle: "test",
                    endLat: 20,
                    endLong: 30,
                    rideID: 1,
                    riderName: "test",
                    startLat: 10,
                    startLong: 10,
                },
            );
        });
    });

    it("get by id wrong param", () => {
        return chaiRequestLib(Controller.app).get("/rides/0")
            .then((res: { text: any; }) => {
                chai.expect(res).have.status(400);
        });
    });

    it("get by id not found", () => {
        return chaiRequestLib(Controller.app).get("/rides/3")
            .then((res: { text: any; }) => {
                chai.expect(JSON.parse(res.text)).to.contain(errNotFound);
        });
    });

    it("get by page", () => {
        return chaiRequestLib(Controller.app).get("/rides")
            .then((res: { text: any; }) => {
                chai.expect(JSON.parse(res.text)).to.length(2);
        });
    });

    it("get by page, per_page 1", () => {
        return chaiRequestLib(Controller.app).get("/rides")
            .query({per_page: 1, page: 0})
            .then((res: { text: any; }) => {
                chai.expect(JSON.parse(res.text)).to.length(1);
        });
    });

    it("get by page, not found", () => {
        return chaiRequestLib(Controller.app).get("/rides")
            .query({per_page: 10, page: 2})
            .then((res: { text: any; }) => {
                chai.expect(JSON.parse(res.text)).to.contain(errNotFound);
        });
    });
});
