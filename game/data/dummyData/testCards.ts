import { CARD_TYPE } from "@/game/enums/keys/cardType"
import { CardData } from "../types/cardData"
import { testAssassinHero, testGuardian, testMageHero, testRanger, testRangerHero, testSoldier, testSoldierHero } from "./testUnits"
import { UNIT_CLASS } from "@/game/enums/keys/unitClass"
import { testPlayer, testPlayer2 } from "./testPlayers"
import { testFireball, testHealingLight, testMagicBomb, testNaturesBlessing } from "./testEffects"

// Heroes 
export const testMageHeroCardData : CardData = {
    id:"1",
    name:"test_mage_hero",
    cardType: CARD_TYPE.hero,
    cost:5,
    contents: {...testMageHero},
    owner:testPlayer,
    followers:[UNIT_CLASS.MAGE, UNIT_CLASS.MAGE, UNIT_CLASS.MAGE, UNIT_CLASS.MAGE]
}


export const testSoldierHeroCardData : CardData = {
    id:"3",
    name:"test_mage_hero",
    cardType: CARD_TYPE.hero,
    cost:5,
    contents: {...testSoldierHero},
    owner:testPlayer,
    followers:[UNIT_CLASS.SOLDIER, UNIT_CLASS.SOLDIER, UNIT_CLASS.SOLDIER, UNIT_CLASS.RANGER, UNIT_CLASS.RANGER, UNIT_CLASS.GUARDIAN],
}

export const testRangerHeroCardData : CardData = {
    id:"2",
    name:"test_ranger_hero",
    cardType: CARD_TYPE.hero,
    cost:5,
    contents: {...testRangerHero},
    owner:testPlayer2,
    followers: [UNIT_CLASS.RANGER, UNIT_CLASS.RANGER, UNIT_CLASS.RANGER, UNIT_CLASS.ASSASSIN, UNIT_CLASS.ASSASSIN, UNIT_CLASS.SOLDIER],
}

export const testAssassinHeroCardData : CardData = {
    id:"5",
    name:"test_assassin_hero",
    cardType: CARD_TYPE.hero,
    cost:5,
    contents: {...testAssassinHero},
    owner:testPlayer,
    followers: [UNIT_CLASS.ASSASSIN, UNIT_CLASS.ASSASSIN, UNIT_CLASS.ASSASSIN, UNIT_CLASS.RANGER, UNIT_CLASS.RANGER, UNIT_CLASS.SOLDIER],
}

// Followers
export const testSoldierCardData: CardData = {
    id:"1",
    name:"test_soldier",
    cardType: CARD_TYPE.unit,
    cost:1,
    contents: {...testSoldier},
    owner:testPlayer,
}

export const testRangerCardData: CardData = {
    id:"3",
    name:"test_ranger",
    cardType: CARD_TYPE.unit,
    cost:2,
    contents: {...testRanger},
    owner:testPlayer,
}

export const testGuardianCardData: CardData = {
    id:"6",
    name:"test_guardian",
    cardType: CARD_TYPE.unit,
    cost:3,
    contents: {...testGuardian},
    owner:testPlayer,
}

// Spells
export const testFireballCardData:CardData = {
    id:"1",
    name:"Fireball",
    cardType: CARD_TYPE.spell,
    cost:5,
    contents: [...testFireball],
    owner:testPlayer,
}

export const testHealingLightCardData:CardData = {
    id:"2",
    name:"Healing Light",
    cardType: CARD_TYPE.spell,
    cost:2,
    contents: [...testHealingLight],
    owner:testPlayer,
}

export const testMagicBombCardData:CardData = {
    id:"3",
    name:"Magic Bomb",
    cardType: CARD_TYPE.spell,
    cost:5,
    contents: [...testMagicBomb],
    owner:testPlayer,
}

export const testNaturesBlessingCardData:CardData = {
    id:"4",
    name:"Nature's Blessing",
    cardType: CARD_TYPE.spell,
    cost:5,
    contents: [...testNaturesBlessing],
    owner:testPlayer,
}