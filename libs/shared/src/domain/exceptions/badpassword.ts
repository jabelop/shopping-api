import { BadRequestException } from "@nestjs/common";

export default class BadPassword extends BadRequestException {
    
    constructor() {
        super('Password must be 8-30 characters length string');
    }
}