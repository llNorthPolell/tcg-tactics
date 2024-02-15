import { UNIT_TYPE } from "@/game/enums/keys/unitType"
import { UnitData } from "../types/unitData"
import { UNIT_CLASS } from "@/game/enums/keys/unitClass"
import { testTestMageLeaderSkill } from "./testEffects"

// Heroes
export const testMageHero : UnitData = {
    name: "test_mage_hero",
    unitType: UNIT_TYPE.hero,
    unitClass: UNIT_CLASS.MAGE,
    stats: {
        hp: 20,
        sp: 30,
        pwr: 3,
        def: 0,
        mvt: 2,
        rng: 2
    },
    effects:[
        testTestMageLeaderSkill
    ]
}


// TODO: Add these abilities to the hero
/*
            effects: "pwr +25% to mages",
                {
                    name: "Magic Aura",
                    targetType: TARGET_TYPES.none,
                    effectType: SPELL_EFFECT_TYPE.statChange,
                    childEffects: [],
                    amount:25,
                    valueType: ValueType.PERCENTAGE,
                    stat: UnitStatField.PWR,
                    duration:-1,
                    isRemovable:false
                },
                "recover 2sp per turn",
                {
                    name: "Meditate",
                    targetType: TARGET_TYPES.none,
                    effectType: SPELL_EFFECT_TYPE.statChange,
                    amount:25,
                    valueType: ValueType.VALUE,
                    stat: UnitStatField.SP,
                    duration:-1,
                    overTime:true,
                    isRemovable:false
                },
                "deal 2 damage to targets (radius 1)",
                {
                    name: "Magic Burst",
                    targetType: TARGET_TYPES.enemy,
                    effectType: SPELL_EFFECT_TYPE.dealDamage,
                    childEffects: [],
                    amount:2,
                    valueType: ValueType.VALUE
                }
                */


export const testSoldierHero : UnitData = {
    name: "test_soldier_hero",
    unitType: UNIT_TYPE.hero,
    unitClass: UNIT_CLASS.SOLDIER,
    stats: {
        hp: 30,
        sp: 10,
        pwr: 5,
        def: 0,
        mvt: 3,
        rng: 1
    }
}

/*
 "pwr +25% to all",
        {
            name: "Assault Aura",
            targetType: TARGET_TYPES.none,
            effectType: SPELL_EFFECT_TYPE.statChange,
            childEffects: [],
            amount:25,
            valueType: ValueType.PERCENTAGE,
            stat: UnitStatField.PWR,
            duration:-1,
            isRemovable:false
        },
        "+2 pwr to units 1 tile adjacent to this unit",
        {
            name: "Charisma",
            targetType: TARGET_TYPES.none,
            effectType: SPELL_EFFECT_TYPE.statChange,
            childEffects: [],
            amount:2,
            valueType: ValueType.VALUE,
            stat: UnitStatField.PWR,
            duration:-1,
            isRemovable:false
        },
        "deal 5 damage to target",
        {
            name: "Cleave",
            targetType: TARGET_TYPES.none,
            effectType: SPELL_EFFECT_TYPE.dealDamage,
            amount:5,
            valueType: ValueType.VALUE,
            stat: UnitStatField.PWR
        },
        */

export const testRangerHero :UnitData = {
    name: "test_ranger_hero",
    unitType: UNIT_TYPE.hero,
    unitClass: UNIT_CLASS.RANGER,
    stats: {
        hp: 22,
        sp: 15,
        pwr: 3,
        def: 0,
        mvt: 2,
        rng: 3
    }
}
 /*
 "pwr +25% to rangers",
                {
                    name: "Precision Aura",
                    targetType: TARGET_TYPES.none,
                    effectType: SPELL_EFFECT_TYPE.statChange,
                    childEffects: [],
                    amount:25,
                    valueType: ValueType.PERCENTAGE,
                    stat: UnitStatField.PWR,
                    duration:-1,
                    isRemovable:false
                },
                "+20% pwr when target is 3 tiles away",
                {
                    name: "Snipe",
                    targetType: TARGET_TYPES.none,
                    effectType: SPELL_EFFECT_TYPE.statChange,
                    childEffects: [],
                    amount:25,
                    valueType: ValueType.PERCENTAGE,
                    stat: UnitStatField.PWR,
                    duration:-1,
                    isRemovable:false
                },
                "move unit 2 tiles",
                {
                    name: "Chase",
                    targetType: TARGET_TYPES.none,
                    effectType: SPELL_EFFECT_TYPE.statChange,
                    amount:0,
                    valueType: ValueType.PERCENTAGE,
                    stat: UnitStatField.PWR
                },
 */

export const testAssassinHero : UnitData = {
    name: "test_assassin_hero",
    unitType: UNIT_TYPE.hero,
    unitClass: UNIT_CLASS.ASSASSIN,
    stats: {
        hp: 20,
        sp: 10,
        pwr: 4,
        def: 0,
        mvt: 3,
        rng: 1
    }
}
/*
 "pwr +25% to all",
                        {
                            name: "Assault Aura",
                            targetType: TARGET_TYPES.none,
                            effectType: SPELL_EFFECT_TYPE.statChange,
                            childEffects: [],
                            amount: 25,
                            valueType: ValueType.PERCENTAGE,
                            stat: UnitStatField.PWR,
                            duration: -1,
                            isRemovable: false
                        },
                        "Rush\n+2 pwr to units 1 tile adjacent to this unit",
                        {
                            name: "Charisma",
                            targetType: TARGET_TYPES.none,
                            effectType: SPELL_EFFECT_TYPE.statChange,
                            childEffects: [],
                            amount: 2,
                            valueType: ValueType.VALUE,
                            stat: UnitStatField.PWR,
                            duration: -1,
                            isRemovable: false
                        },
                        "deal 5 damage to target",
                        {
                            name: "Execute",
                            targetType: TARGET_TYPES.none,
                            effectType: SPELL_EFFECT_TYPE.dealDamage,
                            amount: 5,
                            valueType: ValueType.VALUE,
                            stat: UnitStatField.PWR
                        },
*/





// Followers
export const testSoldier:UnitData = {
    name: "test_soldier",
    unitType: UNIT_TYPE.unit,
    unitClass: UNIT_CLASS.SOLDIER,
    stats: {
        hp: 10,
        sp: 0,
        pwr: 1,
        def: 0,
        mvt: 3,
        rng: 1
    }
}

export const testRanger:UnitData = {
    name: "test_ranger",
    unitType: UNIT_TYPE.unit,
    unitClass: UNIT_CLASS.RANGER,
    stats: {
        hp: 8,
        sp: 0,
        pwr: 2,
        def: 0,
        mvt: 2,
        rng: 3
    }
}

export const testGuardian:UnitData = {
    name: "test_guardian",
    unitType: UNIT_TYPE.unit,
    unitClass: UNIT_CLASS.GUARDIAN,
    stats: {
        hp: 15,
        sp: 0,
        pwr: 1,
        def: 1,
        mvt: 1,
        rng: 1
    }
}

