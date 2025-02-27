import bodyParser = require("body-parser");
import express = require("express");
const jsonParser = bodyParser.json();

export class Controller {
    public static app: express.Application = express().use(jsonParser);
    public static route(method: string, path: string) {
        return (
            target: any,
            propertyKey: string | symbol,
            descriptor: any,
        ) => {
            switch (method) {
                case "get" :
                    Controller.app.get(path, descriptor.value);
                    break;
                case "post" :
                    Controller.app.post(path, descriptor.value);
                    break;
                case "put" :
                    Controller.app.put(path, descriptor.value);
                    break;
                case "delete" :
                    Controller.app.delete(path, descriptor.value);
                default:
                    Controller.app.get(path, descriptor.value);
            }
        };
    }
}
