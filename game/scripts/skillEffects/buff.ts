import { ValueType } from "@/game/enums/keys/valueType";
import StatChange from "./statChange";

export default class Buff extends StatChange{

    /**
     * Increase the target's stat.
     * @param amount - Amount to increase
     * @param valueType - Actual value or percentage
     * @param stat - Which stat to increase (one of Max HP, Max SP, Power, Defence, Movement)
     * @param duration - How long this effect lasts. Set to -1 if intended to be permanent.
     * @param isRemovable - If true, can be removed by a cleansing effect
     */
    constructor(name:string, amount: number, valueType : string=ValueType.VALUE, stat:string, duration=0, isRemovable=true){
        super(name,amount,valueType,stat,duration,isRemovable)
    }
}