import { BadRequestException } from "@nestjs/common";

export default class BadUserName extends BadRequestException {
    
    constructor() {
        super('Username be 4-20 characters length string');
    }
}