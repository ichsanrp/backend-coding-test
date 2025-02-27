import express = require("express");
import sqlite3 = require("sqlite3");
import { Controller } from "../controller";
import { Rides } from "../model/rides";
import { errNotFound, RidesModel } from "../model/ridesModel";
import Error = require("../utils/error");
import * as log from "../utils/logs";

const errParamNotSatisfied = new Error.Error("VALIDATION_ERROR", "parameter not satisfied");

export class RidesController {
    public static db: sqlite3.Database;

    public static init(db: sqlite3.Database) {
        RidesController.db = db;
        RidesModel.initDB(db);
    }

    /**
     * @swagger
     * /rides/{id}:
     *   get:
     *     summary: Get a ride record by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         description: The Ride ID
     *     responses:
     *       200:
     *         description: OK
     *         schema:
     *           $ref: '#/definitions/Ride'
     *       400:
     *         description: Bad Request
     *         schema:
     *           $ref: '#/definitions/Error'
     *       404:
     *         description: Not Found
     *         schema:
     *           $ref: '#/definitions/Error'
     */
    @Controller.route("get", "/rides/:id")
    public getByID(req: express.Request, resp: express.Response) {
        const id = parseInt(req.params.id, 10);

        if (id < 1) {
            log.loggers.info(errParamNotSatisfied.message);
            resp.status(400).send(errParamNotSatisfied);
            return;
        }

        RidesModel.getByID(id).then((row: any) => {
            resp.send(row);
        }, (e: Error.Error) => {
            log.loggers.error(e.message);
            resp.status(404).send(e);
        });
    }

    /**
     * @swagger
     * /rides:
     *   get:
     *     summary: "Get ride record list"
     *     parameters:
     *     - in: query
     *       name: page
     *       type: number
     *       description: page position
     *       default: 1
     *     - in: query
     *       name: per_page
     *       type: number
     *       description: number of records per page
     *       default: 10
     *     responses:
     *       200:
     *         description: List Of Ride
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/Ride'
     *       404:
     *         description: Not Found
     *         schema:
     *           $ref: '#/definitions/Error'
     */
    @Controller.route("get", "/rides")
    public getPage(req: express.Request, resp: express.Response) {
        const page = req.query.page === undefined ? 0 : parseInt(req.query.page, 10);
        const perPage = req.query.per_page === undefined ? 10 : parseInt(req.query.per_page, 10);
        const offset = (page * perPage);

        RidesModel.getPagination(perPage, offset).then((rows: any) => {
                resp.send(rows);
        }, (err: Error.Error) => {
                log.loggers.error(err.message);
                resp.status(404).send(err);
        });
    }

    /**
     * @swagger
     * /rides:
     *   post:
     *     summary: "Create a new ride record"
     *     parameters:
     *       - in: body
     *         name: payload
     *         schema:
     *           type: object
     *           properties:
     *              start_lat:
     *                  type: number
     *              start_long:
     *                  type: number
     *              end_lat:
     *                  type: number
     *              end_long:
     *                  type: number
     *              rider_name:
     *                  type: string
     *              driver_name:
     *                  type: string
     *              driver_vehicle:
     *                  type: string
     *     responses:
     *       200:
     *         description: Created
     *         schema:
     *           $ref: '#/definitions/Ride'
     *       400:
     *         description: Bad Request
     *         schema:
     *           $ref: '#/definitions/Error'
     *       500:
     *         description: Internal Server Error
     *         schema:
     *           $ref: '#/definitions/Error'
     *
     */
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

        const newRide = new Rides(0, riderName, driverName, driverVehicle, startLatitude, endLatitude, startLongitude, endLongitude);
        const validation = newRide.validate();
        if (validation.isValid) {
            RidesModel.persist(newRide).then(() => {
                log.loggers.info(newRide.toString());
                resp.send(newRide);
            }, (e: any) => {
                log.loggers.error(e.message);
                resp.status(500).send(e);
            });
        } else {
            log.loggers.error(validation.err.message);
            resp.status(400).send(validation.err);
        }
    }
}
