import { TilemapData } from "@/game/data/types/tilemapData";
import { ASSETS } from "@/game/enums/keys/assets";
import Landmark from "./gameobjects/landmarks/landmark";
import { LandmarkType } from "@/game/enums/landmarkType";
import SelectionTile from "./gameobjects/selectionTile";
import { TileStatus } from "./enums/tileStatus";
import GamePlayer from "./gameobjects/player/gamePlayer";
import { LandmarksCollection } from "./data/types/landmarksCollection";

export default class FieldGenerator{
    static generateMap(scene:Phaser.Scene) : TilemapData{
        const map = scene.make.tilemap({key:ASSETS.TILE_MAP})!;
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


    static loadLandmarks(tilemapData:TilemapData) : LandmarksCollection{
        const byType = new Map();
        byType.set(LandmarkType.STRONGHOLD,[]);
        byType.set(LandmarkType.RALLY_POINT,[]);
        byType.set(LandmarkType.OUTPOST,[]);
        byType.set(LandmarkType.RESOURCE_NODE,[]);

        let rallyPoints: Map<string,Landmark> = new Map();
        let parentNodes: Map<string,Landmark> = new Map();
        let byLocation : Map<string, Landmark> = new Map();

        const landmarksLayer = tilemapData.layers.landmarks;

        landmarksLayer.forEachTile(
            landmarkTile=>{
                const tileX = landmarkTile.x;
                const tileY = landmarkTile.y;
                const tilePosition = {x:tileX, y:tileY};
                const landmarkName = landmarkTile.properties.name as string;
                const key = `${tileX}_${tileY}`;
                let value;
                // store reference to landmark
                switch(landmarkName){
                    case "Stronghold":
                        value = new Landmark(`stronghold_${key}`,LandmarkType.STRONGHOLD,tilePosition,landmarkTile,true);
                        parentNodes.set(key, value);
                        byType.get(LandmarkType.STRONGHOLD)!.push(value);
                        break;
                    case "Rally Point":
                        value = new Landmark(`rally_point_${key}`,LandmarkType.RALLY_POINT,tilePosition,landmarkTile,true,false);
                        rallyPoints.set(key,value);
                        break;
                    case "Outpost":
                        value = new Landmark(`outpost_${key}`,LandmarkType.OUTPOST,tilePosition,landmarkTile,true);
                        parentNodes.set(key, value);
                        byType.get(LandmarkType.OUTPOST)!.push(value);
                        break;
                    case "Resource Node": 
                        value = new Landmark(`resource_node_${key}`,LandmarkType.RESOURCE_NODE,tilePosition,landmarkTile,true);
                        byType.get(LandmarkType.RESOURCE_NODE)!.push(value);
                        break;
                    case "Interest Point":
                        value = new Landmark(`point_of_interest_${key}`,LandmarkType.POINT_OF_INTEREST,tilePosition,landmarkTile,true);
                        break;
                    case "Camp":
                        break;
                    default:
                        break;
                }
                if (value)
                    byLocation.set(key,value);
                
            }
        );
        this.linkRalliesToParents(parentNodes, rallyPoints)
        return {byType, byLocation};
    }

    private static linkRalliesToParents(parentNodes:Map<string,Landmark>, rallyPoints:Map<string,Landmark>){
        parentNodes.forEach(
            parentNode=>{
                let rallies : Landmark[] = [];
                const west = rallyPoints.get(`${parentNode.tile.x-1}_${parentNode.tile.y}`);
                const northwest = rallyPoints.get(`${parentNode.tile.x-1}_${parentNode.tile.y-1}`);
                const north = rallyPoints.get(`${parentNode.tile.x}_${parentNode.tile.y-1}`);
                const northeast = rallyPoints.get(`${parentNode.tile.x+1}_${parentNode.tile.y-1}`);
                const east = rallyPoints.get(`${parentNode.tile.x+1}_${parentNode.tile.y}`);
                const southeast = rallyPoints.get(`${parentNode.tile.x+1}_${parentNode.tile.y+1}`);
                const south = rallyPoints.get(`${parentNode.tile.x}_${parentNode.tile.y+1}`);
                const southwest = rallyPoints.get(`${parentNode.tile.x-1}_${parentNode.tile.y+1}`);
                
                if (west) rallies = [...rallies,west];
                if (northwest) rallies = [...rallies,northwest];
                if (north) rallies = [...rallies,north];
                if (northeast) rallies = [...rallies,northeast];
                if (east) rallies = [...rallies,east];
                if (southeast) rallies = [...rallies,southeast];
                if (south) rallies = [...rallies,south];
                if (southwest) rallies = [...rallies,southwest];

                parentNode.capturable?.linkRallyPoints(rallies);
            }
        )
    }


    static assignInitialLandmarks(tilemapData:TilemapData, landmarks:Map<LandmarkType,Landmark[]>,playersInGame:GamePlayer[]){
        const playerStartLayer=tilemapData.layers.playerStarts;
        const landmarksLayer=tilemapData.layers.landmarks;

        playerStartLayer.objects.forEach(
            object=>{
                const tileX = Math.floor(object.x!/object.width!);
                const tileY = Math.floor(object.y!/object.height!);

                const landmarkTile = landmarksLayer.getTileAt(tileX,tileY);
                const landmarkName = landmarkTile.properties.name;

                const owner = playersInGame[Number(object.name)-1];

                if (owner){
                    switch(landmarkName){
                        case "Stronghold":
                            const stronghold = landmarks.get(LandmarkType.STRONGHOLD)!.find(
                                landmark=>landmark.position.x==tileX && landmark.position.y==tileY);
                            if (stronghold){
                                owner.landmarks.registerLandmark(stronghold);
                                stronghold.capturable!.capture(owner);
                            }
                            break;
                        case "Outpost":
                            const outpost = landmarks.get(LandmarkType.OUTPOST)!.find(
                                landmark=>landmark.position.x==tileX && landmark.position.y==tileY);
                            if (outpost){
                                owner.landmarks.registerLandmark(outpost);
                                outpost.capturable!.capture(owner);
                            }
                            break;
                        case "Resource Node":
                            const resourceNode = landmarks.get(LandmarkType.RESOURCE_NODE)!.find(
                                landmark=>landmark.position.x==tileX && landmark.position.y==tileY);
                            if (resourceNode){
                                owner.landmarks.registerLandmark(resourceNode);
                                resourceNode.capturable!.capture(owner);
                            }
                            break;
                        default:
                            break;
                    }
                }
                
            }
        );
    }



    static generateHighlightTiles(scene:Phaser.Scene,tilemapData:TilemapData){
        const map = tilemapData.map;
        const obstacleLayer = tilemapData.layers.obstacle;

        let selectionTiles= new Array(map.height).fill([]).map(row=>new Array(map.width));
        map.forEachTile(
            tile=>{
                const status = (obstacleLayer.getTileAt(tile.x,tile.y))? TileStatus.DANGER:TileStatus.SUCCESS;
                const selectionTile = new SelectionTile(
                    scene,
                    `tile_${tile.x}_${tile.y}`,
                    {x:tile.x,y:tile.y},
                    status);

                selectionTiles[tile.y][tile.x]=selectionTile;
            }
        );

        return selectionTiles;
    }
}