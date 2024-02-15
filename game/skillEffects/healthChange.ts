import { SPELL_EFFECT_TYPE } from "../enums/keys/spellEffectType";
import { ValueType } from "../enums/keys/valueType";
import Unit from "../gameobjects/units/unit";
import BaseEffectComponent from "./baseEffectComponent";

export default class HealthChange extends BaseEffectComponent{
    constructor(
        public readonly amount: number, 
        public readonly valueType:string=ValueType.VALUE
    ){
        super(SPELL_EFFECT_TYPE.healthChange,amount,valueType);
    }
    
    apply(target:Unit): void {
        if (!this.active) return;
        const baseCurrHp = target.getCurrentStats().hp;
        const deltaCurrHp = (this.valueType===ValueType.VALUE)? 
            this.amount : 
            Math.ceil(baseCurrHp*(this.amount/100));

        target.combat.changeHealth(deltaCurrHp);
        
        if (target.getCurrentStats().hp > 0)return;
        target.combat.killUnit();
    }
}