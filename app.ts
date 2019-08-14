// lib/app.ts
import helmet = require("helmet");
import sqlite3 = require("sqlite3");
const port = 8010;
const db = new sqlite3.Database(":memory:");

// controller configuration
import { Controller } from "./src/controller";
import { HealthController } from "./src/controller/healthController";
import { RidesController } from "./src/controller/ridesController";
import * as log from "./src/utils/logs";

export function listenAndServe(p: number) {
    log.initLogger("app.log");
    // init all controller module
    RidesController.init(db);
    HealthController.init();
    Controller.app.use(helmet());
    Controller.app.listen(port, () => process.stdout.write(`App started and listening on port ${port}`));
}

listenAndServe(port);
