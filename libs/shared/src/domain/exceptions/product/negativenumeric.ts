import { BadRequestException } from "@nestjs/common";

export default class NegativeNumeric extends BadRequestException {
    
    constructor() {
        super('The number must be greather than or equal to 0');
    }
}