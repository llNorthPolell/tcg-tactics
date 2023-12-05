import { ASSETS } from "../enums/keys/assets";
import { EVENTS } from "../enums/keys/events";
import { GAME_STATE } from "../enums/keys/gameState";
import { PLAYER_TINTS } from "../enums/keys/playerTints";
import { TILE_COLORS } from "../enums/keys/tileColors";
import { EventEmitter } from "./events";
import CapturableLandmark from "../gameobjects/landmarks/capturableLandmark";
import Stronghold from "../gameobjects/landmarks/stronghold";
import Player from "../gameobjects/player";
import Unit from "../gameobjects/unit";
import Landmark from "../gameobjects/landmarks/landmark";
import RallyPoint from "../gameobjects/landmarks/rallyPoint";
import Outpost from "../gameobjects/landmarks/outpost";
import ResourceNode from "../gameobjects/landmarks/resourceNode";
import { Position } from "../data/position";
import ParentLandmark from "../gameobjects/landmarks/parentLandmark";

export type PlayerFieldData = {
    player: Player,
    champions: Unit[],
    activeUnits: Unit[],   
    traps: any[], // TODO: Implement trap spell effects 
    capturables: CapturableLandmark[],
    stronghold?: Stronghold,
    rallyPoints: any[] // TODO: Implement rally points
}

export type TilemapData = {
    map: Phaser.Tilemaps.Tilemap,
    layers:{
        ground: Phaser.Tilemaps.TilemapLayer,
        decoration: Phaser.Tilemaps.TilemapLayer,
        obstacle: Phaser.Tilemaps.TilemapLayer,
        landmarks:Phaser.Tilemaps.TilemapLayer,
        playerStarts: Phaser.Tilemaps.ObjectLayer
    }
}

export type Field = {
    mapData: TilemapData,
    neutral: {
        capturables: CapturableLandmark[];
    },
    players: PlayerFieldData[]
}

export default class FieldManager{
    private scene: Phaser.Scene;
    private highlightTiles?: Phaser.GameObjects.Rectangle[][];


    constructor(scene:Phaser.Scene){
        this.scene=scene;
 

        EventEmitter.on(
            EVENTS.fieldEvent.SUMMON_UNIT,
            this.summonUnit
        );


        EventEmitter.on(
            EVENTS.fieldEvent.CAST_SPELL,
            ()=>{
                console.log(`Played spell... `);
            }
        )

        const tilemap = this.generateMap();
        this.generateHighlightTiles(tilemap);
        const landmarks = this.loadLandmarks(tilemap);
        console.log(landmarks);

        this.assignInitialLandmarks(tilemap);

        
        const field :Field = {
            mapData: tilemap,
            neutral: {
                capturables: []
            },
            players: []
        }


        this.scene.game.registry.set(GAME_STATE.field,field);
    }

    private generateMap() : TilemapData{
        const map = this.scene.make.tilemap({key:ASSETS.TILE_MAP})!;
        map.addTilesetImage(ASSETS.TILE_MAP_TILE_SET_IMG,ASSETS.TILE_SET);
        map.addTilesetImage(ASSETS.TILE_MAP_ICON_SET_IMG,ASSETS.MAP_ICONS)!;

        const tileGroundLayer = map
            .createLayer(ASSETS.TILE_GROUND_LAYER,ASSETS.TILE_MAP_TILE_SET_IMG,0,0)!
            .setOrigin(0);
        
        const tileDecorationLayer = map
            .createLayer(ASSETS.TILE_DECORATION_LAYER,ASSETS.TILE_MAP_TILE_SET_IMG,0,0)!
            .setOrigin(0);

        const tileObstacleLayer = map
            .createLayer(ASSETS.TILE_OBSTACLE_LAYER,ASSETS.TILE_MAP_TILE_SET_IMG,0,0)!
            .setOrigin(0);

        const tileLandmarksLayer = map
            .createLayer(ASSETS.TILE_LANDMARKS_LAYER,ASSETS.TILE_MAP_ICON_SET_IMG,0,0)!
            .setOrigin(0);     

        const playerStartLayer = map
            .getObjectLayer(ASSETS.TILE_MAP_PLAYER_START_LAYER)!;

        return {
            map: map,
            layers: {
                ground: tileGroundLayer,
                decoration: tileDecorationLayer,
                obstacle: tileObstacleLayer,
                landmarks:tileLandmarksLayer,
                playerStarts: playerStartLayer
            }
        }
    }

    generateHighlightTiles(tilemapData:TilemapData){
        const map = tilemapData.map;
        const obstacleLayer = tilemapData.layers.obstacle;

        let highlightTiles= new Array(map.height).fill([]).map(row=>new Array(map.width));
        map.forEachTile(
            tile=>{
                const color = (obstacleLayer.getTileAt(tile.x,tile.y))? TILE_COLORS.danger:TILE_COLORS.success;

                const highlight = this.scene.add.rectangle(tile.pixelX, tile.pixelY,tile.width, tile.height,color,0.25)
                    .setStrokeStyle(1,color)
                    .setOrigin(0)
                    .setName(`tile_${tile.x}_${tile.y}`)
                    .setInteractive(); 
            
                highlight.on(
                    Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
                    ()=>{
                        console.log(`Clicked on tile at (${tile.x},${tile.y})`)
                    }
                )

                highlightTiles[tile.y][tile.x]=highlight;

                highlight.setVisible(false).setActive(false);
            }
        );

        this.highlightTiles=highlightTiles;
    }


    loadLandmarks(tilemapData:TilemapData) :  Map<string,Landmark>{
        let landmarks : Map<string,Landmark> = new Map();
        let rallyPoints: Map<string,RallyPoint> = new Map();
        let parentNodes: Map<string,ParentLandmark> = new Map();
        const landmarksLayer = tilemapData.layers.landmarks;
        
        landmarksLayer.forEachTile(
            landmark=>{
                const tileX = landmark.x;
                const tileY = landmark.y;
                const position = {x:tileX,y:tileY};
                const landmarkName = landmark.properties.name as string;
                const key = `${tileX}_${tileY}`;
                let value;
                // store reference to landmark
                switch(landmarkName){
                    case "Stronghold":
                        console.log(`Stronghold at (${tileX},${tileY})`);
                        value = new Stronghold(`stronghold_${landmarks.size}`,tileX,tileY);
                        parentNodes.set(key, value);
                        break;
                    case "Rally Point":
                        console.log(`Rally Point at (${tileX},${tileY})`);
                        value = new RallyPoint(`rally_point_${landmarks.size}`,tileX,tileY);
                        rallyPoints.set(key,value);
                        break;
                    case "Outpost":
                        console.log(`Outpost at (${tileX},${tileY})`);
                        value = new Outpost(`outpost_${landmarks.size}`,tileX,tileY);
                        parentNodes.set(key, value);
                        break;
                    case "Resource Node": 
                        console.log(`Resource Node at (${tileX},${tileY})`);
                        value = new ResourceNode(`resource_node_${landmarks.size}`,tileX,tileY);
                        break;
                    case "Interest Point":
                        console.log(`Interest Point at (${tileX},${tileY})`);
                        break;
                    case "Camp":
                        console.log(`Camp at (${tileX},${tileY})`);
                        break;
                    default:
                        break;
                }

                if (value)
                    landmarks.set(key, value);
                
            }
        );
        this.linkRalliesToParents(parentNodes, rallyPoints)
        return landmarks;
    }

    private linkRalliesToParents(parentNodes:Map<string,ParentLandmark>, rallyPoints:Map<string,RallyPoint>){
        parentNodes.forEach(
            parentNode=>{
                let rallies : RallyPoint[] = [];
                const west = rallyPoints.get(`${parentNode.x-1}_${parentNode.y}`);
                const northwest = rallyPoints.get(`${parentNode.x-1}_${parentNode.y-1}`);
                const north = rallyPoints.get(`${parentNode.x}_${parentNode.y-1}`);
                const northeast = rallyPoints.get(`${parentNode.x+1}_${parentNode.y-1}`);
                const east = rallyPoints.get(`${parentNode.x+1}_${parentNode.y}`);
                const southeast = rallyPoints.get(`${parentNode.x+1}_${parentNode.y+1}`);
                const south = rallyPoints.get(`${parentNode.x}_${parentNode.y+1}`);
                const southwest = rallyPoints.get(`${parentNode.x-1}_${parentNode.y+1}`);
                
                if (west) rallies = [...rallies,west];
                if (northwest) rallies = [...rallies,northwest];
                if (north) rallies = [...rallies,north];
                if (northeast) rallies = [...rallies,northeast];
                if (east) rallies = [...rallies,east];
                if (southeast) rallies = [...rallies,southeast];
                if (south) rallies = [...rallies,south];
                if (southwest) rallies = [...rallies,southwest];

                parentNode.linkRallyPoints(rallies);
            }
        )
    }


    assignInitialLandmarks(tilemapData:TilemapData){
        const playerStartLayer=tilemapData.layers.playerStarts;
        const landmarksLayer=tilemapData.layers.landmarks;
        
        playerStartLayer.objects.forEach(
            object=>{
                const tileX = Math.floor(object.x!/object.width!);
                const tileY = Math.floor(object.y!/object.height!);

                const landmark = landmarksLayer.getTileAt(tileX,tileY);
                // assign color to landmark
                switch(object.name){
                    case "1":
                        landmark.tint=PLAYER_TINTS.PLAYER1;
                        break;
                    case "2":
                        landmark.tint=PLAYER_TINTS.PLAYER2;
                        break;
                    case "3":
                        landmark.tint=PLAYER_TINTS.PLAYER3;
                        break;
                    case "4":
                        landmark.tint=PLAYER_TINTS.PLAYER4;
                        break;
                    default:
                        break;
                }
                
            }
        );
    }


    showHighlightTiles(
        locations?:{x:number,y:number}[],
        color?:number
    ){
        locations?.forEach(
            position=>{
                const highlightTile = this.highlightTiles![position.y][position.x];
                highlightTile.setActive(true).setVisible(true);
                highlightTile.setFillStyle(color,0.25).setStrokeStyle(1,color);
            }
        )
    }

    hideHighlightTiles(
        locations?:{x:number,y:number}[]
    ){
        locations?.forEach(
            position=>{
                this.highlightTiles![position.y][position.x]
                    .setActive(false)
                    .setVisible(false);
            }
        )
    }

    summonUnit(unit:Unit,x:number,y:number){
        console.log(`Summoned ${unit.getData().name} with id ${unit.id} at location ${x},${y}`);
    }
}