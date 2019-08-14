import express = require("express");
import sqlite3 = require("sqlite3");
import { Controller } from "../controller";
import { Rides } from "../model/rides";
import { RidesModel } from "../model/ridesModel";
import Error = require("../utils/error");
import * as log from "../utils/logs";

const errParamNotSatisfied = new Error.Error("VALIDATION_ERROR", "parameter not satisfied");

export class RidesController {
    public static db: sqlite3.Database;

    public static init(db: sqlite3.Database) {
        RidesController.db = db;
        RidesModel.initDB(db);
    }

    @Controller.route("get", "/rides/:id")
    public getByID(req: express.Request, resp: express.Response) {
        const id = parseInt(req.params.id, 32);

        if (id < 1) {
            log.loggers.info(errParamNotSatisfied.message);
            resp.status(400).send(errParamNotSatisfied);
        }

        RidesModel.getByID(id).then((row: any) => {
            resp.send(row);
        }, (e: Error.Error) => {
            log.loggers.error(e.message);
            resp.send(e);
        });
    }

    @Controller.route("get", "/rides")
    public getPage(req: express.Request, resp: express.Response) {
        const page = req.query.page === undefined ? 0 : parseInt(req.query.page, 32);
        const perPage = req.query.per_page === undefined ? 10 : parseInt(req.query.per_page, 32);
        const offset = (page * perPage);

        RidesModel.getPagination(perPage, offset).then((rows: any) => {
                resp.send(rows);
        }, (err: Error.Error) => {
                log.loggers.error(err.message);
                resp.send(err);
        });
    }

    @Controller.route("post", "/rides")
    public insert(req: express.Request, resp: express.Response) {
        if (req.body === undefined) {
            log.loggers.info(errParamNotSatisfied.message);
            resp.status(400).send(errParamNotSatisfied);
        }
        const startLatitude = Number(req.body.start_lat);
        const startLongitude = Number(req.body.start_long);
        const endLatitude = Number(req.body.end_lat);
        const endLongitude = Number(req.body.end_long);
        const riderName = req.body.rider_name;
        const driverName = req.body.driver_name;
        const driverVehicle = req.body.driver_vehicle;

        // tslint:disable-next-line:max-line-length
        const newRide = new Rides(0, riderName, driverName, driverVehicle, startLatitude, endLatitude, startLongitude, endLongitude);
        const validation = newRide.validate();
        if (validation.isValid) {
            RidesModel.persist(newRide).then(() => {
                resp.send(newRide);
            }, (e: any) => {
                log.loggers.error(e.message);
                resp.send(e);
            });
        } else {
            log.loggers.error(validation.err.message);
            resp.send(validation.err);
        }
    }
}
