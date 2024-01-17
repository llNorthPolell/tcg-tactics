import { EffectDataComponent } from "./effectDataComponent"

export type EffectData = {
    /**
     * Name of the effect
     */
	name: string,

    /**
     * Description shown on card and on skill effect details
     */
    description: string,

    /**
     * What this effect can be casted on
     */
	targetType: string,
    
    /**
     * How long this skill will last
     * @note 0 or undefined = instant
     * @note > 0 = timed 
     * @note -1 = permanent
     */
    duration?:number,

    /**
     * Range of area of effect
     * @note > 0 = Area of Effect
     * @note 0 or undefined = Single Target
     * @note -1 = Global
     */
    range?:number,
    
    /**
     * Applies this effect only on specified condition
     * @note On Cast/Removal (casted once): onCast, onRemove, onSummon
     * @note Turn-based (casted every turn): onTurnStart, onTurnEnd 
     * @note Combat (casted during combat): onAttack, onReceiveHit, onKill, onDeath, onHealth<X
     * @note Position: onEnter, onLeave, inRange
     * @note Target-based: isClass=X, isHero, isUnit
     * @note Default: undefined
     */
    triggers: string[],

    /**
     * 
     */
    components: EffectDataComponent[],

    /**
     * If true, can be removed with normal cleansing skill. If false,
     * must be removed using forceRemove() function 
     */
    isRemovable:boolean
}


