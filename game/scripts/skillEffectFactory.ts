
import { EffectData } from "../data/effectData";
import { SPELL_EFFECT_TYPE } from "../enums/keys/spellEffectType";
import DealDamage from "./skillEffects/dealDamage";
import Heal from "./skillEffects/heal";
import SkillEffect from "./skillEffects/skillEffect";

export default class SkillEffectFactory{

    static getSkillEffect(name:string, effectData:EffectData) : SkillEffect[] {
        let skillEffects : SkillEffect[] = [];
        let newEffect;
        switch(effectData.effectType){
            case SPELL_EFFECT_TYPE.dealDamage:
                if (!effectData.amount) break;
                if (!effectData.valueType) break;
                newEffect = new DealDamage(
                    (effectData.name? effectData.name: name),
                    effectData.amount,
                    effectData.valueType,
                    effectData.duration,
                    effectData.overTime,
                    effectData.isDelayed,
                    effectData.isRemovable
                );
                break;
            case SPELL_EFFECT_TYPE.heal:
                if (!effectData.amount) break;
                if (!effectData.valueType) break;
                newEffect = new Heal(
                    (effectData.name? effectData.name: name),
                    effectData.amount,
                    effectData.valueType,
                    effectData.duration,
                    effectData.overTime,
                    effectData.isDelayed,
                    effectData.isRemovable
                );
                break;
            default:
                break;
        }
        if (newEffect)
            skillEffects = [...skillEffects,newEffect];
        
        return skillEffects;
    }
}