import { Position } from "../data/types/position";
import CardContent from "../gameobjects/common/cardContent";
import Unit from "../gameobjects/units/unit";
import EffectComponent from "./effectComponent";

export default class Effect implements CardContent{
    /**
     * Name of the effect
     */
    readonly name:string;

    /**
     * Description as shown on the card
     */
    readonly description: string;

    /**
     * What this effect can be casted on
     */
    readonly targetType:string;

    /**
     * How long this skill will last
     * @note 0 or undefined = instant
     * @note > 0 = timed 
     * @note -1 = permanent
     */
    readonly duration:number;

    /**
     * Timer until
     * Effect expires when currTime = duration.
     */
    private currTime:number;

    /**
     * Range of area of effect
     * @note > 0 = Area of Effect
     * @note 0 or undefined = Single Target
     * @note -1 = Global
     */
    range:number;

    /**
     * Applies this effect only on specified condition
     * @note On Cast/Removal (casted once): onCast, onRemove, onSummon
     * @note Turn-based (casted every turn): onTurnStart, onTurnEnd 
     * @note Combat (casted during combat): onAttack, onReceiveHit, onKill, onDeath, onHealth<X
     * @note Position: onEnter, onLeave, inRange
     * @note Target-based: isClass=X, isHero, isUnit
     * @note Default: undefined
     */
    triggers: string[];

    /**
     * Modular effect handlers that actually apply effects
     */
    private components:EffectComponent[];

    /**
     * Active If true, will run apply() method
     */
    private active:boolean;

    /**
     * If true, effect can be removed with a cleanse spell.
     * If false, effect can only be removed forcefully using
     * forceRemove().
     */
    readonly isRemovable:boolean;

    constructor(name:string, description:string, targetType:string, duration:number=0, range:number=0, triggers:string[], isRemovable:boolean=false){
        this.name=name;
        this.description=description;
        this.targetType=targetType;
        this.duration=duration;
        this.range=range;
        this.triggers=triggers;
        this.components=[];
        this.active=false;
        this.isRemovable=isRemovable;
        this.currTime=0;
    }

    /**
     * Adds effect components to this effect. For example, add two statChange components for a skill
     * that has a description (+2 PWR/DEF).
     * @param newComponents New effect components to add to this effect
     */
    addComponents(newComponents:EffectComponent[]){
        this.components = [...this.components,...newComponents];
    }

    /**
     * @returns List of components in this effect.
     */
    getComponents(){
        return this.components;
    }
    
    /**
     * @param target Applies the effect onto the target unit or position on the field. 
     */
    apply(target?:Unit|Position){
        this.components.forEach(
            component=>{
                component.apply(target);
            }
        )
        if(this.duration<=0)return;
        this.currTime++;
        
        if (this.currTime==this.duration)return;
    }

    /**
     * 
     * @param active If true, will run apply() method
     */
    setActive(active:boolean){
        this.active=active;
    }

    /**
     * 
     * @returns If true, will run apply() method
     */
    isActive():boolean{
        return this.active;
    }

    /**
     * 
     */
    remove(): void {
        if(!this.isRemovable) return;
        this.forceRemove();
    }

    forceRemove(): void {
        this.components.forEach(
            component=>{
                component.remove();
            }
        );
        this.active=false;
    }

    reset(): void {
        this.currTime=0;
    }
    
}