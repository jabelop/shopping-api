import { BadRequestException } from "@nestjs/common";

export default class BadPrice extends BadRequestException {
    
    constructor() {
        super('The number must be greather than 0');
    }
}