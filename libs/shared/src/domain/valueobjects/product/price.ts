import BadPrice from "../../exceptions/product/badprice";
import ValueObject from "../valueobject";

export default class Price implements ValueObject<number> {

    private readonly number: number;

    constructor(number: number) {
        if (!number || number < 1) throw new BadPrice();
        this.number = number;
    }

    public get value(): number {
        return this.number;
    }
}