import { BadRequestException } from "@nestjs/common";

export default class BadName extends BadRequestException {
    
    constructor() {
        super('The name must be 4-50 characters length string');
    }
}