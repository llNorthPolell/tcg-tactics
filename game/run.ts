import Phaser from "phaser";
import {config} from "./config";
import GameplayScene from "./scenes/gameplay";
import { SCENES } from "./enums/keys/scenes";
import HUD from "./scenes/hud";
import LoadingScene from "./scenes/loading";



export default function run() : Phaser.Game{
    const game = new Phaser.Game(config);

    game.scene.add(SCENES.LOADING,LoadingScene,false);
    game.scene.add(SCENES.GAMEPLAY,GameplayScene,false);
    game.scene.add(SCENES.HUD,HUD,false);
    
    game.scene.start(SCENES.LOADING);

    return game;
}