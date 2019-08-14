// lib/app.ts
import express = require("express");
import sqlite3 = require("sqlite3");
const port = 8010;
const db = new sqlite3.Database(":memory:");

// controller configuration
import { Controller } from "./src/controller";
import { HealthController } from "./src/controller/health";
import { RidesController } from "./src/controller/rides";

export function listenAndServe(p: number) {
    // init all controller module
    RidesController.init(db);
    HealthController.init();

    Controller.start(p);
}

listenAndServe(port);
