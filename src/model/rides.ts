import * as Error from "../utils/error";
import * as logic from "../utils/logical";

export const errCodeValidation: string = "VALIDATION_ERROR";

export class Rides {
    public rideID: number = 0;
    public startLat: number;
    public startLong: number;
    public endLat: number;
    public endLong: number;
    public riderName: string;
    public driverName: string;
    public driverVehicle: string;
    public created: Date;

    constructor(id: number, riderName: string, driverName: string, driverVehicle: string, startLat: number, endLat: number, startLong: number, endLong: number ) {
        this.rideID = id;
        this.riderName = riderName;
        this.driverName = driverName;
        this.driverVehicle = driverVehicle;
        this.startLat = startLat;
        this.endLat = endLat;
        this.endLong = endLong;
        this.startLong = startLong;
        this.startLat = startLat;
        this.created = new Date();
    }

    public validate(): {isValid: boolean; err: Error.Error; } {
        if (logic.notInRange(this.startLat, -90, 90) || logic.notInRange(this.startLong, -180, 180)) {
            return {
                err : new Error.Error(errCodeValidation, "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"),
                isValid : false,
            };
        }
        if (logic.notInRange(this.endLat, -90, 90) || logic.notInRange(this.endLong, -180, 180)) {
            return {
                err : new Error.Error(errCodeValidation, "End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"),
                isValid : false,
            };
        }

        if (!logic.notEmptyString(this.riderName)) {
            return {
                err : new Error.Error(errCodeValidation, "Rider name must be a non empty string"),
                isValid : false,
            };
        }

        if (!logic.notEmptyString(this.driverName)) {
            return {
                err : new Error.Error(errCodeValidation, "Driver name must be a non empty string"),
                isValid : false,
            };
        }

        if (!logic.notEmptyString(this.driverVehicle)) {
            return {
                err : new Error.Error(errCodeValidation, "Driver's vehicle must be a non empty string"),
                isValid : false,
            };
        }

        return {
            err : new Error.Error("", ""),
            isValid : true,
        };
    }
}
