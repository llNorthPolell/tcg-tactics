import { ValueType } from "@/game/enums/keys/valueType";
import Unit from "@/game/gameobjects/unit";
import { EventEmitter } from "../events";
import { EVENTS } from "@/game/enums/keys/events";
import { UI_COLORS } from "@/game/enums/keys/uiColors";
import BaseSkillEffect from "./baseSkillEffect";

export default abstract class HealthChange extends BaseSkillEffect{
    protected target?:Unit;
    readonly amount:number;
    readonly valueType: string;
    readonly isDelayed:boolean;  
    readonly applyOverTime:boolean;   

    /**
     * This effect will deal damage to the target. Can be used for instant damage, damage over time or delayed damage.
     * @param name - Name of the skill effect
     * @param amount - Amount of damage to deal to target. Positive to heal, negative to damage.
     * @param valueType - Actual value or percentage
     * @param duration - How long this effect lasts. Set to -1 if intended to be permanent.
     * @param applyOverTime - If true, will apply heal/damage over time
     * @param isDelayed - If true, will apply damage when time is up
     * @param isRemovable - If true, can be removed by a cleansing effect
     */
    constructor(name:string,amount: number, valueType : string=ValueType.VALUE, duration=0, applyOverTime=false, isDelayed=false, isRemovable=true){
        super(name,((applyOverTime || isDelayed) && duration > 0)?duration:0,isRemovable);

        this.amount = amount;
        this.valueType=valueType;

        this.isDelayed=isDelayed;
        this.applyOverTime=applyOverTime;
    }


    private applyChange(){
        if (!this.target) return;
        const baseCurrHp = this.target.getUnitData().currHp;
        const maxHp = this.target.getUnitData().maxHP;
        const deltaCurrHp = (this.valueType===ValueType.VALUE)? 
            this.amount : 
            Math.ceil(baseCurrHp*(this.amount/100));
        let newCurrHp = baseCurrHp + deltaCurrHp;
        if (newCurrHp > maxHp)
            newCurrHp = maxHp;
        this.target.getUnitData().currHp = newCurrHp;
        EventEmitter.emit(EVENTS.uiEvent.PLAY_FLOATING_TEXT,this.target,deltaCurrHp,(deltaCurrHp>0)? UI_COLORS.heal:UI_COLORS.damage);
        console.log((deltaCurrHp > 0)?`Heal target by ${deltaCurrHp} health`:`Deal ${deltaCurrHp} damage to target`);
    }

    apply(): void {
        if (!this.active) return;

        let doChange = true; 
        if (this.applyOverTime || this.isDelayed)
            this.currTime++;

        if (this.isDelayed && this.currTime<this.duration)
            doChange=false;

        if (doChange)
            this.applyChange();

        if (!this.duration) 
            this.remove();

        if (this.duration>0 && this.currTime >= this.duration) 
            this.remove();
    }

}