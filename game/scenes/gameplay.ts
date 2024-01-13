
import { HAND_UI_SIZE } from "../config";
import { EVENTS } from "../enums/keys/events";
import { GAME_STATE } from "../enums/keys/gameState";
import { SCENES } from "../enums/keys/scenes";
import Player from "../gameobjects/gamePlayer";
import CombatHandler from "../scripts/combatHandler";
import { EventEmitter } from "../scripts/events";
import FieldManager from "../scripts/fieldManager";
import setupMouseInputs from "../scripts/inputHandler";
import TurnManager from "../scripts/turnManager";

type GamePlayers = {
    player: Player,
    playersInGame: Player[]
}

export default class GameplayScene extends Phaser.Scene{
    private fieldManager?: FieldManager;
    private turnManager?: TurnManager;
    private combatHandler? : CombatHandler;
    private started:boolean;

    constructor(){
        super({
            key: SCENES.GAMEPLAY
        });
        this.started=false;
    }

    preload(){}

    create(){
        const {player,playersInGame} = this.loadPlayers();
        this.game.scene.start(SCENES.HUD);
        this.game.scene.start(SCENES.TURN_TRANSITION);
        this.fieldManager = new FieldManager(this,playersInGame);
        this.turnManager = new TurnManager(this,player,playersInGame);
        this.combatHandler = new CombatHandler();


        
        const map = this.game.registry.get(GAME_STATE.field).mapData.map;
        const camera = this.cameras.main;

        const bounds = {x:map.widthInPixels*1.3, y: (map.heightInPixels)+(HAND_UI_SIZE.height/3.125)}
        this.cameras.main
            .setBounds(0,0,bounds.x,bounds.y)
            .setZoom(3.125);
        
        setupMouseInputs(this.input,camera);  

    }

    private loadPlayers() : GamePlayers {
        const player:Player = this.game.registry.get(GAME_STATE.player);
        const opponents:Player[] = this.game.registry.get(GAME_STATE.opponents);

        return {
            player: player,
            playersInGame:[player,...opponents]
        };
    }

    update(){
        if (!this.started){
            EventEmitter.emit(EVENTS.gameEvent.NEXT_TURN);
            this.started=true;
        }
    }
}