import { HAND_UI_SIZE } from "../config";
import { ASSETS } from "../enums/keys/assets";
import { GAME_STATE } from "../enums/keys/gameState";
import { SCENES } from "../enums/keys/scenes";
import FieldManager from "../scripts/fieldManager";
import setupMouseInputs from "../scripts/inputHandler";
import TurnManager from "../scripts/turnManager";



export default class GameplayScene extends Phaser.Scene{
    private fieldManager?: FieldManager;
    private turnManager?: TurnManager;

    constructor(){
        super({
            key: SCENES.GAMEPLAY,
            active:true
        });
        
    }

    init(data:any){
    }


    preload(){
        this.load.image(ASSETS.TILE_SET, "assets/maps/tilesets/tileset.png");
        this.load.image(ASSETS.MAP_ICONS, "assets/maps/tilesets/mapicons.png");

        this.load.tilemapTiledJSON(ASSETS.TILE_MAP,"assets/maps/testmap.json");
    }

    create(){
        this.fieldManager = new FieldManager(this);

        const map = this.game.registry.get(GAME_STATE.field).mapData.map;
        const camera = this.cameras.main;
        this.cameras.main
            .setBounds(0,0,map.widthInPixels+(map.widthInPixels*0.1),(map.heightInPixels)+(HAND_UI_SIZE.height/3.125))
            .setZoom(3.125)
            .setOrigin(0.5);
        
        setupMouseInputs(this.input,camera);  
    }

    update(){

    }
}