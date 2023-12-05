import { ValueType } from "@/game/enums/valueType";
import SkillEffect from "./skillEffect";
import { UnitStatField } from "@/game/enums/unitStatField";
import UnitStats from "@/game/data/unitData";

export default abstract class StatChange implements SkillEffect{
    readonly name:string;
    target?:UnitStats;
    readonly amount:number;
    readonly valueType: ValueType;  
    readonly stat: UnitStatField;
    readonly duration:number;
    readonly isRemovable: boolean;
    protected currTime:number;
    protected active:boolean;
    protected applied:boolean;
    protected delta:number;


    /**
     * Change the target's stat.
     * @param name - Name of the skill effect
     * @param amount - Amount to change
     * @param valueType - Actual value or percentage
     * @param stat - Which stat to change (one of Max HP, Max SP, Power, Defence, Movement)
     * @param duration - How long this effect lasts. Set to -1 if intended to be permanent.
     * @param isRemovable - If true, can be removed by a cleansing effect
     */
    constructor(name:string, amount: number, valueType=ValueType.VALUE, stat:UnitStatField, duration=0, isRemovable=true){
        this.name=name;
        this.amount = amount;
        this.valueType=valueType;
        this.stat = stat;

        this.duration = duration;
        this.currTime = 0;

        this.isRemovable=isRemovable;

        this.active=true;
        this.applied=false;

        this.delta = 0;
    }

    getAmount(){
        return this.amount;
    }

    getStat(){
        return this.stat;
    }

    getDuration(){
        return this.duration;
    }

    getCurrTime(){
        return this.currTime;
    }

    isActive(){
        return this.active;
    }

    private applyStatChange(){
        switch(this.stat){
            case UnitStatField.HP:
                this.delta = (this.valueType===ValueType.VALUE)?
                    this.amount:
                    Math.floor(this.target!.baseMaxHp * this.amount/100);
                this.target!.maxHP +=this.delta;
                break;
            case UnitStatField.SP:
                this.delta = (this.valueType===ValueType.VALUE)?
                    this.amount:
                    Math.floor(this.target!.baseMaxSp * this.amount/100);
                this.target!.maxSP +=this.delta;
                break;
            case UnitStatField.PWR:
                this.delta = (this.valueType===ValueType.VALUE)?
                    this.amount:
                    Math.floor(this.target!.basePwr * this.amount/100);
                this.target!.currPwr +=this.delta;
                break;
            case UnitStatField.DEF:
                this.delta = (this.valueType===ValueType.VALUE)?
                    this.amount:
                    Math.floor(this.target!.baseDef * this.amount/100);
                this.target!.currDef +=this.delta;
                break;
            case UnitStatField.MVT:
                this.delta = (this.valueType===ValueType.VALUE)?
                    this.amount:
                    Math.floor(this.target!.baseMvt * this.amount/100);
                this.target!.currMvt +=this.delta;
                break;
            default:
                break;
        }
    }

    apply(): void {
        if (!this.active) return;

        if (!this.applied){
            this.applyStatChange();
            this.applied=true;
        }

        if (this.currTime < this.duration)
            this.currTime++;
        else if (this.currTime >= this.duration && this.duration>-1) 
            this.remove();
    }

    remove(): void {
        if (!this.isRemovable){
            console.log("This spell effect cannot be removed.");
            return;
        }
        this.forceRemove();
    }

    forceRemove():void{
        switch(this.stat){
            case UnitStatField.HP:
                this.target!.maxHP -= this.delta;
                break;
            case UnitStatField.SP:
                this.target!.maxSP -= this.delta;
                break;
            case UnitStatField.PWR:
                this.target!.currPwr -=this.delta;
                break;
            case UnitStatField.DEF:
                this.target!.currDef -=this.delta;
                break;
            case UnitStatField.MVT:
                this.target!.currMvt -=this.delta;
                break;
            default:
                break;
        }
        this.active=false;
        console.log("This spell effect has been removed.");
    }
}