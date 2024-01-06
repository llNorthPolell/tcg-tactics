import UnitStats from "@/game/data/unitData";
import SkillEffect from "./skillEffect";
import { ValueType } from "@/game/enums/keys/valueType";

export default abstract class HealthChange implements SkillEffect{
    readonly name : string;
    target?:UnitStats;
    readonly amount:number;
    readonly valueType: string;
    readonly isDelayed:boolean;  
    readonly isDoT:boolean;   
    readonly duration:number;
    readonly isRemovable: boolean;
    protected currTime:number;
    protected active:boolean;

/**
 * This effect will deal damage to the target. Can be used for instant damage, damage over time or delayed damage.
 * @param name - Name of the skill effect
 * @param amount - Amount of damage to deal to target. Positive to heal, negative to damage.
 * @param valueType - Actual value or percentage
 * @param duration - How long this effect lasts. Set to -1 if intended to be permanent.
 * @param isDoT - If true, will apply damage over time
 * @param isDelayed - If true, will apply damage when time is up
 * @param isRemovable - If true, can be removed by a cleansing effect
 */
    constructor(name:string,amount: number, valueType : string=ValueType.VALUE, duration=0, isDoT=false, isDelayed=false, isRemovable=true){
        this.name = name;
        this.amount = amount;
        this.valueType=valueType;

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


    private applyChange(){
        const deltaCurrHp = (this.valueType===ValueType.VALUE)? 
            this.amount : 
            Math.floor(this.target!.currHp*(this.amount/100));
        this.target!.currHp+=deltaCurrHp;

        console.log((deltaCurrHp > 0)?`Heal target by ${deltaCurrHp} health`:`Deal ${deltaCurrHp} damage to target`);
    }

    apply(): void {
        if (!this.active) return;

        let doChange = true; 
        if (this.isDoT || this.isDelayed)
            this.currTime++;

        if (this.isDelayed && this.currTime<this.duration)
            doChange=false;

        if (doChange)
            this.applyChange();

        if (this.currTime >= this.duration && this.duration>-1) 
            this.remove();
    }

    remove():void{
        if (!this.isRemovable){
            console.log("This spell effect cannot be removed.");
            return;
        }
        this.forceRemove();
    }


    forceRemove():void{
        this.active=false;
        console.log("This spell effect has been removed.");
    }
    
}