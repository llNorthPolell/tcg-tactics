import { EffectData } from "./effectData"
import { UnitData } from "./unitData"

export type EffectDataComponent = {
    /**
     * (Optional) Name of the component. Will be defaulted to parent name.
     */
    name?:string,

    /**
     * Type of effect component (e.g. healthChange, statChange, statusAilment, etc.)
     */
    type:string,

    /**
     * An amount. How this amount will be used depends on the effect type:
     * @Note Amount to apply (for healthChange and statChanges)
     * @Note Range (for creational effects)
     */
    amount?:number,

    /**
     * Stat field for stat manipulation
     */
    stat?:string,

    /**
     * Value or Percentage (for healthChange and statChanges). Default handling to "value" if undefined.
     */
    valueType?:string,

    /**
     * For creational effects
     */
    children?: EffectData[],

    /**
     * For summons
     */
    unit?: UnitData

    
}