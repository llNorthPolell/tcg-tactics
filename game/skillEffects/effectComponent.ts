import { EffectData } from "../data/types/effectData";
import { Position } from "../data/types/position";
import { UnitData } from "../data/types/unitData";
import Unit from "../gameobjects/units/unit";
import EffectSystem from "../system/effectSystem";

export default interface EffectComponent{  
    /**
     * Type of component (for component search purposes)
     */
    readonly type: string;

    /**
     * An amount. How this amount will be used depends on the effect type:
     * @Note Amount to apply (for healthChange and statChanges)
     * @Note Range (for creational effects)
     */
    readonly amount?:number;

    /**
     * Value or percentage
     */
    readonly valueType:string;

    /**
     * Unit stat for stat manipulation
     */
    readonly stat?:string;

    /**
     * Unit to be summoned if this is a summon skill
     */
    readonly unit?:UnitData;
    
    /**
     * Apply the effect component scripts.
     * @param target The unit or location to apply this effect component to
     * @param effectSystem? Reference to effect system to use; for creational effects
     */
    apply(target?:Unit|Position, effectSystem?:EffectSystem):void;

    /**
     * Run cleanup script for removal of effect (e.g. Reverse stat changes to values 
     * before a debuff when the debuff expires)
     */
    remove():void;

    /**
     * @param active If true, skill component will run apply method
     */
    setActive(active:boolean):void;

    /**
     * If true, skill component will run apply method
     */
    isActive():boolean;
}