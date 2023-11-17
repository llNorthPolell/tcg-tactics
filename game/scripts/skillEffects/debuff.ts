import { ValueType } from "@/game/enums/valueType";
import {UnitStatField} from "@/game/enums/unitStatField";
import SkillEffect from "./skillEffect";
import UnitStats from "@/game/data/unitStats";

export default class Debuff implements SkillEffect{
    readonly target:UnitStats;
    readonly amount:number;
    readonly valueType: ValueType;  
    readonly stat: UnitStatField;
    readonly duration:number;
    readonly isRemovable: boolean;
    private currTime:number;
    private active:boolean;
    private applied:boolean;
    private debuffAmount:number;

    /**
     * Reduce the target's stat.
     * @param amount - Amount to reduce
     * @param target - Target to apply debuff to
     * @param valueType - Actual value or percentage
     * @param stat - Which stat to reduce (one of Max HP, Max SP, Power, Defence, Movement)
     * @param duration - How long this effect lasts. Set to -1 if intended to be permanent.
     * @param isRemovable - If true, can be removed by a cleansing effect
     */
    constructor(amount: number, target:UnitStats, valueType=ValueType.VALUE, stat:UnitStatField, duration=0, isRemovable=true){
        this.amount = amount;
        this.target=target;
        this.valueType=valueType;
        this.stat = stat;

        this.duration = duration;
        this.currTime = 0;

        this.isRemovable=isRemovable;

        this.active=true;
        this.applied=false;

        this.debuffAmount = 0;
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

    private applyDebuff(){
        switch(this.stat){
            case UnitStatField.HP:
                this.debuffAmount = (this.valueType===ValueType.VALUE)?
                    this.amount:
                    Math.floor(this.target.baseMaxHp * this.amount/100);
                this.target.maxHP -=this.debuffAmount;
                break;
            case UnitStatField.SP:
                this.debuffAmount = (this.valueType===ValueType.VALUE)?
                    this.amount:
                    Math.floor(this.target.baseMaxSp * this.amount/100);
                this.target.maxSP -=this.debuffAmount;
                break;
            case UnitStatField.PWR:
                this.debuffAmount = (this.valueType===ValueType.VALUE)?
                    this.amount:
                    Math.floor(this.target.basePwr * this.amount/100);
                this.target.currPwr -=this.debuffAmount;
                break;
            case UnitStatField.DEF:
                this.debuffAmount = (this.valueType===ValueType.VALUE)?
                    this.amount:
                    Math.floor(this.target.baseDef * this.amount/100);
                this.target.currDef -=this.debuffAmount;
                break;
            case UnitStatField.MVT:
                this.debuffAmount = (this.valueType===ValueType.VALUE)?
                    this.amount:
                    Math.floor(this.target.baseMvt * this.amount/100);
                this.target.currMvt -=this.debuffAmount;
                break;
            default:
                break;
        }
    }

    apply(): void {
        if (!this.active) return;

        if (!this.applied){
            this.applyDebuff();
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
        switch(this.stat){
            case UnitStatField.HP:
                this.target.maxHP += this.debuffAmount;
                break;
            case UnitStatField.SP:
                this.target.maxSP += this.debuffAmount;
                break;
            case UnitStatField.PWR:
                this.target.currPwr +=this.debuffAmount;
                break;
            case UnitStatField.DEF:
                this.target.currDef +=this.debuffAmount;
                break;
            case UnitStatField.MVT:
                this.target.currMvt +=this.debuffAmount;
                break;
            default:
                break;
        }
        this.active=false;
        console.log("This spell effect has been removed.");
    }

    
}