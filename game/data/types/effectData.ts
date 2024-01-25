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
     * Applies this effect only on specified condition
     * @note On Cast/Removal (casted once): onCast, onRemove, onSummon
     * @note Turn-based (casted every turn): onTurnStart, onTurnEnd 
     * @note Combat (casted during combat): onAttack, onReceiveHit, onKill, onDeath, onHealth<X
     * @note Position: onEnter, onLeave, inRange
     * @note Target-based: isClass=X, isHero, isUnit
     * @note Default: undefined
     */
    trigger: string,

    /**
     * Parts of this effect (e.g. health change, stat change, summon)
     */
    components?: EffectDataComponent[],

    /**
     * Effects to create from this effect. Used for things like area of effect or counter spells.
     */
    creates?: EffectData[],

    /**
     * Only applies if there is a "creates" property. The max distance in tiles to apply the "creates" effects.
     */
    range?:number,

    /**
     * If true, can be removed with normal cleansing skill. If false,
     * must be removed using forceRemove() function 
     */
    isRemovable:boolean
}


