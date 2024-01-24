import { Position } from "../data/types/position";
import Unit from "../gameobjects/units/unit";
import EffectComponent from "./effectComponent";

export default class Effect{
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
    readonly range:number;

    /**
     * Applies this effect only on specified condition
     * @note On Cast/Removal (casted once): onCast, onRemove, onSummon
     * @note Turn-based (casted every turn): onTurnStart, onTurnEnd 
     * @note Combat (casted during combat): onAttack, onReceiveHit, onKill, onDeath, onHealth<X
     * @note Position: onEnter, onLeave, inRange
     * @note Target-based: isClass=X, isHero, isUnit
     * @note Default: undefined
     */
    readonly trigger: string;

    /**
     * Modular effect handlers that actually apply effects
     */
    readonly components:EffectComponent[];

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

    /**
     * The target to apply this skill to. If target is a unit, applies the effects directly. 
     * If target is a position, will create this effect on units in range. 
     */
    private target?:Unit|Position;

    constructor(name:string, description:string, targetType:string, duration:number=0, range:number=0, trigger:string, isRemovable:boolean=false){
        this.name=name;
        this.description=description;
        this.targetType=targetType;
        this.duration=duration;
        this.range=range;
        this.trigger=trigger;
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
        this.components.push(...newComponents);
    }

    /**
     * @returns List of components in this effect.
     */
    getComponents():EffectComponent[]{
        return this.components;
    }

    /**
     * @returns List of components with the specified type in this effect
     */
    getComponentsByType(type:string):EffectComponent[]{
        return this.components.filter(component=>component.type === type);
    }
    
    /**
     * Applies the effect onto the assigned target unit or position on the field. 
     */
    apply(){
        console.log(`Applied ${this.name} onto ${(this.target instanceof Unit)?this.target?.name: `${this.target?.x},${this.target?.y}`}...`);
        this.components.forEach(
            component=>{
                component.apply(this.target);
            }
        )
        if(this.duration<=0)return;
        this.currTime++;
        
        if (this.currTime<this.duration)return;
        console.log(`${this.name} has ended...`);
        this.forceRemove();
    }

    /**
     * Sets the target for this skill
     */
    setTarget(target:Unit|Position){
        this.target=target;
        this.components.forEach(
            component=>{
                component.setActive(true);
            }
        )
    }

    /**
     * Sets active status of this effect.
     * @param active If true, will run apply() method
     */
    setActive(active:boolean){
        this.active=active;
    }

    /**
     * @returns If true, will run apply() method
     */
    isActive():boolean{
        return this.active;
    }

    /**
     * Removes an effect if it is removable. 
     */
    remove(): void {
        if(!this.isRemovable) return;
        this.forceRemove();
    }

    /**
     * Removes an effect forcefully, even if it is marked as not removable.
     */
    forceRemove(): void {
        this.components.forEach(
            component=>{
                component.remove();
            }
        );
        this.reset();
    }

    /**
     * Resets this effect. 
     */
    reset(): void {
        this.currTime=0;
        this.target=undefined;
        this.active=false;
    }
    
}