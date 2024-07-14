import NegativeNumeric from "../../exceptions/product/negativenumeric";
import ValueObject from "../valueobject";

export default class PositiveNumeric implements ValueObject<number> {

    private readonly number: number;

    constructor(number: number) {
        if (!number || number < 0) throw new NegativeNumeric();
        this.number = number;
    }

    public get value(): number {
        return this.number;
    }
}