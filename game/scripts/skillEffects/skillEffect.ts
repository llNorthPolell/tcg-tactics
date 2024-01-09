import { Position } from "@/game/data/types/position";
import Unit from "@/game/gameobjects/unit";

export default interface SkillEffect{
    /**
     * Name of the skill effect
     */
    readonly name: string;

    /**
     * How long this effect lasts. Set to -1 if intended to be permanent. Leave undefined or 0 if intended to be instant.
     */
    readonly duration:number;

    /**
     * If true, can be removed by a cleansing effect
     */
    readonly isRemovable:boolean;

    /**
     * If true, will run apply() method.
     */
    isActive() :boolean;

    /**
     * Returns current tick of this effect (CurrTime == Duration means skill effect has expired).
     */
    getCurrTime():number;

    /**
     * Apply the effects to the stored target. Increments currTime by 1. If the skill effect has expired after this tick, will set active status to false.
     */
    apply() : void;

    /**
     * Marks this effect's active status to false if isRemovable is true.
     */
    remove() : void;

    /**
     *  Forcefully sets this effect's active status to false regardless of isRemovable value.
     */
    forceRemove(): void;

    /**
     * The unit or position to apply the skill effect to
     */
    setTarget(target:Unit|Position):void;

    /**
     * Returns the current target of this skill effect
     */
    getTarget():Unit|Position|undefined;

    /**
     * Resets this skill effect's timer
     */
    reset():void;
}