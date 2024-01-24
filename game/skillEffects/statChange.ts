import { SPELL_EFFECT_TYPE } from "../enums/keys/spellEffectType";
import { UnitStatField } from "../enums/keys/unitStatField";
import { ValueType } from "../enums/keys/valueType";
import Unit from "../gameobjects/units/unit";
import BaseEffectComponent from "./baseEffectComponent";

export default class StatChange extends BaseEffectComponent{
    readonly stat:string;

    readonly amount:number;

    readonly valueType:string;
    
    private delta:number;

    private target?:Unit;

    constructor(stat:string,amount:number,valueType:string=ValueType.VALUE){
        super(SPELL_EFFECT_TYPE.statChange,amount,valueType,stat);
        this.stat=stat;
        this.amount=amount;
        this.valueType=valueType;
        this.delta=0;
    }

    apply(target:Unit){
        if(!this.active) return;
        this.target = target;
        switch(this.stat){
            case UnitStatField.PWR:
                this.delta = (this.valueType===ValueType.VALUE)?
                    this.amount:
                    Math.floor(target.base.pwr * this.amount/100);
                target.getCurrentStats().pwr +=this.delta;
                break;
            case UnitStatField.DEF:
                this.delta = (this.valueType===ValueType.VALUE)?
                    this.amount:
                    Math.floor(target.base.def * this.amount/100);
                target.getCurrentStats().def +=this.delta;
                break;
            case UnitStatField.MVT:
                this.delta = (this.valueType===ValueType.VALUE)?
                    this.amount:
                    Math.floor(target.base.mvt * this.amount/100);
                target.getCurrentStats().mvt +=this.delta;
                break;
            case UnitStatField.RNG:
                this.delta = (this.valueType===ValueType.VALUE)?
                    this.amount:
                    Math.floor(target.base.rng * this.amount/100);
                target.getCurrentStats().rng +=this.delta;
                break;
            default:
                break;
        }
    }

    remove(){
        if(!this.target) return;
        switch(this.stat){
            case UnitStatField.PWR:
                this.target.getCurrentStats().pwr -=this.delta;
                break;
            case UnitStatField.DEF:
                this.target.getCurrentStats().def -=this.delta;
                break;
            case UnitStatField.MVT:
                this.target.getCurrentStats().mvt -=this.delta;
                break;
            case UnitStatField.RNG:
                this.target.getCurrentStats().rng -=this.delta;
                break;
            default:
                break;
        }
        this.active=false;
    }
}