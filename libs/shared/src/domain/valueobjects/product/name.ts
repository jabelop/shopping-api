import BadName from "../../exceptions/product/badname";
import ValueObject from "../valueobject";

export default class Name implements ValueObject<string> {

    private readonly name: string;

    constructor(name: string) {
        if (!name || name.length < 4 || name.length > 50) throw new BadName();
        this.name = name;
    }

    public get value(): string {
        return this.name;
    }
}