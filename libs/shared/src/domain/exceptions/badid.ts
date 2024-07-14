import { BadRequestException } from "@nestjs/common";

export default class BadId extends BadRequestException {
    
    constructor() {
        super('Id must be a valid uuid4');
    }
}