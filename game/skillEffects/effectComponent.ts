import { Position } from "../data/types/position";
import Unit from "../gameobjects/units/unit";
import Effect from "./effect";

export default interface EffectComponent{  
    /**
     * Type of component (for component search purposes)
     */
    readonly type: string;

    /**
     * Amount to change for stat manipulation and health change effects
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
    readonly unit?:Unit;

    /**
     * Additional effects to apply (for creational effects)
     */
    readonly children?: Effect[];
    
    /**
     * Apply the effect component scripts.
     * @param target The unit or location to apply this effect component to
     */
    apply(target?:Unit|Position):void;

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