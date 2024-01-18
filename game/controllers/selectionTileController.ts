import { Position } from "../data/types/position";
import { LandmarkType } from "../enums/landmarkType";
import { TileSelectionType } from "../enums/tileSelectionType";
import { TileStatus } from "../enums/tileStatus";
import Landmark from "../gameobjects/landmarks/landmark";
import GamePlayer from "../gameobjects/player/gamePlayer";
import SelectionTile from "../gameobjects/selectionTile";
import Field from "../state/field";
import LandmarkController from "./landmarkController";

import UnitController from "./unitController";

export default class SelectionTileController{
    private readonly field:Field;

    private readonly units: UnitController;

    private selectionTiles: SelectionTile[][];

    private activeTiles:SelectionTile[];
    
    constructor(field:Field,unitController:UnitController){
        this.field=field;
        this.activeTiles=[];
        this.selectionTiles=field.selectionTiles;
        this.units=unitController;
    }

    showRallyPoints(activePlayer:GamePlayer){
        const rallyPoints = activePlayer.landmarks.get(LandmarkType.RALLY_POINT);

        rallyPoints.forEach(
            rallyPoint=>{
                const position = rallyPoint.position;
                const selectionTile = this.selectionTiles[position.y][position.x];
                const unitOnTile = this.units.getUnitByPosition(position);
                this.activeTiles.push(selectionTile);
                selectionTile.show(TileSelectionType.PLAY_CARD,(unitOnTile)?TileStatus.DANGER:TileStatus.SUCCESS);
            }
        )
    }

    showMoves(root:Position,range:number,passObstacles:boolean=false,status?:TileStatus){
        const locations = this.getTilesInRange(root,range,passObstacles);
        locations.forEach(
            position=>{
                const selectionTile = this.selectionTiles![position.y][position.x];
                this.activeTiles.push(selectionTile);

                const unitOnTile = this.units.getUnitByPosition(position);
                if (unitOnTile && position.x !== root.x && position.y !== root.y)
                    selectionTile.show(TileSelectionType.MOVE_UNIT,TileStatus.DANGER);
                else
                    selectionTile.show(TileSelectionType.MOVE_UNIT,status);

            }
        )
    }

    hide(){
        this.activeTiles?.forEach(
            selectionTile=>{
                selectionTile.hide();
            }
        )

        this.activeTiles= [];
    }

    private getTilesInRange(root:Position,range:number, passObstacles: boolean):Position[]{
        const maxPosition = {x:this.field.mapData.map.width-1,y:this.field.mapData.map.height-1};
        const obstacleLayer = this.field.mapData.layers.obstacle!;

        let accum :Map<string,Position> = new Map();
    
        function inRangeTilesRecursive(current:Position,tilesLeft:number){
            if (tilesLeft===0)return;
            if (current.x <0 || current.y<0)return;
            if (current.x >maxPosition.x || current.y>maxPosition.y) return;
            
            accum.set(`${current.x}_${current.y}`,current);
            if(!passObstacles && obstacleLayer.getTileAt(current.x, current.y)) return;

            if(!passObstacles && 
                current.x !== root.x && 
                current.y !== root.y) 
                     return;
                

            inRangeTilesRecursive({x:current.x-1,y:current.y},tilesLeft-1);
            inRangeTilesRecursive({x:current.x,y:current.y-1},tilesLeft-1);
            inRangeTilesRecursive({x:current.x+1,y:current.y},tilesLeft-1);
            inRangeTilesRecursive({x:current.x,y:current.y+1},tilesLeft-1);
        }
    
        inRangeTilesRecursive(root,range+1);
        const output = Array.from(accum.values());
        return output;
    }
}