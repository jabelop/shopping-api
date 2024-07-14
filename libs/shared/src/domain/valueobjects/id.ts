import BadId from "../exceptions/badid";
import ValueObject from "./valueobject";

export default class Id implements ValueObject<string> {
    private readonly id: string;

    constructor(id: string) {
        const uuid4RegEx: RegExp = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
        const isValid: boolean = new RegExp(uuid4RegEx).test(id);
        if (!isValid) throw new BadId();
        this.id = id;
    }

    public get value(): string {
        return this.id;
    }
}