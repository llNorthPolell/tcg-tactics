import { SPELL_EFFECT_TYPE } from "../enums/keys/spellEffectType";
import { ValueType } from "../enums/keys/valueType";
import Unit from "../gameobjects/units/unit";
import BaseEffectComponent from "./baseEffectComponent";

export default class HealthChange extends BaseEffectComponent{
    readonly amount: number;
    readonly valueType:string;

    constructor(amount:number, valueType:string=ValueType.VALUE){
        super(SPELL_EFFECT_TYPE.healthChange,amount,valueType);
        this.amount=amount;
        this.valueType=valueType;
    }
    
    apply(target:Unit): void {
        const baseCurrHp = target.getCurrentStats().hp;
        const deltaCurrHp = (this.valueType===ValueType.VALUE)? 
            this.amount : 
            Math.ceil(baseCurrHp*(this.amount/100));

        target.getCurrentStats().hp += deltaCurrHp;

        if (target.getCurrentStats().hp > 0)return;
        this.remove();
    }
}