import { Position } from "../data/types/position";
import Unit from "../gameobjects/units/unit";
import Field from "../state/field";

export function inRange(currentPosition:Position,destination:Position, range:number){
    if (range === -1) return true;
    return Math.abs(currentPosition.x - destination.x) + Math.abs(currentPosition.y - destination.y) <= range;
}

export function getPositionsInRange(field:Field, root:Position,range:number, passObstacles: boolean):Position[]{
    const maxPosition = {x:field.mapData.map.width-1,y:field.mapData.map.height-1};
    const obstacleLayer = field.mapData.layers.obstacle!;
    const units = field.units;

    let accum :Map<string,Position> = new Map();

    function inRangePositionsRecursive(current:Position,tilesLeft:number){
        if (tilesLeft===0)return;

        if (current.x <0 || current.y<0)return;
        if (current.x >maxPosition.x || current.y>maxPosition.y) return;
        
        accum.set(`${current.x}_${current.y}`,current);
        if(!passObstacles && obstacleLayer.getTileAt(current.x, current.y)) return;

        const unitOnTile = units.get(`${current.x}_${current.y}`);

        if(!passObstacles && 
            unitOnTile &&
            current !== root)
                return;
            

            inRangePositionsRecursive({x:current.x-1,y:current.y},tilesLeft-1);
            inRangePositionsRecursive({x:current.x,y:current.y-1},tilesLeft-1);
            inRangePositionsRecursive({x:current.x+1,y:current.y},tilesLeft-1);
            inRangePositionsRecursive({x:current.x,y:current.y+1},tilesLeft-1);
    }

    inRangePositionsRecursive(root,range+1);
    const output = Array.from(accum.values());
    return output;
}


/**
 * @param field Reference to the playing field
 * @param root Center location to check
 * @param range Maximum distance from root for a unit to be considered
 * @returns A list of units within range
 */
export function getUnitsInRange(field:Field, root:Position,range:number){
    if (range=== -1){
        const units = Array.from(field.units.values());
        return units;
    }

    const maxPosition = {x:field.mapData.map.width-1,y:field.mapData.map.height-1};
    const units = field.units;

    let unitsInRange:Set<Unit>=new Set();

    function inRangeUnitsRecursive(current:Position,tilesLeft:number){
        if (tilesLeft===0)return;

        if (current.x <0 || current.y<0)return;
        if (current.x >maxPosition.x || current.y>maxPosition.y) return;
        

        const unitOnTile = units.get(`${current.x}_${current.y}`);

        if(unitOnTile)
            unitsInRange.add(unitOnTile);
            
        inRangeUnitsRecursive({x:current.x-1,y:current.y},tilesLeft-1);
        inRangeUnitsRecursive({x:current.x,y:current.y-1},tilesLeft-1);
        inRangeUnitsRecursive({x:current.x+1,y:current.y},tilesLeft-1);
        inRangeUnitsRecursive({x:current.x,y:current.y+1},tilesLeft-1);
    }

    inRangeUnitsRecursive(root,range+1);
    return Array.from(unitsInRange);
} 