import { TARGET_TYPES } from "@/game/enums/keys/targetTypes";
import { EffectData } from "../types/effectData";
import { EffectTrigger } from "@/game/enums/keys/effectTriggers";
import { ValueType } from "@/game/enums/keys/valueType";
import { SPELL_EFFECT_TYPE } from "@/game/enums/keys/spellEffectType";
import { UNIT_TYPE } from "@/game/enums/keys/unitType";
import { UNIT_CLASS } from "@/game/enums/keys/unitClass";

export const testFireball:EffectData[] = [
    {
        name: "Fireball",
        description: "Deal 2 damage to a target",
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
        description: "Restore 5hp to the target",
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
        creates: [
            {
                name: "Explode",
                description: "Deal 2 damage to the target",
                targetType: TARGET_TYPES.enemy,
                trigger: EffectTrigger.onCast,
                components: [
                    {
                        type: SPELL_EFFECT_TYPE.healthChange,
                        amount: -2,
                        valueType: ValueType.VALUE
                    }
                ],
                isRemovable: true
            }
        ],
        range: 1,
        isRemovable: true
    }
]

export const testNaturesBlessing : EffectData[] = [
    {
        name: "Nature's Blessing",
        description: "Restore 2hp to allies within 2 tiles at a target location",
        targetType: TARGET_TYPES.position,
        trigger: EffectTrigger.onCast,
        creates: [
            {
                name: "Nature's Blessing",
                description: "Restore 2hp to the target",
                targetType: TARGET_TYPES.ally,
                trigger: EffectTrigger.onCast,
                components: [
                    {
                        type: SPELL_EFFECT_TYPE.healthChange,
                        amount: 2,
                        valueType: ValueType.VALUE
                    }
                ],
                isRemovable: true
            }
        ],
        range: 2,
        isRemovable: true
    }
]

export const testFireGolem :EffectData[] = [
    {
        name: "Fire Golem",
        description: "Summon a Fire Golem and deal 2 damage to enemies within 1 tile",
        targetType: TARGET_TYPES.position,
        trigger: EffectTrigger.onCast,
        components:[
            {
                type: SPELL_EFFECT_TYPE.summon,
                amount: -1,     // should act as unit life; -1=permanent, >0 = time until unit expires
                unit: {
                    name: "test_fire_golem",
                    unitType: UNIT_TYPE.unit,
                    unitClass: UNIT_CLASS.SOLDIER,
                    stats: {
                        hp: 15,
                        sp: 0,
                        pwr: 3,
                        def: 0,
                        mvt: 3,
                        rng: 1
                    }
                }
            }
        ],
        creates: [
            {
                name: "Incinerate",
                description: "Deal 2 damage to target",
                targetType: TARGET_TYPES.enemy,
                trigger: EffectTrigger.onCast,
                components: [{
                    type: SPELL_EFFECT_TYPE.healthChange,
                    amount: -2,
                    valueType: ValueType.VALUE
                }],
                isRemovable: true
            }
        ],
        range:1,
        isRemovable: true
    }
]


export const testTidesHaveTurned :EffectData[] = [
    {
        name: "Tides Have Turned",
        description: "Deal 1 damage to all enemies within 2 tiles. Restore 1 hp to allies within 2 tiles.",
        targetType: TARGET_TYPES.position,
        trigger: EffectTrigger.onCast,
        creates: [
            {
                name: "Tides Have Turned",
                description: "Deal 1 damage to target",
                targetType: TARGET_TYPES.enemy,
                trigger: EffectTrigger.onCast,
                components: [{
                    type: SPELL_EFFECT_TYPE.healthChange,
                    amount: -1,
                    valueType: ValueType.VALUE
                }],
                isRemovable: true
            },
            {
                name: "Tides Have Turned",
                description: "Restore 1 hp to target",
                targetType: TARGET_TYPES.ally,
                trigger: EffectTrigger.onCast,
                components: [{
                    type: SPELL_EFFECT_TYPE.healthChange,
                    amount: 1,
                    valueType: ValueType.VALUE
                }],
                isRemovable: true
            }
        ],
        range:2,
        isRemovable: true
    }
]


export const frostArmor :EffectData[] = [
	{
		name: "Ice Armor",
		targetType: "ally",
		description: "+2 DEF for 3 turns.",
		duration: 3,
		trigger: "onCast",
		components:[
			{
				type: "statChange",
				amount: 2,
				valueType: "value",
				stat: "def"
			},
		],
		isRemovable:true
	},
	{
		name: "Frost Counter",
		targetType: "ally",
		description: "Slow attacker when receiving damage. If target has chill, freeze them instead. (Lasts 3 turns)",
		duration: 3,
		trigger: "onReceiveHit",		//onReceiveHit should insert a buff onto the primary target, then cast the created effects on the attacker 
        creates: [
            {          
                name: "Chill",
                targetType: "enemy",
                description: "Slow attacker when receiving damage. If target has chill, freeze them instead. (Lasts 3 turns)",
                duration: 3,
                trigger: "onCast",		 
                components: [
                    {
                        name: "chill",
                        type: "chill",	// this one is a hard-coded effect that checks if target has chill status already and freezes them if they have it
                        amount: 3,
                        valueType: "value"
                    }
                ],
                isRemovable: true   
			}
        ],
        range: 0,
		isRemovable:true
	}
]