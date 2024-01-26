import { EffectData } from "../data/types/effectData";
import { Position } from "../data/types/position";
import { UnitData } from "../data/types/unitData";
import { ValueType } from "../enums/keys/valueType";
import Unit from "../gameobjects/units/unit";
import EffectSystem from "../system/effectSystem";
import EffectComponent from "./effectComponent";

export default abstract class BaseEffectComponent implements EffectComponent{
    readonly type: string;
    readonly amount?: number;
    readonly valueType: string;
    readonly stat?: string;
    readonly unit?: UnitData;
    protected active:boolean;

    constructor(type:string,amount?:number,valueType:string=ValueType.VALUE,stat?:string,unit?:UnitData){
        this.type=type;
        this.amount=amount;
        this.valueType=valueType;
        this.stat=stat;
        this.unit=unit;
        this.active=false;
    }


    abstract apply(target?: Unit | Position | undefined, effectSystem?:EffectSystem): void;
    
    remove(): void {
        this.active=false;
    }

    setActive(active:boolean){
        this.active=active;
    }

    isActive(){
        return this.active;
    }

}