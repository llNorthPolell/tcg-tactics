
import { EffectData } from "../data/effectData";
import { SPELL_EFFECT_TYPE } from "../enums/keys/spellEffectType";
import AreaOfEffect from "./skillEffects/areaOfEffect";
import DealDamage from "./skillEffects/dealDamage";
import Heal from "./skillEffects/heal";
import SkillEffect from "./skillEffects/skillEffect";

export default class SkillEffectFactory{

    static getSkillEffect(name:string, effectData:EffectData[]) : SkillEffect[] {
        let skillEffects : SkillEffect[] = [];
        
        effectData.forEach(
            (effect:EffectData)=>{
                let newEffect;
                switch(effect.effectType){
                    case SPELL_EFFECT_TYPE.dealDamage:
                        if (!effect.amount) break;
                        if (!effect.valueType) break;
                        newEffect = new DealDamage(
                            (effect.name? effect.name: name),
                            effect.amount,
                            effect.valueType,
                            effect.duration,
                            effect.overTime,
                            effect.isDelayed,
                            effect.isRemovable
                        );
                        break;
                    case SPELL_EFFECT_TYPE.heal:
                        if (!effect.amount) break;
                        if (!effect.valueType) break;
                        newEffect = new Heal(
                            (effect.name? effect.name: name),
                            effect.amount,
                            effect.valueType,
                            effect.duration,
                            effect.overTime,
                            effect.isDelayed,
                            effect.isRemovable
                        );
                        break;
                    case SPELL_EFFECT_TYPE.areaOfEffect:
                        if(!effect.range) break;
                        if(!effect.childEffects || effect.childEffects.length === 0) break;
                        newEffect = new AreaOfEffect(
                            (effect.name? effect.name:name),
                            SkillEffectFactory.getSkillEffect(effect.name? effect.name: name,effect.childEffects),
                            effect.range,
                            effect.duration,
                            effect.targetType,
                            effect.isRemovable
                        )
                    default:
                        break;
                }
                if (newEffect)
                    skillEffects = [...skillEffects,newEffect];
            }
        )
        return skillEffects;
    }
}