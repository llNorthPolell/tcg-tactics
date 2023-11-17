import { ASSETS } from "../enums/keys/assets";
import { SCENES } from "../enums/keys/scenes";

export default class GameplayScene extends Phaser.Scene{
    constructor(){
        super({
            key: SCENES.GAMEPLAY,
            active:true
        });
    }


    preload(){
        this.load.image(ASSETS.TILE_SET, "assets/maps/tilesets/tileset.png");
        this.load.image(ASSETS.MAP_ICONS, "assets/maps/tilesets/mapicons.png");

        this.load.tilemapTiledJSON(ASSETS.TILE_MAP,"assets/maps/testmap.json");
    }

    create(){
        /*this.add.rectangle(100,100,100,100,0x00ffff);
        this.add.circle(200,100,50,0xff00ff);
        this.add.polygon(0,0,[{x:300,y:200},{x:400,y:200},{x:350,y:100}],0xffff00);*/

        const map = this.make.tilemap({key:ASSETS.TILE_MAP, tileWidth:32, tileHeight:32});
        const tileset = map.addTilesetImage(ASSETS.TILE_MAP_TILE_SET_IMG,ASSETS.TILE_SET);
        const mapIconSet = map.addTilesetImage(ASSETS.TILE_MAP_ICON_SET_IMG,ASSETS.MAP_ICONS);
        const tileGroundLayer = map.createLayer(ASSETS.TILE_GROUND_LAYER, tileset!);
        const tileDecorationLayer = map.createLayer(ASSETS.TILE_DECORATION_LAYER, tileset!);
        const tileObstacleLayer = map.createLayer(ASSETS.TILE_OBSTACLE_LAYER, tileset!);
        const tileKeyPointsLayer = map.createLayer(ASSETS.TILE_KEY_POINTS_LAYER,mapIconSet!);
    }

    update(){

    }
}