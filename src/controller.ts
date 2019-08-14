import bodyParser = require("body-parser");
import express = require("express");
import helmet = require("helmet");
const jsonParser = bodyParser.json();

export class Controller {
    public static route(method: string, path: string) {
        return (
            target: any,
            propertyKey: string | symbol,
            descriptor: PropertyDescriptor,
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
            }
        };
    }
    public static start(port: number) {
        Controller.app.use(helmet());
        Controller.app.listen(port, () => process.stdout.write(`App started and listening on port ${port}`));
    }
    private static app: express.Application = express().use(jsonParser);
}
