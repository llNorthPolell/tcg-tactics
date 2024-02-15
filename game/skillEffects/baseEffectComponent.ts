import { EffectData } from "../data/types/effectData";
import { Position } from "../data/types/position";
import { UnitData } from "../data/types/unitData";
import { ValueType } from "../enums/keys/valueType";
import Unit from "../gameobjects/units/unit";
import EffectSystem from "../system/effectSystem";
import EffectComponent from "./effectComponent";

export default abstract class BaseEffectComponent implements EffectComponent{
    protected active:boolean;

    constructor(
        public readonly type: string,
        public readonly amount?: number,
        public readonly valueType: string=ValueType.VALUE,
        public readonly stat?: string,
        public readonly unit?: UnitData
    ){
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