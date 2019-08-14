import express = require("express");
import { Controller } from "../controller";

export class HealthController {

    // tslint:disable-next-line:no-empty
    public static init() {}

    @Controller.route("get", "/health")
    public healthCheck(req: express.Request, resp: express.Response) {
       resp.send("healthy");
    }
}
