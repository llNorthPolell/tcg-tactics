import { ValueType } from "@/game/enums/keys/valueType";
import HealthChange from "./healthChange";

export default class Heal extends HealthChange{

/**
 * This effect will deal damage to the target. Can be used for instant damage, damage over time or delayed damage.
 * @param name - Name of the skill effect
 * @param amount - Amount of damage to deal to target
 * @param valueType - Actual value or percentage
 * @param duration - How long this effect lasts. Set to -1 if intended to be permanent.
 * @param isDoT - If true, will apply damage over time
 * @param isDelayed - If true, will apply damage when time is up
 * @param isRemovable - If true, can be removed by a cleansing effect
 */
    constructor(name:string,amount: number, valueType : string=ValueType.VALUE, duration=0, isDoT=false, isDelayed=false, isRemovable=true){
        super(name,amount, valueType, duration, isDoT, isDelayed, isRemovable);
    }
    
}