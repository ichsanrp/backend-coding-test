// lib/app.ts
import helmet = require("helmet");
import sqlite3 = require("sqlite3");
const port = 8010;
const db = new sqlite3.Database(":memory:");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

// controller configuration
import { Controller } from "./src/controller";
import { HealthController } from "./src/controller/healthController";
import { RidesController } from "./src/controller/ridesController";
import * as log from "./src/utils/logs";
const env = process.env.NODE_ENV || "development";

const swaggerSpec = swaggerJSDoc({
    apis: [
        path.resolve(__dirname + "/src/controller/*"),
    ],
    swaggerDefinition: {
        info: {
            description: "This is Rides API server. This API handles request to get the Ride list, create, and get a Ride record",
            title: process.env.npm_package_name,
            version: process.env.npm_package_version,
        },
    },
});

export function listenAndServe(p: number) {
    log.initLogger("app.log", env === "development" ? "debug" : "info");
    // init all controller module
    RidesController.init(db);
    HealthController.init();
    Controller.app.use(helmet());
    Controller.app.use(
        "/doc",
        swaggerUi.serve,
        swaggerUi.setup(
            swaggerSpec,
            false,
            {},
            "",
            "",
            "",
            process.env.npm_package_name,
            (req: any, res: any, next: () => void) => {
                next();
            },
        ),
    );
    Controller.app.listen(port, () => process.stdout.write(`App started and listening on port ${port}`));
}

listenAndServe(port);
