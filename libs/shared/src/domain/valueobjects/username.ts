import BadUserName from "../exceptions/badusername";
import ValueObject from "./valueobject";

export default class UserName implements ValueObject<string> {

    private readonly username: string;

    constructor(username: string) {
        if (!username || username.length < 4 || username.length > 20) {
            throw new BadUserName();
        }
        this.username = username;
    }

    public get value(): string {
        return this.username;
    }
}