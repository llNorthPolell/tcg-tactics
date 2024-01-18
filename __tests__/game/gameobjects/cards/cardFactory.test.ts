import { CardData } from "@/game/data/types/cardData";
import Player from "@/game/data/playerData";
import { CARD_TYPE } from "@/game/enums/keys/cardType";
import { SPELL_EFFECT_TYPE } from "@/game/enums/keys/spellEffectType";
import { TARGET_TYPES } from "@/game/enums/keys/targetTypes";
import { UNIT_CLASS } from "@/game/enums/keys/unitClass";
import { UNIT_TYPE } from "@/game/enums/keys/unitType";
import { ValueType } from "@/game/enums/keys/valueType";
import CardFactory from "@/game/gameobjects/cards/cardFactory";
import GamePlayer from "@/game/gameobjects/player/gamePlayer";
import Unit from "@/game/gameobjects/units/unit";
import Effect from "@/game/skillEffects/effect";

it ("should create a Hero card",()=>{
    const testPlayer :Player = new Player("123456","testPlayer");
    const testPlayerInGame :GamePlayer = new GamePlayer(1,testPlayer,1,0x000077);
    const input : CardData = {
        id: "3",
        name: "test_mage_hero",
        cardType: CARD_TYPE.hero,
        cost: 5,
        contents: {
            name:"test_mage_hero",
            unitType:UNIT_TYPE.hero,
            unitClass:UNIT_CLASS.MAGE,
            stats:{
                hp: 20,
                sp: 30,
                pwr: 3,
                def: 0,
                mvt: 2,
                rng: 2
            },
        },
        owner: testPlayer
    }


    const card = CardFactory.createCard(input,testPlayerInGame);

    expect(card.id).toBe(input.id);
    expect(card.name).toBe(input.name);
    expect(card.cost).toBe(input.cost);
    expect(card.cardType).toBe(input.cardType);
    expect(card.getContents() instanceof Unit).toBe(true);

    const unit = card.getContents() as Unit;
    expect(unit.unitType).toBe(UNIT_TYPE.hero);
    expect(unit.unitClass).toBe(UNIT_CLASS.MAGE);
    expect(unit.base.hp).toBe(20);
    expect(unit.base.sp).toBe(30);
    expect(unit.base.pwr).toBe(3);
    expect(unit.base.def).toBe(0);
    expect(unit.base.mvt).toBe(2);
    expect(unit.base.rng).toBe(2);
    expect(unit.getOwner()).toBe(testPlayerInGame);
})


it ("should create a Unit card",()=>{
    const testPlayer :Player = new Player("123456","testPlayer");
    const testPlayerInGame :GamePlayer = new GamePlayer(1,testPlayer,1,0x000077);
    const input : CardData = {
        id: "2",
        name: "test_soldier",
        cardType: CARD_TYPE.unit,
        cost: 5,
        contents: {
            name:"test_soldier",
            unitType:UNIT_TYPE.unit,
            unitClass:UNIT_CLASS.SOLDIER,
            stats:{
                hp: 10,
                sp: 0,
                pwr: 1,
                def: 0,
                mvt: 3,
                rng: 1
            },
        },
        owner: testPlayer
    }

    const card = CardFactory.createCard(input,testPlayerInGame);
    expect(card.id).toBe(input.id);
    expect(card.name).toBe(input.name);
    expect(card.cost).toBe(input.cost);
    expect(card.cardType).toBe(input.cardType);
    expect(card.getContents() instanceof Unit).toBe(true);

    const unit = card.getContents() as Unit;
    expect(unit.unitType).toBe(UNIT_TYPE.unit);
    expect(unit.unitClass).toBe(UNIT_CLASS.SOLDIER);
    expect(unit.base.hp).toBe(10);
    expect(unit.base.sp).toBe(0);
    expect(unit.base.pwr).toBe(1);
    expect(unit.base.def).toBe(0);
    expect(unit.base.mvt).toBe(3);
    expect(unit.base.rng).toBe(1);
    expect(unit.getOwner()).toBe(testPlayerInGame);
})


it ("should create a Spell card",()=>{
    const testPlayer :Player = new Player("123456","testPlayer");
    const testPlayerInGame :GamePlayer = new GamePlayer(1,testPlayer,1,0x000077);
    const input : CardData = {
        id: "1",
        name: "Fireball",
        cardType: CARD_TYPE.spell,
        cost: 3,
        contents: {
            name: "Fireball",
            targetType: TARGET_TYPES.enemy,
            effectType: SPELL_EFFECT_TYPE.dealDamage,
            description: "Deal 1 burn damage per turn for 3 turns",
            isRemovable:false,
            amount:1,
            valueType: ValueType.VALUE,
            duration:3,
        },
        owner: testPlayer
    }
    
    const card = CardFactory.createCard(input,testPlayerInGame);
    expect(card.id).toBe(input.id);
    expect(card.name).toBe(input.name);
    expect(card.cost).toBe(input.cost);
    expect(card.cardType).toBe(input.cardType);
    expect(card.getContents() instanceof Effect).toBe(true);

    const effect = card.getContents() as Effect;
    expect(effect.description).toBe("Deal 1 burn damage per turn for 3 turns");
    expect(effect.isRemovable).toBe(false);
})