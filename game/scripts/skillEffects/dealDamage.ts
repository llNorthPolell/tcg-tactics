import UnitStats from "@/game/data/unitStats";
import SkillEffect from "./skillEffect";
import { ValueType } from "@/game/enums/valueType";

export default class DealDamage implements SkillEffect{
    readonly target:UnitStats;
    readonly amount:number;
    readonly valueType: ValueType;
    readonly isDelayed:boolean;  
    readonly isDoT:boolean;   
    readonly duration:number;
    readonly isRemovable: boolean;
    private currTime:number;
    private active:boolean;

/**
 * This effect will deal damage to the target. Can be used for instant damage, damage over time or delayed damage.
 * @param amount - Amount of damage to deal to target
 * @param target - Target to apply damage to
 * @param valueType - Actual value or percentage
 * @param duration - How long this effect lasts. Set to -1 if intended to be permanent.
 * @param isDoT - If true, will apply damage over time
 * @param isDelayed - If true, will apply damage when time is up
 * @param isRemovable - If true, can be removed by a cleansing effect
 */
    constructor(amount: number, target:UnitStats, valueType=ValueType.VALUE, duration=0, isDoT=false, isDelayed=false, isRemovable=true){
        this.amount = amount;
        this.valueType=valueType;
        this.target = target;

        this.isDelayed=isDelayed;
        this.isDoT=isDoT;

        this.duration=((isDoT || isDelayed) && duration > 0)?duration:0;
        this.currTime=0;
            
        this.isRemovable=isRemovable;

        this.active=true;
    }
    

    getCurrTime(){
        return this.currTime;
    }


    isActive(){
        return this.active;
    }


    private applyDamage(){
        const damageDealt = (this.valueType===ValueType.VALUE)? 
            this.amount : 
            Math.floor(this.target.currHp*(this.amount/100));
        this.target.currHp-=damageDealt;
        console.log(`Deal ${damageDealt} damage to target`);
    }

    apply(): void {
        if (!this.active) return;

        let doDamage = true; 
        if (this.isDoT || this.isDelayed)
            this.currTime++;

        if (this.isDelayed && this.currTime<this.duration)
            doDamage=false;

        if (doDamage)
            this.applyDamage();

        if (this.currTime >= this.duration && this.duration>-1) 
            this.remove();
    }

    remove():void{
        if (!this.isRemovable){
            console.log("This spell effect cannot be removed.");
            return;
        }
        this.active=false;
        console.log("This spell effect has been removed.")
    }
    
}