import { Position } from "@/game/data/types/position";
import SkillEffect from "../skillEffect";
import ConditionalEffect from "./conditionalEffect";
import Unit from "@/game/gameobjects/unit";

export default class IsStandingAtEffect extends ConditionalEffect{
    protected target?:Unit;
    protected location:Position;

    /**
     * This effect will be applied if the condition is met. If condition is not met, effect will be removed.
     * @param name - Name of the skill effect
     * @param condition - Condition Function determining which skill effect list to apply
     * @param onTrue - Skill effect list to apply when condition is met
     * @param duration - How long this effect lasts. Set to -1 if intended to be permanent.
     * @param targetType - Should this skill hit allies or enemies? See TARGET_TYPES enum.
     * @param onFalseRemove - If true, will remove skill effects when condition is no longer met
     * @param isRemovable - If true, can be removed by a cleansing effect
     */
    constructor(name:string,location:Position,onTrue:SkillEffect[],duration:number=-1,targetType:string,onFalseRemove=true,isRemovable=true){
        super(name,()=>{return this.isStandingAtLocation()},onTrue,duration,targetType,onFalseRemove,isRemovable);
        this.location=location;
    }

    setTarget(target:Unit){
        this.target = target;
    }

    getTarget():Unit|undefined{
        return this.target;
    }

    isStandingAtLocation(){
        if(!this.target) return false;
        return this.target.getLocation() == this.location;
    }

    clone(): SkillEffect {
        throw new ConditionalEffect(this.name,this.condition,this.onTrue,this.duration,this.targetType,this.isRemovable);
    }
}