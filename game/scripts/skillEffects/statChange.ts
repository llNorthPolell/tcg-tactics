import { ValueType } from "@/game/enums/keys/valueType";
import SkillEffect from "./skillEffect";
import { UnitStatField } from "@/game/enums/keys/unitStatField";
import Unit from "@/game/gameobjects/unit";

export default abstract class StatChange implements SkillEffect{
    readonly name:string;
    protected target?:Unit;
    readonly amount:number;
    readonly valueType: string;  
    readonly stat: string;
    readonly duration:number;
    readonly isRemovable: boolean;
    protected currTime:number;
    protected active:boolean;

    /**
     * If true, marks this skill effect as already applied (used to stop stacking the same debuff).
     */
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
    constructor(name:string, amount: number, valueType : string =ValueType.VALUE, stat:string, duration=0, isRemovable=true){
        this.name=name;
        this.amount = amount;
        this.valueType=valueType;
        this.stat = stat;

        this.duration = duration;
        this.currTime = 0;

        this.isRemovable=isRemovable;

        this.active=false;
        this.applied=false;

        this.delta = 0;
    }

    setTarget(target: Unit): void {
        this.target=target;
        this.active=true;
    }

    getTarget(): Unit|undefined {
        return this.target;
    }

    reset(): void {
        if(!this.duration || this.duration <= 0) return;
        this.currTime = 0;
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
                    Math.floor(this.target!.getUnitData().baseMaxHp * this.amount/100);
                this.target!.getUnitData().maxHP +=this.delta;
                break;
            case UnitStatField.SP:
                this.delta = (this.valueType===ValueType.VALUE)?
                    this.amount:
                    Math.floor(this.target!.getUnitData().baseMaxSp * this.amount/100);
                this.target!.getUnitData().maxSP +=this.delta;
                break;
            case UnitStatField.PWR:
                this.delta = (this.valueType===ValueType.VALUE)?
                    this.amount:
                    Math.floor(this.target!.getUnitData().basePwr * this.amount/100);
                this.target!.getUnitData().currPwr +=this.delta;
                break;
            case UnitStatField.DEF:
                this.delta = (this.valueType===ValueType.VALUE)?
                    this.amount:
                    Math.floor(this.target!.getUnitData().baseDef * this.amount/100);
                this.target!.getUnitData().currDef +=this.delta;
                break;
            case UnitStatField.MVT:
                this.delta = (this.valueType===ValueType.VALUE)?
                    this.amount:
                    Math.floor(this.target!.getUnitData().baseMvt * this.amount/100);
                this.target!.getUnitData().currMvt +=this.delta;
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

        if (!this.duration) 
            this.remove();
        
        if (this.currTime < this.duration)
            this.currTime++;
        else if (this.currTime >= this.duration && this.duration>0) 
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
                this.target!.getUnitData().maxHP -= this.delta;
                break;
            case UnitStatField.SP:
                this.target!.getUnitData().maxSP -= this.delta;
                break;
            case UnitStatField.PWR:
                this.target!.getUnitData().currPwr -=this.delta;
                break;
            case UnitStatField.DEF:
                this.target!.getUnitData().currDef -=this.delta;
                break;
            case UnitStatField.MVT:
                this.target!.getUnitData().currMvt -=this.delta;
                break;
            default:
                break;
        }
        this.active=false;
        console.log("This spell effect has been removed.");
    }
}