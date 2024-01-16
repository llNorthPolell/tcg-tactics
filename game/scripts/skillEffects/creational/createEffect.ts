import { Position } from "@/game/data/types/position";
import Unit from "@/game/gameobjects/unit";
import BaseSkillEffect from "../baseSkillEffect";
import SkillEffect from "../skillEffect";

export default abstract class CreateEffect extends BaseSkillEffect{
    protected target?: Unit | Position;
    protected effectsToApply:SkillEffect[];
    readonly range:number;

/**
 * This effect will create other effects globally or around a target (i.e. auras, diseases)
 * @param name - Name of the skill effect
 * @param effectsToApply - List of effects to apply
 * @param duration - How long this effect lasts. Set to -1 if intended to be permanent.
 * @param spreadRange - Range of spread. Set to -1 if intended to be global.
 * @param targetType - Should this skill hit allies or enemies? See TARGET_TYPES enum.
 * @param isRemovable - If true, can be removed by a cleansing effect
 */
    constructor(name:string,effectsToApply:SkillEffect[],duration:number,spreadRange:number,targetType:string,isRemovable=true){
        super(name,duration,targetType,isRemovable);
        this.effectsToApply = effectsToApply;
        this.range=spreadRange;
    }

    createEffects() : SkillEffect[]{
        let clonedEffects:SkillEffect[] = [];
        this.effectsToApply.forEach(
            effect=>{
                clonedEffects = [...clonedEffects,effect.clone()];
            }
        )
        return clonedEffects;
    }

    abstract apply(): void;

}