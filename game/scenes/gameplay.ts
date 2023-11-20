import { CANVAS_SIZE, HAND_UI_SIZE, SCALE, TILESIZE } from "../config";
import { ASSETS } from "../enums/keys/assets";
import { PLAYER_TINTS } from "../enums/keys/playerTints";
import { SCENES } from "../enums/keys/scenes";
import FieldManager from "../gameobjects/fieldManager";
import Player from "../gameobjects/player";
import setupMouseInputs from "../scripts/inputHandler";
import TurnManager from "../scripts/turnManager";



export default class GameplayScene extends Phaser.Scene{
    private map?:Phaser.Tilemaps.Tilemap;
    private tileObstacleLayer?:Phaser.Tilemaps.TilemapLayer;
    private tileKeyPointLayer?: Phaser.Tilemaps.TilemapLayer;
    private playerStartLayer?:Phaser.Tilemaps.ObjectLayer;

    private players?: Player[];
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

    private generateMap(){
        this.map = this.make.tilemap({key:ASSETS.TILE_MAP, tileWidth:TILESIZE.width, tileHeight:TILESIZE.height})!;
        this.map.addTilesetImage(ASSETS.TILE_MAP_TILE_SET_IMG,ASSETS.TILE_SET);
        this.map.addTilesetImage(ASSETS.TILE_MAP_ICON_SET_IMG,ASSETS.MAP_ICONS)!;

        const tileGroundLayer = this.map.createLayer(ASSETS.TILE_GROUND_LAYER,ASSETS.TILE_MAP_TILE_SET_IMG,0,0);
        tileGroundLayer!.setOrigin(0)
                        .setScale(SCALE);
        const tileDecorationLayer = this.map.createLayer(ASSETS.TILE_DECORATION_LAYER,ASSETS.TILE_MAP_TILE_SET_IMG,0,0);
        tileDecorationLayer!.setOrigin(0)
                            .setScale(SCALE);

        this.tileObstacleLayer = this.map.createLayer(ASSETS.TILE_OBSTACLE_LAYER,ASSETS.TILE_MAP_TILE_SET_IMG,0,0)!;
        this.tileObstacleLayer!.setOrigin(0)
                               .setScale(SCALE);

        this.tileKeyPointLayer = this.map.createLayer(ASSETS.TILE_KEY_POINTS_LAYER,ASSETS.TILE_MAP_ICON_SET_IMG,0,0)!;
        this.tileKeyPointLayer.setOrigin(0)
                          .setScale(SCALE);     

        this.playerStartLayer = this.map.getObjectLayer(ASSETS.TILE_MAP_PLAYER_START_LAYER)!;
    }

    create(){
        this.generateMap();
        
        this.add.grid(
            0,
            0,
            TILESIZE.width*this.map!.width*SCALE,
            TILESIZE.height*this.map!.height*SCALE,
            TILESIZE.width,
            TILESIZE.height,
            0,
            0,
            0x565656);


        this.cameras.main.setBounds(0,0,TILESIZE.width*this.map!.width,TILESIZE.height*this.map!.height+HAND_UI_SIZE.height);

        setupMouseInputs(this.input,this.cameras.main);
        
        this.playerStartLayer!.objects.forEach(
            object=>{
                const tileX = Math.floor(object.x!/TILESIZE.width*SCALE);
                const tileY = Math.floor(object.y!/TILESIZE.height*SCALE);

                console.log(tileX+","+tileY);
                switch(object.name){
                    case "1":
                        this.tileKeyPointLayer!.getTileAt(tileX,tileY).tint=PLAYER_TINTS.PLAYER1;
                        break;
                    case "2":
                        this.tileKeyPointLayer!.getTileAt(tileX,tileY).tint=PLAYER_TINTS.PLAYER2;
                        break;
                    case "3":
                        this.tileKeyPointLayer!.getTileAt(tileX,tileY).tint=PLAYER_TINTS.PLAYER3;
                        break;
                    case "4":
                        this.tileKeyPointLayer!.getTileAt(tileX,tileY).tint=PLAYER_TINTS.PLAYER4;
                        break;
                    default:
                        break;
                }
                
            }
        )

    }

    update(){

    }
}