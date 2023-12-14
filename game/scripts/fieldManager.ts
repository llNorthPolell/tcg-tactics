import { ASSETS } from "../enums/keys/assets";
import { EVENTS } from "../enums/keys/events";
import { GAME_STATE } from "../enums/keys/gameState";
import { EventEmitter } from "./events";
import Stronghold from "../gameobjects/landmarks/stronghold";
import GamePlayer from "../gameobjects/gamePlayer";
import Unit from "../gameobjects/unit";
import RallyPoint from "../gameobjects/landmarks/rallyPoint";
import Outpost from "../gameobjects/landmarks/outpost";
import ResourceNode from "../gameobjects/landmarks/resourceNode";
import ParentLandmark from "../gameobjects/landmarks/parentLandmark";
import PointOfInterest from "../gameobjects/landmarks/pointOfInterest";
import { Card } from "../gameobjects/cards/card";
import { Position } from "../data/position";
import { CardData } from "../data/cardData";
import UnitCard from "../gameobjects/cards/unitCard";
import HeroCard from "../gameobjects/cards/heroCard";
import { TileStatus } from "../enums/tileStatus";
import SelectionTile from "../gameobjects/selectionTile";
import UnitCardData from "../data/cards/unitCardData";
import { v4 as uuidv4 } from 'uuid';
import { getTilesInRange } from "./util";
import { TileSelectionType } from "../enums/tileSelectionType";

export type PlayerOwnership = {
    player: GamePlayer,
    champions: Unit[],
    activeUnits: Unit[],   
    traps: any[], // TODO: Implement trap spell effects 
    landmarksOwned: Landmarks
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

export type Landmarks = {
    strongholds : Stronghold[],
    outposts: Outpost[],
    resourceNodes: ResourceNode[],
    rallyPoints?:RallyPoint[]
}

export type Field = {
    mapData: TilemapData,
    playerOwnership: Map<number,PlayerOwnership>
}

export default class FieldManager{
    private scene: Phaser.Scene;
    private selectionTiles?: SelectionTile[][];
    private playerOwnershipMap: Map<number,PlayerOwnership>;
    private activeHighlightTiles: SelectionTile[];
    private tilemap: TilemapData;
    private isPlayerTurn: boolean;
    private movingUnit?:Unit;

    constructor(scene:Phaser.Scene,playersInGame:GamePlayer[]){
        this.scene=scene;
        
        this.playerOwnershipMap = new Map();
        playersInGame.forEach(
            (player)=>{
                this.playerOwnershipMap.set(
                    player.id,
                    {
                        player: player,
                        champions: [],
                        activeUnits: [],   
                        traps: [],
                        landmarksOwned:{
                            strongholds : [],
                            outposts: [],
                            resourceNodes: [],
                            rallyPoints: [] 
                        }
                    }
                )
            }
        );


        const tilemap = this.generateMap();
        this.tilemap=tilemap;
        this.generateHighlightTiles(tilemap);
        this.activeHighlightTiles=[];
        const landmarks = this.loadLandmarks(tilemap);

        this.assignInitialLandmarks(tilemap,landmarks);

        const field :Field = {
            mapData: tilemap,
            playerOwnership: this.playerOwnershipMap
        }


        this.scene.game.registry.set(GAME_STATE.field,field);

        this.handleEvents();

        this.isPlayerTurn=false;
    }

    private handleEvents(){
        EventEmitter
        .on(
            EVENTS.gameEvent.PLAYER_TURN,
            ()=>{
                const playerOwnership = this.playerOwnershipMap.get(1)!;
                const landmarksOwned = playerOwnership.landmarksOwned;
                const income = 
                    (landmarksOwned.strongholds.length*2) + 
                    landmarksOwned.outposts.length + 
                    landmarksOwned.resourceNodes.length;

                this.wake();
                EventEmitter.emit(EVENTS.fieldEvent.GENERATE_RESOURCES,income);
                
                playerOwnership.activeUnits.forEach(
                    (unit:Unit)=>{
                        unit.wake();
                    }
                )
            }
        )
        .on(
            EVENTS.cardEvent.SELECT,
            (card : Card<CardData>)=>{
                this.hideHighlightTiles();
                if (card instanceof UnitCard || card instanceof HeroCard){
                    const rallyPointPositions : Position[] = this.playerOwnershipMap.get(1)!
                        .landmarksOwned
                        .rallyPoints!
                        .map(
                            rallyPoint=> {return {x:rallyPoint.x,y:rallyPoint.y}}
                        );
                    
                    if(this.isPlayerTurn)
                        this.showHighlightTiles(rallyPointPositions,undefined,undefined,TileSelectionType.PLAY_CARD);
                    else
                        this.showHighlightTiles(rallyPointPositions,undefined,TileStatus.WARNING);
                }
            }
        )
        .on(
            EVENTS.cardEvent.CANCEL,
            ()=>{
                this.hideHighlightTiles();
            }
        )
        .on(
            EVENTS.fieldEvent.SUMMON_UNIT,
            (location:Position, unitData:UnitCardData,owner:GamePlayer)=>{
                this.summonUnit(location,unitData,owner);
            }
        )
        .on(
            EVENTS.fieldEvent.CAST_SPELL,
            ()=>{
                console.log(`Played spell... `);
            }
        )
        .on(
            EVENTS.unitEvent.SELECT,
            (unit: Unit)=>{
                if(this.movingUnit)
                    this.movingUnit.cancelMove();
                this.movingUnit=unit;
                this.hideHighlightTiles();
                const movement = unit.getUnitData().currMvt;
                const range = unit.getUnitData().currRng;
                const location = unit.getLocation();
                const active = unit.isActive();
                const highlightTiles = getTilesInRange(
                    location,
                    {x:this.tilemap.map.width-1,y:this.tilemap.map.height-1}, 
                    active? movement:range);
                    
                if (active)
                    this.showHighlightTiles(highlightTiles,unit,undefined,TileSelectionType.MOVE_UNIT);
                else 
                    this.showHighlightTiles(highlightTiles,unit,TileStatus.WARNING);
                
            }
        )
        .on(
            EVENTS.unitEvent.CANCEL,
            ()=>{
                this.hideHighlightTiles();
                this.movingUnit?.cancelMove();
                this.movingUnit=undefined;
            }
        )
        .on(
            EVENTS.unitEvent.WAIT,
            ()=>{
                this.hideHighlightTiles();
                this.movingUnit?.confirmMove();
                this.movingUnit=undefined;
            }
        )
        .on(
            EVENTS.gameEvent.END_TURN,
            ()=>{
                this.sleep();
            }
        )
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

        let selectionTiles= new Array(map.height).fill([]).map(row=>new Array(map.width));
        map.forEachTile(
            tile=>{
                const status = (obstacleLayer.getTileAt(tile.x,tile.y))? TileStatus.DANGER:TileStatus.SUCCESS;
                const selectionTile = new SelectionTile(
                    this.scene,
                    `tile_${tile.x}_${tile.y}`,
                    {x:tile.pixelX, y:tile.pixelY},
                    {x:tile.x,y:tile.y},
                    tile.width, 
                    tile.height,
                    status);

                selectionTiles[tile.y][tile.x]=selectionTile;
            }
        );

        this.selectionTiles=selectionTiles;
    }


    loadLandmarks(tilemapData:TilemapData) : Landmarks{
        let landmarks :Landmarks = {
            strongholds : [],
            outposts : [],
            resourceNodes : []
        };
        let rallyPoints: Map<string,RallyPoint> = new Map();
        let parentNodes: Map<string,ParentLandmark> = new Map();

        const landmarksLayer = tilemapData.layers.landmarks;

        landmarksLayer.forEachTile(
            landmarkTile=>{
                const tileX = landmarkTile.x;
                const tileY = landmarkTile.y;
                const landmarkName = landmarkTile.properties.name as string;
                const key = `${tileX}_${tileY}`;
                let value;
                // store reference to landmark
                switch(landmarkName){
                    case "Stronghold":
                        console.log(`Stronghold at (${tileX},${tileY})`);
                        value = new Stronghold(`stronghold_${tileX}_${tileY}`,tileX,tileY,landmarkTile);
                        parentNodes.set(key, value);
                        landmarks.strongholds = [...landmarks.strongholds,value];
                        break;
                    case "Rally Point":
                        console.log(`Rally Point at (${tileX},${tileY})`);
                        value = new RallyPoint(`rally_point_${tileX}_${tileY}`,tileX,tileY,landmarkTile);
                        rallyPoints.set(key,value);
                        break;
                    case "Outpost":
                        console.log(`Outpost at (${tileX},${tileY})`);
                        value = new Outpost(`outpost_${tileX}_${tileY}`,tileX,tileY,landmarkTile);
                        landmarks.outposts = [...landmarks.outposts,value];
                        parentNodes.set(key, value);
                        break;
                    case "Resource Node": 
                        console.log(`Resource Node at (${tileX},${tileY})`);
                        value = new ResourceNode(`resource_node_${tileX}_${tileY}`,tileX,tileY,landmarkTile);
                        landmarks.resourceNodes = [...landmarks.resourceNodes,value];
                        break;
                    case "Interest Point":
                        console.log(`Interest Point at (${tileX},${tileY})`);
                        value = new PointOfInterest(`point_of_interest_${tileX}_${tileY}`,tileX,tileY,landmarkTile);
                        break;
                    case "Camp":
                        console.log(`Camp at (${tileX},${tileY})`);
                        break;
                    default:
                        break;
                }
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


    assignInitialLandmarks(tilemapData:TilemapData, landmarks:Landmarks){
        const playerStartLayer=tilemapData.layers.playerStarts;
        const landmarksLayer=tilemapData.layers.landmarks;

        playerStartLayer.objects.forEach(
            object=>{
                const tileX = Math.floor(object.x!/object.width!);
                const tileY = Math.floor(object.y!/object.height!);

                const landmarkTile = landmarksLayer.getTileAt(tileX,tileY);
                const landmarkName = landmarkTile.properties.name;
                const playerOwnership = this.playerOwnershipMap.get(Number(object.name));

                switch(landmarkName){
                    case "Stronghold":
                        const stronghold = landmarks.strongholds.find(landmark=>landmark.x==tileX && landmark.y==tileY);
                        if (stronghold){
                            playerOwnership!.landmarksOwned.strongholds = [...playerOwnership!.landmarksOwned.strongholds, stronghold];
                            stronghold.tile.tint=playerOwnership!.player.color;
                            stronghold.getRallyPoints().forEach(
                                rallyPoint=>{
                                    rallyPoint.tile.tint=playerOwnership!.player.color;
                                    playerOwnership!.landmarksOwned.rallyPoints = [...playerOwnership!.landmarksOwned.rallyPoints!,rallyPoint];
                                }
                            )
                        }
                        break;
                    case "Outpost":
                        const outpost = landmarks.outposts.find(landmark=>landmark.x==tileX && landmark.y==tileY);
                        if (outpost){
                            playerOwnership!.landmarksOwned.outposts = [...playerOwnership!.landmarksOwned.outposts, outpost];
                            outpost.tile.tint=playerOwnership!.player.color;
                            outpost.getRallyPoints().forEach(
                                rallyPoint=>{
                                    rallyPoint.tile.tint=playerOwnership!.player.color;
                                    playerOwnership!.landmarksOwned.rallyPoints = [...playerOwnership!.landmarksOwned.rallyPoints!,rallyPoint];
                                }
                            )
                        }
                        break;
                    case "Resource Node":
                        const resourceNode = landmarks.resourceNodes.find(landmark=>landmark.x==tileX && landmark.y==tileY);
                        if (resourceNode){
                            playerOwnership!.landmarksOwned.resourceNodes = [...playerOwnership!.landmarksOwned.resourceNodes, resourceNode];
                            resourceNode.tile.tint=playerOwnership!.player.color;
                        }
                        break;
                }
                
            }
        );
    }

    showHighlightTiles(locations:Position[],unit?:Unit,status?:TileStatus,tileSelectionType:TileSelectionType=TileSelectionType.NONE){
        locations.forEach(
            position=>{
                const selectionTile = this.selectionTiles![position.y][position.x];
                this.activeHighlightTiles = [...this.activeHighlightTiles,selectionTile];
                selectionTile.show(status,unit,tileSelectionType);
            }
        )
    }

    hideHighlightTiles(){
        this.activeHighlightTiles?.forEach(
            selectionTile=>{
                selectionTile.hide();
            }
        )

        this.activeHighlightTiles= [];
    }

    summonUnit(location:Position,unitData:UnitCardData, owner: GamePlayer){
        const unit = new Unit(uuidv4().toString(),location,unitData,owner);
        const position = unit.getLocation();
        unit.render(this.scene);

        const playerOwnership = this.playerOwnershipMap.get(owner.id)!;
        playerOwnership.activeUnits=[...playerOwnership.activeUnits,unit]

        console.log(`Summoned ${unit.getUnitData().name} with id ${unit.id} at location (${position.x},${position.y})`);
    }

    wake(){
        this.isPlayerTurn=true;
    }

    sleep(){
        this.isPlayerTurn=false;
    }

    update(){
        if(this.movingUnit)
            this.movingUnit.update();
    }
}