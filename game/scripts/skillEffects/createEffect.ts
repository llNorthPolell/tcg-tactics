import { Position } from "@/game/data/types/position";
import Unit from "@/game/gameobjects/unit";
import BaseSkillEffect from "./baseSkillEffect";
import SkillEffect from "./skillEffect";
import GamePlayer from "@/game/gameobjects/gamePlayer";

export default abstract class CreateEffect extends BaseSkillEffect{
    readonly name;
    protected target?: Unit | Position;
    protected effectsToApply:SkillEffect[];
    readonly duration:number;
    readonly isRemovable: boolean;
    protected currTime:number;
    protected active:boolean;
    readonly range:number;

/**
 * This effect will create other effects globally or around a target (i.e. auras, diseases)
 * @param name - Name of the skill effect
 * @param friendlyEffects - List of effects to give surrounding allies
 * @param enemyEffects - List of effects to inflict enemies
 * @param duration - How long this effect lasts. Set to -1 if intended to be permanent.
 * @param spreadRange - Range of spread. Set to -1 if intended to be global.
 * @param sequential - If true, will apply effects in order one after another.
 * @param targetType - Should this skill hit allies or enemies? See TARGET_TYPES enum.
 * @param isRemovable - If true, can be removed by a cleansing effect
 */
    constructor(name:string,effectsToApply:SkillEffect[],duration:number,range:number,targetType:string,isRemovable=true){
        super(name,duration,targetType,isRemovable);
        this.name = name;
        this.effectsToApply = effectsToApply;

        this.duration=duration;
        this.currTime=0;
            
        this.isRemovable=isRemovable;
        this.range=range;

        this.active=true;
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