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

export default class LoadingScene extends Phaser.Scene{


    preload(){
        //map
        this.load.image(ASSETS.TILE_SET, "assets/maps/tilesets/tileset.png");
        this.load.image(ASSETS.MAP_ICONS, "assets/maps/tilesets/mapicons.png");
        
        this.load.tilemapTiledJSON(ASSETS.TILE_MAP,"assets/maps/testmap2.json");

        // portrait
        this.load.image(ASSETS.UNDEFINED,"assets/portraits/undefined.png");
    }

    create(){
        console.log("Now Loading...");
        const testPlayerInfo = new Player(uuidv4().toString(), "TestPlayer");
        const testPlayer2Info = new Player(uuidv4().toString(), "Enemy");
    
        const testPlayer = new GamePlayer(1,testPlayerInfo,getPlayerColor(1));
        const testOpponent = new GamePlayer(2,testPlayer2Info,getPlayerColor(2));
    
        /*const testPlayerDeck = [
            new HeroCardData(
                "1",
                "test_hero",
                UNIT_CLASS.SOLDIER,
                3000,
                3000,
                800,
                500,
                3,
                "pwr +50% to all",
                "+5 pwr to units 1 tile adjacent to this unit",
                "deal 500 damage to target",
                ["Soldier","Soldier","Soldier","Ranger", "Ranger", "Guardian"],
                5
            ),
            new UnitCardData(
                "2",
                "test_soldier",
                UNIT_CLASS.SOLDIER,
                1000,
                100,
                500,
                200,
                3,
                1
            ),
            new UnitCardData(
                "2",
                "test_soldier",
                UNIT_CLASS.SOLDIER,
                1000,
                100,
                500,
                200,
                3,
                1
            ),
            new UnitCardData(
                "2",
                "test_soldier",
                UNIT_CLASS.SOLDIER,
                1000,
                100,
                500,
                200,
                3,
                1
            ),
            new UnitCardData(
                "3",
                "test_ranger",
                UNIT_CLASS.RANGER,
                800,
                200,
                600,
                100,
                2,
                2
            ),
            new UnitCardData(
                "3",
                "test_ranger",
                UNIT_CLASS.RANGER,
                1000,
                200,
                600,
                100,
                2,
                2
            ),
            new UnitCardData(
                "3",
                "test_guardian",
                UNIT_CLASS.GUARDIAN,
                2000,
                200,
                200,
                500,
                1,
                3
            ),
            new SpellCardData(
                "4",
                "test_fire_spell",
                5,
                "Deal 100 burn damage per turn for 3 turns"
            ),
        ]*/
    
        const testPlayerDeck = [
            new HeroCard(
                "1",
                new HeroCardData(
                    "1",
                    "test_hero",
                    UNIT_CLASS.SOLDIER,
                    3000,
                    3000,
                    800,
                    500,
                    3,
                    "pwr +50% to all",
                    "+5 pwr to units 1 tile adjacent to this unit",
                    "deal 500 damage to target",
                    ["Soldier","Soldier","Soldier","Ranger", "Ranger", "Guardian"],
                    5
                ),
                testPlayer),
            new UnitCard(
                "2",
                new UnitCardData(
                    "1",
                    "test_soldier",
                    UNIT_CLASS.SOLDIER,
                    1000,
                    100,
                    500,
                    200,
                    3,
                    1
                ),
                testPlayer),
            new UnitCard(
                "3",
                new UnitCardData(
                    "1",
                    "test_soldier",
                    UNIT_CLASS.SOLDIER,
                    1000,
                    100,
                    500,
                    200,
                    3,
                    1
                ),
                testPlayer),
            new UnitCard(
                "4",
                new UnitCardData(
                    "1",
                    "test_soldier",
                    UNIT_CLASS.SOLDIER,
                    1000,
                    100,
                    500,
                    200,
                    3,
                    1
                ),
                testPlayer),
            new UnitCard(
                "5",
                new UnitCardData(
                    "3",
                    "test_ranger",
                    UNIT_CLASS.RANGER,
                    800,
                    200,
                    600,
                    100,
                    2,
                    2
                ),
                testPlayer),
            new UnitCard(
                "6",
                new UnitCardData(
                    "3",
                    "test_ranger",
                    UNIT_CLASS.RANGER,
                    1000,
                    200,
                    600,
                    100,
                    2,
                    2
                ),
                testPlayer),
            new UnitCard(
                "7",
                new UnitCardData(
                    "6",
                    "test_guardian",
                    UNIT_CLASS.GUARDIAN,
                    2000,
                    200,
                    200,
                    500,
                    1,
                    3
                ),
                testPlayer),
            new SpellCard(
                "8",
                new SpellCardData(
                    "1",
                    "test_fire_spell",
                    5,
                    "Deal 100 burn damage per turn for 3 turns",
                    "12345"
                )/*,
                [
                    new DealDamage(
                        'Burn',
                        100,
                        ValueType.VALUE,
                        3,
                        true
                    )
                ]*/,
                testPlayer),
        ];
    
        this.game.registry.set(GAME_STATE.player, testPlayer);
        this.game.registry.set(GAME_STATE.deck, testPlayerDeck);
        this.game.registry.set(GAME_STATE.opponents, [testOpponent])
    
        this.game.scene.start(SCENES.GAMEPLAY);
    }

    update(){

    }
}