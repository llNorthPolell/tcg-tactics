import { Position } from "../data/types/position";
import { GAME_CONSTANT } from "../enums/keys/gameConstants";
import { LandmarkType } from "../enums/landmarkType";
import { TileSelectionType } from "../enums/tileSelectionType";
import { TileStatus } from "../enums/tileStatus";
import GamePlayer from "../gameobjects/player/gamePlayer";
import SelectionTileController from "../gameobjects/selectionTiles/selectionTileController";
import Unit from "../gameobjects/units/unit";
import Field from "../state/field";

import UnitController from "./unitController";

export default class SelectionGridController{
    private readonly field:Field;

    private readonly units: UnitController;

    private selectionGrid: SelectionTileController[][];

    private activeTiles:SelectionTileController[];
    
    constructor(field:Field,unitController:UnitController){
        this.field=field;
        this.activeTiles=[];
        this.selectionGrid=field.selectionGrid;
        this.units=unitController;
    }

    showRallyPoints(activePlayer:GamePlayer){
        const rallyPoints = activePlayer.landmarks.get(LandmarkType.RALLY_POINT);

        rallyPoints.forEach(
            rallyPoint=>{
                const position = rallyPoint.position;
                const selectionTile = this.selectionGrid[position.y][position.x];
                const unitOnTile = this.units.getUnitByPosition(position);
                this.activeTiles.push(selectionTile);

                selectionTile.setSelectionType(TileSelectionType.PLAY_CARD);
                selectionTile.show((unitOnTile)?TileStatus.DANGER:TileStatus.SUCCESS);

            }
        )
    }

    showMoves(root:Position,movement:number,passObstacles:boolean=false){
        const unit = this.units.getUnitByPosition(root);
        if(!unit)
            throw new Error("Selected unit was not found...");
        const locations = this.getTilesInRange(unit,movement,passObstacles);
        
        locations.forEach(
            position=>{
                const selectionTile = this.selectionGrid![position.y][position.x];
                const unitOnTile = this.units.getUnitByPosition(position);
                this.activeTiles.push(selectionTile);
                
                selectionTile.setSelectionType(TileSelectionType.MOVE_UNIT);

                if (unitOnTile && unit!==unitOnTile)
                    selectionTile.show(TileStatus.DANGER);
                else
                    selectionTile.show();
            }
        )
    }

    showAttackRange(root:Position,range:number,status:TileStatus=TileStatus.WARNING){
        const unit = this.units.getUnitByPosition(root);
        if(!unit)
            throw new Error("Selected unit was not found...");
        const locations = this.getTilesInRange(unit,range,true);
        locations.forEach(
            position=>{
                const selectionTile = this.selectionGrid![position.y][position.x];
                this.activeTiles.push(selectionTile);

                selectionTile.show(status);
            }
        )
    }

    showSpellRange(activePlayer:GamePlayer,selectionType:TileSelectionType=TileSelectionType.NONE){
        const heroes = activePlayer.units.getActiveChampions();
        let locations : Position[] = [];
        heroes.forEach(
            hero=>{
                const heroPosition = hero.position()?.get();
                if(!heroPosition)
                    throw new Error(`${hero.name} does not have a position controller initialized...`);

                locations.push(...this.getTilesInRange(hero,GAME_CONSTANT.MAX_SPELL_RANGE,true));
            }
        )

        locations.forEach(
            position=>{
                const selectionTile = this.selectionGrid![position.y][position.x];
                this.activeTiles.push(selectionTile);
                
                selectionTile.setSelectionType(selectionType);
                selectionTile.show(selectionType===TileSelectionType.PLAY_CARD? TileStatus.SUCCESS: TileStatus.WARNING);
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

    private getTilesInRange(unit:Unit,range:number, passObstacles: boolean):Position[]{
        const maxPosition = {x:this.field.mapData.map.width-1,y:this.field.mapData.map.height-1};
        const obstacleLayer = this.field.mapData.layers.obstacle!;
        const units = this.units;
        const selected = unit;

        let accum :Map<string,Position> = new Map();
    
        function inRangeTilesRecursive(current:Position,tilesLeft:number){
            if (tilesLeft===0)return;

            if (current.x <0 || current.y<0)return;
            if (current.x >maxPosition.x || current.y>maxPosition.y) return;
            
            accum.set(`${current.x}_${current.y}`,current);
            if(!passObstacles && obstacleLayer.getTileAt(current.x, current.y)) return;

            const unitOnTile = units.getUnitByPosition(current);

            if(!passObstacles && 
                unitOnTile &&
                unitOnTile!== selected) 
                    return;
                

            inRangeTilesRecursive({x:current.x-1,y:current.y},tilesLeft-1);
            inRangeTilesRecursive({x:current.x,y:current.y-1},tilesLeft-1);
            inRangeTilesRecursive({x:current.x+1,y:current.y},tilesLeft-1);
            inRangeTilesRecursive({x:current.x,y:current.y+1},tilesLeft-1);
        }
    
        inRangeTilesRecursive(selected.position()?.get()!,range+1);
        const output = Array.from(accum.values());
        return output;
    }
}