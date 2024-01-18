import { Position } from "../data/types/position";
import { ValueType } from "../enums/keys/valueType";
import Unit from "../gameobjects/units/unit";
import Effect from "./effect";
import EffectComponent from "./effectComponent";

export default abstract class BaseEffectComponent implements EffectComponent{
    readonly type: string;
    readonly amount?: number;
    readonly valueType: string;
    readonly stat?: string;
    readonly unit?: Unit;
    readonly children?: Effect[];

    constructor(type:string,amount?:number,valueType:string=ValueType.VALUE,stat?:string,unit?:Unit,children?:Effect[]){
        this.type=type;
        this.amount=amount;
        this.valueType=valueType;
        this.stat=stat;
        this.unit=unit;
        this.children=children;
    }


    abstract apply(target?: Unit | Position | undefined): void;
    
    remove(): void {
        throw new Error("Method not implemented.");
    }

}