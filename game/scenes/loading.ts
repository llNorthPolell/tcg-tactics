import Player from "../data/player";
import { ASSETS } from "../enums/keys/assets";
import { SCENES } from "../enums/keys/scenes";

import { v4 as uuidv4 } from 'uuid';
import GamePlayer from "../gameobjects/gamePlayer";
import { getPlayerColor } from "../enums/keys/playerTints";
import HeroCard from "../gameobjects/cards/heroCard";
import HeroCardData from "../data/cards/heroCardData";
import { UNIT_CLASS } from "../enums/keys/unitClass";
import UnitCard from "../gameobjects/cards/unitCard";
import UnitCardData from "../data/cards/unitCardData";
import { GAME_STATE } from "../enums/keys/gameState";
import SpellCardData from "../data/cards/spellCardData";
import SpellCard from "../gameobjects/cards/spellCard";
import Deck from "../gameobjects/deck";
import { TARGET_TYPES } from "../enums/keys/targetTypes";
import { SPELL_EFFECT_TYPE } from "../enums/keys/spellEffectType";
import { ValueType } from "../enums/keys/valueType";

export default class LoadingScene extends Phaser.Scene {


    preload() {
        //map
        this.load.image(ASSETS.TILE_SET, "assets/maps/tilesets/tileset.png");
        this.load.image(ASSETS.MAP_ICONS, "assets/maps/tilesets/mapicons.png");

        this.load.tilemapTiledJSON(ASSETS.TILE_MAP, "assets/maps/testmap2.json");

        // portrait
        this.load.image(ASSETS.UNDEFINED, "assets/portraits/undefined.png");

        // icons
        this.load.image(ASSETS.HP_ICON, "assets/icons/hp.png")
        this.load.image(ASSETS.SP_ICON, "assets/icons/sp.png")
        this.load.image(ASSETS.PWR_ICON, "assets/icons/pwr.png")
        this.load.image(ASSETS.ATTACK_SELECTOR, "assets/icons/attack.png")
        this.load.image(ASSETS.SPELL_SELECTOR, "assets/icons/spell.png")
        this.load.spritesheet(ASSETS.CLASS_ICONS, "assets/icons/class.png", { frameWidth: 31, frameHeight: 31 })
    }

    create() {
        console.log("Now Loading...");
        const testPlayer = new Player(uuidv4().toString(), "TestPlayer");
        const testPlayer2 = new Player(uuidv4().toString(), "Enemy");

        const testPlayerLeader = new HeroCard(
            "0",
            new HeroCardData(
                "3",
                "test_mage_hero",
                UNIT_CLASS.MAGE,
                20,
                30,
                3,
                0,
                2,
                2,
                "pwr +50% to mages",
                "recover 2sp per turn",
                "deal 2 damage to targets (radius 1)",
                [UNIT_CLASS.MAGE, UNIT_CLASS.MAGE, UNIT_CLASS.MAGE, UNIT_CLASS.MAGE],
                5
            ),
            testPlayer
        );

        const testOpponentLeader = new HeroCard(
            "0",
            new HeroCardData(
                "2",
                "test_ranger_hero",
                UNIT_CLASS.RANGER,
                22,
                15,
                3,
                0,
                3,
                3,
                "pwr +50% to rangers",
                "+20% pwr when target is 3 tiles away",
                "move unit 2 tiles",
                [UNIT_CLASS.RANGER, UNIT_CLASS.RANGER, UNIT_CLASS.RANGER, UNIT_CLASS.ASSASSIN, UNIT_CLASS.ASSASSIN, UNIT_CLASS.SOLDIER],
                5
            ),
            testPlayer2
        );



        const testPlayerDeckCards = [
            new HeroCard(
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
                    "pwr +50% to all",
                    "+2 pwr to units 1 tile adjacent to this unit",
                    "deal 5 damage to target",
                    [UNIT_CLASS.SOLDIER, UNIT_CLASS.SOLDIER, UNIT_CLASS.SOLDIER, UNIT_CLASS.RANGER, UNIT_CLASS.RANGER, UNIT_CLASS.GUARDIAN],
                    5
                ),
                testPlayer),
            new UnitCard(
                "2",
                new UnitCardData(
                    "1",
                    "test_soldier",
                    UNIT_CLASS.SOLDIER,
                    10,
                    0,
                    1,
                    1,
                    3,
                    1,
                    1
                ),
                testPlayer),
            new UnitCard(
                "3",
                new UnitCardData(
                    "1",
                    "test_soldier",
                    UNIT_CLASS.SOLDIER,
                    10,
                    0,
                    1,
                    1,
                    3,
                    1,
                    1
                ),
                testPlayer),
            new UnitCard(
                "4",
                new UnitCardData(
                    "1",
                    "test_soldier",
                    UNIT_CLASS.SOLDIER,
                    10,
                    0,
                    1,
                    1,
                    3,
                    1,
                    1
                ),
                testPlayer),
            new UnitCard(
                "5",
                new UnitCardData(
                    "3",
                    "test_ranger",
                    UNIT_CLASS.RANGER,
                    8,
                    0,
                    2,
                    1,
                    2,
                    3,
                    2
                ),
                testPlayer),
            new UnitCard(
                "6",
                new UnitCardData(
                    "3",
                    "test_ranger",
                    UNIT_CLASS.RANGER,
                    8,
                    0,
                    2,
                    1,
                    2,
                    3,
                    2
                ),
                testPlayer),
            new UnitCard(
                "7",
                new UnitCardData(
                    "6",
                    "test_guardian",
                    UNIT_CLASS.GUARDIAN,
                    15,
                    0,
                    1,
                    1,
                    1,
                    1,
                    3
                ),
                testPlayer),
            new SpellCard(
                "8",
                new SpellCardData(
                    "1",
                    "test_fire_spell",
                    TARGET_TYPES.enemy,
                    5,
                    "Deal 1 burn damage per turn for 3 turns",
                    {
                        name: "Burn",
                        targetType: TARGET_TYPES.enemy,
                        effectType: SPELL_EFFECT_TYPE.dealDamage,
                        amount: 1,
                        valueType: ValueType.VALUE,
                        duration: 3,
                        isRemovable: true
                    }
                ),
                testPlayer),
            new SpellCard(
                "9",
                new SpellCardData(
                    "2",
                    "test_heal_spell",
                    TARGET_TYPES.ally,
                    2,
                    "Heal target by 10 hp",
                    {
                        name: "Heal",
                        targetType: TARGET_TYPES.ally,
                        effectType: SPELL_EFFECT_TYPE.heal,
                        amount: 10,
                        valueType: ValueType.VALUE,
                        isRemovable: true
                    }
                ),
                testPlayer),
        ];

        const testPlayerDeck = new Deck(testPlayerDeckCards, testPlayerLeader);
        const testOpponentDeck = new Deck([], testOpponentLeader);

        const testGamePlayer = new GamePlayer(1, testPlayer, 1, getPlayerColor(1), testPlayerDeck);
        const testGameOpponent = new GamePlayer(2, testPlayer2, 2, getPlayerColor(2), testOpponentDeck);

        this.game.registry.set(GAME_STATE.player, testGamePlayer);
        this.game.registry.set(GAME_STATE.opponents, [testGameOpponent])

        this.game.scene.start(SCENES.GAMEPLAY);
    }

    update() {

    }
}