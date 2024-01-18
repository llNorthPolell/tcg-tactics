import HeroCardData from "@/game/data/cards/heroCardData";
import Player from "@/game/data/playerData";
import { SPELL_EFFECT_TYPE } from "@/game/enums/keys/spellEffectType";
import { TARGET_TYPES } from "@/game/enums/keys/targetTypes";
import { UNIT_CLASS } from "@/game/enums/keys/unitClass";
import { UnitStatField } from "@/game/enums/keys/unitStatField";
import { ValueType } from "@/game/enums/keys/valueType";
import HeroCard from "@/game/gameobjects/cards/heroCard";
import Deck from "@/game/gameobjects/cards/deck";
import GamePlayer from "@/game/gameobjects/gamePlayer";
import Unit from "@/game/gameobjects/unit";
import SkillEffect from "@/game/scripts/skillEffects/skillEffect";

export const createTestUnit : ()=>Unit = () =>{
    const testPlayer = new Player("1","testPlayer");
    const card = new HeroCard(
        "1",
        new HeroCardData(
            "1",
            "test_soldier_hero",
            UNIT_CLASS.SOLDIER,
            30,
            10,
            5,
            5,
            3,
            1,
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
            [UNIT_CLASS.SOLDIER, UNIT_CLASS.SOLDIER, UNIT_CLASS.SOLDIER, UNIT_CLASS.RANGER, UNIT_CLASS.RANGER, UNIT_CLASS.GUARDIAN],
            5
        ),
        testPlayer);
    const testGamePlayer = new GamePlayer(1,testPlayer,1,0x0000ff,new Deck([], card));
    return new Unit("test",{x:0,y:0},card.data,testGamePlayer)
}

export const checkEffectEnded = (effect :SkillEffect)=>{
    expect(effect.isActive()).toBe(false);
    expect(effect.getCurrTime()).toBe(effect.duration);
}
