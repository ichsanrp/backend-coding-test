import express = require("express");
import { Controller } from "../controller";

export class HealthController {

    public static init() {}

    /**
     * @swagger
     *
     * /health:
     *   get:
     *     summary: "liveliness probe"
     *     responses:
     *       200:
     *         description: OK
     */
    @Controller.route("get", "/health")
    public healthCheck(req: express.Request, resp: express.Response) {
       resp.send("healthy");
    }
}
