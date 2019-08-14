/**
 * @swagger
 *
 * definitions:
 *   Error:
 *      type: object
 *      properties:
 *        errorCode:
 *          type: string
 *        message:
 *          type: string
 */
export class Error {
    public errCode: string;
    public message: string;
    constructor(code: string, msg: string) {
        this.errCode = code;
        this.message = msg;
    }
}
