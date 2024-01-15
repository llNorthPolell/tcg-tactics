import { Position } from "@/game/data/types/position";
import Unit from "@/game/gameobjects/unit";
import BaseSkillEffect from "./baseSkillEffect";
import SkillEffect from "./skillEffect";

export default class ConditionalEffect extends BaseSkillEffect{
    protected target?: Unit | Position;
    protected condition: ()=>boolean;
    protected onTrue: SkillEffect[];
    /**
     * This effect will be applied if the condition is met. If condition is not met, effect will be removed.
     * @param name - Name of the skill effect
     * @param condition - Condition Function determining which skill effect list to apply
     * @param onTrue - Skill effect list to apply when condition is met
     * @param duration - How long this effect lasts. Set to -1 if intended to be permanent.
     * @param targetType - Should this skill hit allies or enemies? See TARGET_TYPES enum.
     * @param isRemovable - If true, can be removed by a cleansing effect
     */
    constructor(name:string,condition:()=>boolean,onTrue:SkillEffect[],duration:number,targetType:string,isRemovable=true){
        super(name,duration,targetType,isRemovable);

        this.condition = condition;
        this.onTrue=onTrue;
    }

    apply(){
        if (this.condition()){
            this.onTrue.forEach(
                skillEffect=>{
                    skillEffect.apply();
                }
            )
            return;
        }
        
        if (this.active)
            this.forceRemove();
    }

    clone(): SkillEffect {
        throw new ConditionalEffect(this.name,this.condition,this.onTrue,this.duration,this.targetType,this.isRemovable);
    }
}