import Phaser from "phaser";
import {config} from "./config";
import GameplayScene from "./scenes/gameplay";
import { SCENES } from "./enums/keys/scenes";
import HUD from "./scenes/hud";
import Player from "./gameobjects/player";
import HeroCard from "./gameobjects/cards/heroCard";
import HeroCardData from "./data/cards/heroCardData";
import { UNIT_CLASS } from "./enums/keys/unitClass";
import UnitCard from "./gameobjects/cards/unitCard";
import UnitCardData from "./data/cards/unitCardData";
import SpellCard from "./gameobjects/cards/spellCard";
import SpellCardData from "./data/cards/spellCardData";
import DealDamage from "./scripts/skillEffects/dealDamage";
import { ValueType } from "./enums/valueType";



export default function run() : Phaser.Game{
    const game = new Phaser.Game(config);

    const deck = [
        new HeroCard("1",new HeroCardData(
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
        )),
        new UnitCard("2",new UnitCardData(
            "2",
            "test_soldier",
            UNIT_CLASS.SOLDIER,
            1000,
            100,
            500,
            200,
            3,
            1
        )),
        new UnitCard("3",new UnitCardData(
            "2",
            "test_soldier",
            UNIT_CLASS.SOLDIER,
            1000,
            100,
            500,
            200,
            3,
            1
        )),
        new UnitCard("4",new UnitCardData(
            "2",
            "test_soldier",
            UNIT_CLASS.SOLDIER,
            1000,
            100,
            500,
            200,
            3,
            1
        )),
        new UnitCard("5",new UnitCardData(
            "3",
            "test_ranger",
            UNIT_CLASS.RANGER,
            800,
            200,
            600,
            100,
            2,
            2
        )),
        new UnitCard("6",new UnitCardData(
            "3",
            "test_ranger",
            UNIT_CLASS.RANGER,
            1000,
            200,
            600,
            100,
            2,
            2
        )),
        new UnitCard("7",new UnitCardData(
            "3",
            "test_guardian",
            UNIT_CLASS.GUARDIAN,
            2000,
            200,
            200,
            500,
            1,
            3
        )),
        new SpellCard("8",new SpellCardData(
            "4",
            "test_fire_spell",
            5,
            "Deal 100 burn damage per turn for 3 turns"
        ),
        [
            new DealDamage(
                100,
                ValueType.VALUE,
                3,
                true
            )
        ]),
    ];


    const testPlayer = new Player(1,deck)

    game.scene.add(SCENES.GAMEPLAY,GameplayScene,false,{player:testPlayer});
    game.scene.add(SCENES.HUD,HUD,false,{player:testPlayer});
    game.scene.start(SCENES.GAMEPLAY, {player:testPlayer});

    return game;
}