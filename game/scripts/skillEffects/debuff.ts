import { ValueType } from "@/game/enums/valueType";
import {UnitStatField} from "@/game/enums/unitStatField";
import StatChange from "./statChange";

export default class Debuff extends StatChange{

    /**
     * Reduce the target's stat.
     * @param amount - Amount to reduce
     * @param valueType - Actual value or percentage
     * @param stat - Which stat to reduce (one of Max HP, Max SP, Power, Defence, Movement)
     * @param duration - How long this effect lasts. Set to -1 if intended to be permanent.
     * @param isRemovable - If true, can be removed by a cleansing effect
     */
    constructor(name:string,amount: number, valueType=ValueType.VALUE, stat:UnitStatField, duration=0, isRemovable=true){
        super(name,-amount,valueType,stat,duration,isRemovable)
    }
}