import { TARGET_TYPES } from "@/game/enums/keys/targetTypes";
import { EffectData } from "../types/effectData";
import { EffectTrigger } from "@/game/enums/keys/effectTriggers";
import { ValueType } from "@/game/enums/keys/valueType";
import { SPELL_EFFECT_TYPE } from "@/game/enums/keys/spellEffectType";

export const testFireball:EffectData[] = [
    {
        name: "Fireball",
        description: "Deals 2 damage",
        targetType: TARGET_TYPES.enemy,
        trigger: EffectTrigger.onCast,
        components:[{
            type: SPELL_EFFECT_TYPE.healthChange,
            amount: -2,
            valueType: ValueType.VALUE
        }],
        isRemovable: true
    },
    {
        name: "Burn",
        description: "Deals 1 damage per turn for 3 turns",
        targetType: TARGET_TYPES.enemy,
        duration:3,
        trigger: EffectTrigger.onTurnStart,
        components: [{
            type: SPELL_EFFECT_TYPE.healthChange,
            amount: -1,
            valueType: ValueType.VALUE
        }],
        isRemovable: true
    }
]




export const testHealingLight : EffectData[] = [
    {
        name: "Healing Light",
        description: "Heal target by 5 hp",
        targetType: TARGET_TYPES.ally,
        trigger: EffectTrigger.onCast,
        components:[{
            type: SPELL_EFFECT_TYPE.healthChange,
            amount: 5,
            valueType: ValueType.VALUE
        }],
        isRemovable: true
    }
]


export const testMagicBomb : EffectData[] = [
    {
        name: "Magic Bomb",
        description: "Deal 2 damage to enemies within 1 tile at a target location",
        targetType: TARGET_TYPES.position,
        trigger: EffectTrigger.onCast,
        range:1,                    // TARGET_TYPES.position && range > 0 = Area of Effect
        // TODO: How to make child component affect only enemies?
        components:[{
            type: SPELL_EFFECT_TYPE.healthChange,
            amount: -2,
            valueType: ValueType.VALUE
        }],
        isRemovable: true
    }
]


export const testNaturesBlessing : EffectData[] = [
    {
        name: "Nature's Blessing",
        description: "Restore 2hp to allies within 2 tiles at a target location",
        targetType: TARGET_TYPES.position,
        trigger: EffectTrigger.onCast,
        range:2,                    // TARGET_TYPES.position && range > 0 = Area of Effect
        // TODO: How to make child component affect only allies?
        components:[{
            type: SPELL_EFFECT_TYPE.healthChange,
            amount: 2,
            valueType: ValueType.VALUE
        }],
        isRemovable: true
    }
]