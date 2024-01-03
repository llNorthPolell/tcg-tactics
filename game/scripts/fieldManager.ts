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
import { inRange } from "./util";
import { TileSelectionType } from "../enums/tileSelectionType";
import Player from "../data/player";
import Landmark from "../gameobjects/landmarks/landmark";
import BaseCapturableLandmark from "../gameobjects/landmarks/baseCapturableLandmark";
import CapturableLandmark from "../gameobjects/landmarks/capturableLandmark";

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
    rallyPoints?:RallyPoint[],
}

export type Field = {
    mapData: TilemapData,
    playerOwnership: Map<number,PlayerOwnership>,
    units: Map<string,Unit>,
    landmarks: Map<string, Landmark>
}

export default class FieldManager{
    private scene: Phaser.Scene;
    private selectionTiles?: SelectionTile[][];
    private playerToIDMap:Map<Player,number>;
    private playerOwnershipMap: Map<number,PlayerOwnership>;
    private activeHighlightTiles: SelectionTile[];
    private tilemap: TilemapData;
    private isPlayerTurn: boolean;
    private units:Map<string,Unit>;
    private movingUnit?:Unit;
    private landmarks: Map<string,Landmark>;

    constructor(scene:Phaser.Scene,playersInGame:GamePlayer[]){
        this.scene=scene;
        
        this.playerOwnershipMap = new Map();
        this.playerToIDMap=new Map();

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
                );

                this.playerToIDMap.set(
                    player.playerInfo,
                    player.id
                )
            }
        );

        const tilemap = this.generateMap();
        this.tilemap=tilemap;
        this.generateHighlightTiles(tilemap);
        this.activeHighlightTiles=[];
        const {landmarks,landmarkMap} = this.loadLandmarks(tilemap);
        this.landmarks = landmarkMap;
        this.units = new Map();

        
        this.assignInitialLandmarks(tilemap,landmarks);

        let field :Field = {
            mapData: tilemap,
            playerOwnership: this.playerOwnershipMap,
            units: this.units,
            landmarks: this.landmarks
        }


        this.scene.game.registry.set(GAME_STATE.field,field);

        this.handleEvents();

        this.isPlayerTurn=false;


        
        playersInGame.forEach(
            player=>{
                const gamePlayer = this.playerOwnershipMap.get(player.id)!;
                if (gamePlayer.player.id!=1) return;
                const stronghold = gamePlayer.landmarksOwned.strongholds[0];
                const leader = player.deck.getLeader();
                if (leader)
                    this.summonUnit({x:stronghold?.x,y:stronghold.y},leader.data,leader.getOwner());
            }
        )
    }

    private handleEvents(){
        EventEmitter
        .on(
            EVENTS.gameEvent.PLAYER_TURN,
            ()=>{
                // TODO: Active player is 1 for testing purposes only
                const playerOwnership = this.playerOwnershipMap.get(1)!;
                const landmarksOwned = playerOwnership.landmarksOwned;
                const income = 
                    (landmarksOwned.strongholds.length*2) + 
                    landmarksOwned.outposts.length + 
                    landmarksOwned.resourceNodes.length;

                this.wake();
                EventEmitter.emit(EVENTS.playerEvent.GENERATE_RESOURCES,income);
                
                playerOwnership.activeUnits.forEach(
                    (unit:Unit)=>{
                        unit.wake();

                        this.attemptCaptureLandmark(unit); 
                    }   
                )
            }
        )
        .on(
            EVENTS.gameEvent.NON_PLAYER_TURN,
            (playerNumber:number)=>{
                const playerOwnership = this.playerOwnershipMap.get(playerNumber)!;
                playerOwnership.activeUnits.forEach(
                    (unit:Unit)=>{
                        unit.wake();

                        this.attemptCaptureLandmark(unit); 
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
            (location:Position, unitData:UnitCardData,cardOwner:Player)=>{
                this.summonUnit(location,unitData,cardOwner);
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
                if(this.movingUnit && this.movingUnit != unit)
                    this.movingUnit.cancelMove();
                this.movingUnit=unit;
                this.hideHighlightTiles();
                const movement = unit.getUnitData().currMvt;
                const range = unit.getUnitData().currRng;
                const location = unit.getLocation();
                const active = unit.isActive();
                const highlightTiles = this.getTilesInRange(
                    location,
                    active? movement:range,
                    !this.movingUnit.isActive());
                    
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
                if (!this.movingUnit) return;
                const prevLocation = this.movingUnit.getLocation();
                this.units.delete(`${prevLocation.x}_${prevLocation.y}`);
                this.movingUnit.confirmMove();
                const newLocation = this.movingUnit.getLocation();
                this.units.set(`${newLocation.x}_${newLocation.y}`,this.movingUnit);
                this.movingUnit=undefined;


            }
        )
        .on(
            EVENTS.unitEvent.ATTACK,
            (attacker:Unit, defender:Unit)=>{
                if (attacker?.isActive()){
                    console.log(`${attacker?.getUnitData().name} attacks ${defender.getUnitData().name}`);
                    console.log(`${defender?.getUnitData().name} takes ${attacker?.getUnitData().currPwr} damage!`);

                    if (attacker.getTargetLocation() && 
                        inRange(defender.getLocation(),attacker.getTargetLocation()!,defender.getUnitData().currRng))
                    console.log(`${attacker?.getUnitData().name} takes ${defender?.getUnitData().currPwr} damage!`);
                }
            }
        )
        .on(
            EVENTS.fieldEvent.CAPTURE_LANDMARK,
            (unit:Unit, landmark:CapturableLandmark)=>{
                const playerOwnership = this.playerOwnershipMap.get(unit.getOwner().id)!;

                if (landmark.getOwner()){
                    const prevPlayerOwnership = this.playerOwnershipMap.get(landmark.getOwner()!.id)!;
                    console.log(`Remove ${landmark.id} from ${landmark.getOwner()!.id}'s ownership...`);

                    if (landmark instanceof Stronghold){
                        prevPlayerOwnership.landmarksOwned.strongholds = 
                            prevPlayerOwnership.landmarksOwned.strongholds.filter(stronghold=> stronghold.id != landmark.id);
                    }
                    else if (landmark instanceof Outpost){
                        prevPlayerOwnership.landmarksOwned.outposts = 
                            prevPlayerOwnership.landmarksOwned.outposts.filter(outpost=> outpost.id != landmark.id);
                    }
                    else if (landmark instanceof ResourceNode)
                        prevPlayerOwnership.landmarksOwned.resourceNodes = 
                            prevPlayerOwnership.landmarksOwned.resourceNodes.filter(resourceNode=> resourceNode.id != landmark.id);

                    if (landmark instanceof Stronghold || landmark instanceof Outpost){
                        const rallyPointsToRemove = landmark.getRallyPoints();
                        prevPlayerOwnership.landmarksOwned.rallyPoints =
                            prevPlayerOwnership.landmarksOwned.rallyPoints?.filter(
                                currRallyPoint=> !rallyPointsToRemove.find(rallyPoint=> rallyPoint = currRallyPoint));
                    }
                   
                    console.log(`Player Ownership after Capture: ${JSON.stringify(prevPlayerOwnership.landmarksOwned.strongholds)}`)
                }
                   
                
                if (landmark instanceof Stronghold)
                    playerOwnership.landmarksOwned.strongholds.push(landmark as Stronghold);
                else if (landmark instanceof Outpost)
                    playerOwnership.landmarksOwned.outposts.push(landmark as Outpost);
                else if (landmark instanceof ResourceNode)
                    playerOwnership.landmarksOwned.resourceNodes.push(landmark as ResourceNode);


                if (landmark instanceof Stronghold || landmark instanceof Outpost)
                    landmark.getRallyPoints().forEach(
                        rallyPoint=>{
                            rallyPoint.tile.tint=playerOwnership!.player.color;
                            playerOwnership.landmarksOwned.rallyPoints = [...playerOwnership.landmarksOwned.rallyPoints!,rallyPoint];
                        }
                    )
                    
                landmark.capture(unit.getOwner());
                landmark.tile.tint = playerOwnership.player.color;
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


    loadLandmarks(tilemapData:TilemapData) : {landmarks:Landmarks, landmarkMap:Map<string,Landmark>}{
        let landmarks :Landmarks = {
            strongholds : [],
            outposts : [],
            resourceNodes : []
        };
        let rallyPoints: Map<string,RallyPoint> = new Map();
        let parentNodes: Map<string,ParentLandmark> = new Map();
        let landmarkMap : Map<string, Landmark> = new Map();

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
                if (value)
                    landmarkMap.set(key,value);
                
            }
        );
        this.linkRalliesToParents(parentNodes, rallyPoints)
        return {landmarks, landmarkMap};
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
                const playerOwnership = this.playerOwnershipMap.get(Number(object.name))!;

                switch(landmarkName){
                    case "Stronghold":
                        const stronghold = landmarks.strongholds.find(landmark=>landmark.x==tileX && landmark.y==tileY);
                        if (stronghold){
                            playerOwnership.landmarksOwned.strongholds = [...playerOwnership.landmarksOwned.strongholds, stronghold];
                            stronghold.tile.tint=playerOwnership.player.color;
                            stronghold.getRallyPoints().forEach(
                                rallyPoint=>{
                                    rallyPoint.tile.tint=playerOwnership.player.color;
                                    playerOwnership.landmarksOwned.rallyPoints = [...playerOwnership.landmarksOwned.rallyPoints!,rallyPoint];
                                }
                            )
                            stronghold.capture(playerOwnership!.player);
                        }
                        break;
                    case "Outpost":
                        const outpost = landmarks.outposts.find(landmark=>landmark.x==tileX && landmark.y==tileY);
                        if (outpost){
                            playerOwnership.landmarksOwned.outposts = [...playerOwnership.landmarksOwned.outposts, outpost];
                            outpost.tile.tint=playerOwnership.player.color;
                            outpost.getRallyPoints().forEach(
                                rallyPoint=>{
                                    rallyPoint.tile.tint=playerOwnership!.player.color;
                                    playerOwnership.landmarksOwned.rallyPoints = [...playerOwnership.landmarksOwned.rallyPoints!,rallyPoint];
                                }
                            )
                            outpost.capture(playerOwnership.player);
                        }
                        break;
                    case "Resource Node":
                        const resourceNode = landmarks.resourceNodes.find(landmark=>landmark.x==tileX && landmark.y==tileY);
                        if (resourceNode){
                            playerOwnership.landmarksOwned.resourceNodes = [...playerOwnership!.landmarksOwned.resourceNodes, resourceNode];
                            resourceNode.tile.tint=playerOwnership.player.color;
                            resourceNode.capture(playerOwnership.player);
                        }
                        break;
                    default:
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

                const unitOnTile = this.units.get(`${position.x}_${position.y}`);
                if (!status && unitOnTile && unitOnTile != this.movingUnit)
                    selectionTile.show(TileStatus.DANGER,unit,tileSelectionType);
                else
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

    summonUnit(location:Position,unitData:UnitCardData, cardOwner: Player){
        const owner = this.playerOwnershipMap.get(this.playerToIDMap.get(cardOwner)!)!.player;
        const unit = new Unit(uuidv4().toString(),location,unitData,owner);
        const position = unit.getLocation();
        unit.render(this.scene);

        const playerOwnership = this.playerOwnershipMap.get(owner.id)!;
        playerOwnership.activeUnits=[...playerOwnership.activeUnits,unit];
        this.units.set(`${position.x}_${position.y}`,unit);
        

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

    getTilesInRange(unitPosition:Position,range:number, passObstacles: boolean):Position[]{
        const maxPosition = {x:this.tilemap.map.width-1,y:this.tilemap.map.height-1};
        const obstacleLayer = this.tilemap.layers.obstacle!;
        const units = this.units;
        const movingUnit = this.movingUnit;

        let accum :Map<string,Position> = new Map();
    
        function inRangeTilesRecursive(currentPosition:Position,tilesLeft:number){
            if (tilesLeft===0)return;
            if (currentPosition.x <0 || currentPosition.y<0)return;
            if (currentPosition.x >maxPosition.x || currentPosition.y>maxPosition.y) return;
            
            accum.set(`${currentPosition.x}_${currentPosition.y}`,currentPosition);
            if(!passObstacles && obstacleLayer.getTileAt(currentPosition.x, currentPosition.y)) return;

            const unitOnTile = units.get(`${currentPosition.x}_${currentPosition.y}`)

            if(!passObstacles && 
                unitOnTile && 
                unitOnTile != movingUnit) 
                     return;
                

            inRangeTilesRecursive({x:currentPosition.x-1,y:currentPosition.y},tilesLeft-1);
            inRangeTilesRecursive({x:currentPosition.x,y:currentPosition.y-1},tilesLeft-1);
            inRangeTilesRecursive({x:currentPosition.x+1,y:currentPosition.y},tilesLeft-1);
            inRangeTilesRecursive({x:currentPosition.x,y:currentPosition.y+1},tilesLeft-1);
        }
    
        inRangeTilesRecursive(unitPosition,range+1);
        const output = Array.from(accum.values());
        return output;
    }

    attemptCaptureLandmark(unit:Unit){
        const {x:unitX,y:unitY} = unit.getLocation();
        const occupyingLandmark = this.landmarks.get(`${unitX}_${unitY}`);

        if (!(occupyingLandmark instanceof BaseCapturableLandmark) || 
            occupyingLandmark instanceof RallyPoint ||
            occupyingLandmark.getOwner() == unit.getOwner()) return;

        occupyingLandmark.updateCaptureTick();
        if (occupyingLandmark.getCaptureTicks() === 0)
            EventEmitter.emit(EVENTS.fieldEvent.CAPTURE_LANDMARK,unit,occupyingLandmark);
        else
            console.log(`${occupyingLandmark.id} will be captured by ${unit.getOwner().id} in ${occupyingLandmark.getCaptureTicks()} turns...`);
    }
}