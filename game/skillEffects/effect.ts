import { EffectData } from "../data/types/effectData";
import { Position } from "../data/types/position";
import Unit from "../gameobjects/units/unit";
import EffectComponent from "./effectComponent";
import EffectFactory from "./effectFactory";

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
     * List of effects created by this one on trigger (used for things like Area of Effect, Counter Spells)
     */
    readonly creates:EffectData[];

    /**
     * Specifies range in tiles to create the effects in the "creates" list.
     * Only applies if this effect creates other effects (i.e. "creates" list is not empty).
     * @note range = -1 means created effects are applied globally
     * @note range = 0 means created effects are applied to one target
     * @note range > 0 means created effects are applied only to units within the specified range in tiles
     */
    readonly range:number;

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

    constructor(effectData:EffectData,components:EffectComponent[]){
        this.name=effectData.name;
        this.description=effectData.description;
        this.targetType=effectData.targetType;
        this.duration=(effectData.duration)?effectData.duration:0;
        this.trigger=effectData.trigger;
        this.components=components;
        this.creates=(effectData.creates)? effectData.creates:[];
        this.range=(effectData.range)? effectData.range: 0;
        this.isRemovable=effectData.isRemovable;
        this.active=false;

        this.currTime=0;
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

    createSubEffect(){
        return EffectFactory.createEffects(this.creates);
    }


    /**
     * Sets the target for this effect
     */
    setTarget(target:Unit|Position){
        this.target=target;
        this.components.forEach(
            component=>{
                component.setActive(true);
            }
        )
        this.active=true;
    }

    /**
     * @returns The target of this effect
     */
    getTarget(){
        return this.target;
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