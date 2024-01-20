
import { HAND_UI_SIZE } from "../config";
import { TilemapData } from "../data/types/tilemapData";
import { LandmarksCollection } from "../data/types/landmarksCollection";
import { GAME_STATE } from "../enums/keys/gameState";
import { SCENES } from "../enums/keys/scenes";
import GamePlayer from "../gameobjects/player/gamePlayer";
import SelectionTile from "../gameobjects/selectionTiles/selectionTile";
import setupMouseInputs from "../scripts/inputHandler";
import Field from "../state/field";
import GameState from "../state/gameState";
import TurnController from "../controllers/turnController";
import LandmarkController from "../controllers/landmarkController";
import SelectionTileController from "../controllers/selectionGridController";
import UnitController from "../controllers/unitController";
import EventDispatcher from "../controllers/eventDispatcher";
import EffectSystem from "../system/effectSystem";
import { EventEmitter } from "../scripts/events";
import { EVENTS } from "../enums/keys/events";
import FieldSetupScripts from "../scripts/fieldSetupScripts";


type GamePlayers = {
    player: GamePlayer,
    playersInGame: GamePlayer[]
}

export default class GameplayScene extends Phaser.Scene{
    private turn?:TurnController;
    private landmarks?:LandmarkController
    private selectionTiles?: SelectionTileController;
    private units?:UnitController;
    private effects?:EffectSystem;
    private eventSystem?:EventDispatcher;

    private started:boolean;

    constructor(){
        super({
            key: SCENES.GAMEPLAY
        });
        this.started=false;
    }

    preload(){}

    create(){
        const tilemapData : TilemapData = this.game.registry.get(GAME_STATE.tilemapData);

        this.turn = this.game.registry.get(GAME_STATE.turnController);
        this.units = this.game.registry.get(GAME_STATE.unitsController);
        this.selectionTiles = this.game.registry.get(GAME_STATE.selectionTilesController);
        this.landmarks = this.game.registry.get(GAME_STATE.landmarksController);
        this.effects = this.game.registry.get(GAME_STATE.effectsSystem);
        this.eventSystem = this.game.registry.get(GAME_STATE.eventDispatcher);
        
        const map = tilemapData.map;
        const camera = this.cameras.main;

        const bounds = {x:map.widthInPixels*1.3, y: (map.heightInPixels)+(HAND_UI_SIZE.height/3.125)}
        this.cameras.main
            .setBounds(0,0,bounds.x,bounds.y)
            .setZoom(3.125);
        
        setupMouseInputs(this.input,camera);  

        /*const playersInGame = this.game.registry.get(GAME_STATE.playersInGame);
        const unitsController = this.game.registry.get(GAME_STATE.unitsController);
        FieldSetupScripts.spawnDeckLeaders(this,playersInGame,unitsController);*/


        this.game.scene.start(SCENES.HUD);
        this.game.scene.start(SCENES.TURN_TRANSITION);

        EventEmitter.emit(EVENTS.gameEvent.START_GAME);
        this.started=true;
    }

    update(){}
}