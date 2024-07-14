import BadPassword from "../../exceptions/user/badpassword";
import ValueObject from "../valueobject";

export default class Password implements ValueObject<string> {

    private readonly password: string;

    constructor(password: string) {
        if (!password || password.length < 4 || password.length > 64) throw new BadPassword();
        this.password = password;
    }

    public get value(): string {
        return this.password;
    }
}