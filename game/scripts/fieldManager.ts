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
import { Position } from "../data/types/position";
import { CardData } from "../data/cardData";
import UnitCard from "../gameobjects/cards/unitCard";
import HeroCard from "../gameobjects/cards/heroCard";
import { TileStatus } from "../enums/tileStatus";
import SelectionTile from "../gameobjects/selectionTile";
import UnitCardData from "../data/cards/unitCardData";
import { v4 as uuidv4 } from 'uuid';
import { TileSelectionType } from "../enums/tileSelectionType";
import Player from "../data/player";
import Landmark from "../gameobjects/landmarks/landmark";
import CapturableLandmark from "../gameobjects/landmarks/capturableLandmark";
import SpellCard from "../gameobjects/cards/spellCard";
import { TARGET_TYPES } from "../enums/keys/targetTypes";
import HeroCardData from "../data/cards/heroCardData";
import { LandmarksCollection } from "../data/types/landmarksCollection";

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
    units: Map<string,Unit>,
    landmarks: Map<string, Landmark>
}

export default class FieldManager{
    private scene: Phaser.Scene;
    private playersInGame: GamePlayer[];
    private playerIdToIndexMap: Map<number,number>;
    private selectionTiles?: SelectionTile[][];
    private activeHighlightTiles: SelectionTile[];
    private tilemap: TilemapData;
    private activePlayerId: number;
    private activePlayerIndex: number;
    private units:Map<string,Unit>;
    private movingUnit?:Unit;
    private landmarks: Map<string,Landmark>;

    constructor(scene:Phaser.Scene,playersInGame:GamePlayer[]){
        this.scene=scene;
        this.playersInGame = playersInGame;
        this.playerIdToIndexMap= new Map();

        playersInGame.forEach(
            (player:GamePlayer,index:number) => {
                this.playerIdToIndexMap.set(player.id,index);
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
            units: this.units,
            landmarks: this.landmarks
        }


        this.scene.game.registry.set(GAME_STATE.field,field);


        this.handleEvents();

        this.activePlayerIndex=0;
        this.activePlayerId=0;

        playersInGame.forEach(
            player=>{
                const stronghold = player.getStartingStronghold();
                const leader = player.deck.getLeader();
                if (leader)
                    this.summonUnit({x:stronghold?.x,y:stronghold.y},leader.data,player);
            }
        )
    }

    private handleEvents(){
        EventEmitter
        .on(
            EVENTS.gameEvent.PLAYER_TURN,
            (_playerId: number, activePlayerIndex:number, isDevicePlayerTurn: boolean)=>{
                this.activePlayerIndex=activePlayerIndex;

                const player = this.playersInGame[activePlayerIndex];
                player.getActiveUnits().forEach(unit=> {
                    unit.wake();
                    this.attemptCaptureLandmark(unit); 
                });

                if (!isDevicePlayerTurn) return;

                const landmarksOwned = this.playersInGame[activePlayerIndex].getLandmarksOwned();
                const income = 
                    (landmarksOwned.strongholds.length*2) + 
                    landmarksOwned.outposts.length + 
                    landmarksOwned.resourceNodes.length;
                EventEmitter.emit(EVENTS.playerEvent.GENERATE_RESOURCES,income);
                
            }
        )
        .on(
            EVENTS.gameEvent.NEXT_TURN,
            ()=>{
                const player = this.playersInGame[this.activePlayerIndex];
                player.getActiveUnits().forEach(unit=> {
                    if(!unit.isActive()) return;
                    unit.sleep();
                    console.log(`${unit.getUnitData().name} has not moved, so it was set to inactive...`);
                });
            }
        )
        .on(
            EVENTS.cardEvent.SELECT,
            (card : Card<CardData>)=>{
                this.hideHighlightTiles();
                if (card instanceof UnitCard || card instanceof HeroCard){
                    const rallyPointPositions : Position[] = 
                        this.playersInGame[this.activePlayerIndex].getLandmarksOwned()!
                        .rallyPoints!
                        .map(
                            rallyPoint=> {return {x:rallyPoint.x,y:rallyPoint.y}}
                        );
                    

                    this.showHighlightTiles(rallyPointPositions,undefined,undefined,TileSelectionType.PLAY_CARD);
                }
                else {
                    switch((card as SpellCard).data.targetType){
                        case TARGET_TYPES.ally:
                            console.log(`Choose an ally to use ${card.data.name} on...`);
                            break;
                        case TARGET_TYPES.enemy:
                            console.log(`Choose an enemy to use ${card.data.name} on...`);
                            break;
                        case TARGET_TYPES.position:
                            console.log(`Choose a target location to use ${card.data.name} on...`);
                            break;
                        default:
                            console.log(`Applied ${card.data.name}!`);
                            break;
                    }
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
                const gamePlayer = this.playersInGame.find(player=> player.playerInfo.id == cardOwner.id);

                if (!gamePlayer) return;

                this.summonUnit(location,unitData,gamePlayer);
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
 
                if (active){
                    const highlightTiles = this.getTilesInRange(
                        location,
                        movement,
                        false);
                    this.showHighlightTiles(highlightTiles,unit,undefined,TileSelectionType.MOVE_UNIT);
                    return;
                }

                const highlightTiles = this.getTilesInRange(
                    location,
                    range,
                    true);
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
                const prevLandmark = this.landmarks.get(`${prevLocation.x}_${prevLocation.y}`);

                // if unit was capturing a landmark and steps out
                if (prevLandmark && prevLandmark.capturable) {
                    prevLandmark.occupant = undefined;
                    (prevLandmark as CapturableLandmark).resetCaptureTick();
                }

                this.units.delete(`${prevLocation.x}_${prevLocation.y}`);
                this.movingUnit.confirmMove();

                const newLocation = this.movingUnit.getLocation();
                const newLandmark = this.landmarks.get(`${newLocation.x}_${newLocation.y}`);

                this.units.set(`${newLocation.x}_${newLocation.y}`,this.movingUnit);
                this.movingUnit=undefined;
                
                if (newLandmark)
                    newLandmark.occupant=this.movingUnit;
            }
        )
        .on(
            EVENTS.fieldEvent.CAPTURE_LANDMARK,
            (unit:Unit, landmark:CapturableLandmark)=>{
                const ownerIndex = this.playerIdToIndexMap.get(unit.getOwner().id);
                if (ownerIndex === undefined) return;
                this.playersInGame[ownerIndex].registerLandmark(landmark);
            }
        )
        .on(
            EVENTS.unitEvent.DEATH,
            (unit:Unit)=>{
                const ownerIndex = this.playerIdToIndexMap.get(unit.getOwner().id);
                if (ownerIndex === undefined) return;
                this.playersInGame[ownerIndex].moveUnitToGraveyard(unit);
                const lastLocation = unit.getLocation();
                this.units.delete(`${lastLocation.x}_${lastLocation.y}`);
                unit.setLocation({x:-1,y:-1});
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


    loadLandmarks(tilemapData:TilemapData) : {landmarks:LandmarksCollection, landmarkMap:Map<string,Landmark>}{
        let landmarks :LandmarksCollection = {
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


    assignInitialLandmarks(tilemapData:TilemapData, landmarks:LandmarksCollection){
        const playerStartLayer=tilemapData.layers.playerStarts;
        const landmarksLayer=tilemapData.layers.landmarks;

        playerStartLayer.objects.forEach(
            object=>{
                const tileX = Math.floor(object.x!/object.width!);
                const tileY = Math.floor(object.y!/object.height!);

                const landmarkTile = landmarksLayer.getTileAt(tileX,tileY);
                const landmarkName = landmarkTile.properties.name;

                const owner = this.playersInGame[Number(object.name)-1];

                if (owner){
                    switch(landmarkName){
                        case "Stronghold":
                            const stronghold = landmarks.strongholds.find(landmark=>landmark.x==tileX && landmark.y==tileY);
                            if (stronghold){
                                owner.registerLandmark(stronghold);
                                stronghold.capture(owner);
                            }
                            break;
                        case "Outpost":
                            const outpost = landmarks.outposts.find(landmark=>landmark.x==tileX && landmark.y==tileY);
                            if (outpost){
                                owner.registerLandmark(outpost);
                                outpost.capture(owner);
                            }
                            break;
                        case "Resource Node":
                            const resourceNode = landmarks.resourceNodes.find(landmark=>landmark.x==tileX && landmark.y==tileY);
                            if (resourceNode){
                                owner.registerLandmark(resourceNode);
                                resourceNode.capture(owner);
                            }
                            break;
                        default:
                            break;
                    }
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

    // TODO: Should not be looking up by player objects!
    summonUnit(location:Position,unitData:UnitCardData, owner: GamePlayer){
        const unit = new Unit(uuidv4().toString(),location,unitData,owner);
        const position = unit.getLocation();
        unit.render(this.scene);

        if (unitData instanceof HeroCardData)
            owner.registerHero(unit);
        else 
            owner.registerUnit(unit);
        this.units.set(`${position.x}_${position.y}`,unit);
        
        if (unitData instanceof HeroCardData)
            console.log(`Summoned hero unit ${unit.getUnitData().name} with id ${unit.id} at location (${position.x},${position.y})`);
        else
            console.log(`Summoned ${unit.getUnitData().name} with id ${unit.id} at location (${position.x},${position.y})`);
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

        if (!(occupyingLandmark?.capturable)) return;
        if (occupyingLandmark instanceof RallyPoint) return;

        const occupyingCapturableLandmark = occupyingLandmark as CapturableLandmark;
        if (occupyingCapturableLandmark.getOwner() == unit.getOwner()) return;

    
        occupyingCapturableLandmark.updateCaptureTick();
        if (occupyingCapturableLandmark.getCaptureTicks() === 0)
            EventEmitter.emit(EVENTS.fieldEvent.CAPTURE_LANDMARK,unit,occupyingLandmark);
        else
            console.log(`${occupyingLandmark.id} will be captured by ${unit.getOwner().id} in ${occupyingCapturableLandmark.getCaptureTicks()} turns...`);
    }

    getUnitsInRange(position:Position){

    }
}