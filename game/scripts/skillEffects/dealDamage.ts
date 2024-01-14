import { ValueType } from "@/game/enums/keys/valueType";
import HealthChange from "./healthChange";

export default class DealDamage extends HealthChange{

/**
 * This effect will deal damage to the target. Can be used for instant damage, damage over time or delayed damage.
 * @param name - Name of the skill effect
 * @param amount - Amount of damage to deal to target
 * @param valueType - Actual value or percentage
 * @param isInstant - If true, will apply effect immediately
 * @param duration - How long this effect lasts. Set to -1 if intended to be permanent. Set to 0 if intended to be instant.
 * @param applyOverTime - If true, becomes DoT
 * @param isDelayed - If true, will apply damage when time is up
 * @param isRemovable - If true, can be removed by a cleansing effect
 */
    constructor(name:string,amount: number, valueType : string=ValueType.VALUE, duration=0, applyOverTime=false, isDelayed=false, isRemovable=true){
        super(name,-amount, valueType, duration, applyOverTime, isDelayed, isRemovable);
    }
    
    clone():DealDamage{
        return new DealDamage(this.name,-this.amount,this.valueType,this.duration,this.applyOverTime,this.isDelayed,this.isRemovable);
    }
}