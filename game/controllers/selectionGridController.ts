import { Position } from "../data/types/position";
import { GAME_CONSTANT } from "../enums/keys/gameConstants";
import { LandmarkType } from "../enums/landmarkType";
import { TileSelectionType } from "../enums/tileSelectionType";
import { TileStatus } from "../enums/tileStatus";
import GamePlayer from "../gameobjects/player/gamePlayer";
import SelectionTileController from "../gameobjects/selectionTiles/selectionTileController";
import { getPositionsInRange } from "../scripts/util";
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
        const locations = getPositionsInRange(this.field,root,movement,passObstacles);
        
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
        const locations = getPositionsInRange(this.field,root,range,true);
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

                locations.push(...getPositionsInRange(this.field,heroPosition,GAME_CONSTANT.MAX_SPELL_RANGE,true));
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

    
}