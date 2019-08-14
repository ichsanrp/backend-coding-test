import sqlite3 = require("sqlite3");
import * as Error from "../utils/error";
import {Rides} from "./rides";

export const errNotFound: Error.Error = new Error.Error("RIDES_NOT_FOUND_ERROR", "Could not find any rides");
export class RidesModel {

    public static persist(ride: Rides) {
        return new Promise((resolve, reject) => {
            // tslint:disable-next-line:max-line-length
            RidesModel.insertStatement.run([ride.startLat, ride.startLong, ride.endLat, ride.endLong, ride.riderName, ride.driverName, ride.driverVehicle],
                function(err) {
                    if (err) {
                        return reject(err);
                    }
                    ride.rideID = this.lastID;
                    resolve(this.lastID);
                },
            );
        });
    }

    public static initDB(db: sqlite3.Database) {
        db.serialize(() => {
            db.run(RidesModel.createRideTableSchema);
            RidesModel.getByIDStatement = db.prepare("SELECT * FROM Rides WHERE rideID = ?");
            RidesModel.getPaginationStatement = db.prepare("SELECT * FROM Rides limit ? offset ?");
            RidesModel.insertStatement = db.prepare(`
                INSERT INTO Rides
                (startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
        });
    }

    public static getByID(id: number) {
        return new Promise((resolve, reject) => {
            RidesModel.getByIDStatement.get(id,
                (err, rows) => {
                    if (err) {
                        return reject(err);
                    }

                    if (rows === undefined) {
                        return reject(errNotFound);
                    }

                    resolve(rows);
                },
            );
        });
    }

    public static getPagination(limit: number, offset: number) {
        return new Promise((resolve, reject) => {
            RidesModel.getPaginationStatement.all([limit, offset],
                (err, rows) => {
                    if (err) {
                        return reject(err);
                    }

                    if (rows.length === 0) {
                        return reject(errNotFound);
                    }

                    resolve(rows);
                },
            );
        });
    }
    private static createRideTableSchema = `
        CREATE TABLE IF NOT EXISTS Rides
        (
            rideID INTEGER PRIMARY KEY AUTOINCREMENT,
            startLat DECIMAL NOT NULL,
            startLong DECIMAL NOT NULL,
            endLat DECIMAL NOT NULL,
            endLong DECIMAL NOT NULL,
            riderName TEXT NOT NULL,
            driverName TEXT NOT NULL,
            driverVehicle TEXT NOT NULL,
            created DATETIME default CURRENT_TIMESTAMP
        )
    `;
    private static insertStatement: sqlite3.Statement;
    private static getByIDStatement: sqlite3.Statement;
    private static getPaginationStatement: sqlite3.Statement;
}
