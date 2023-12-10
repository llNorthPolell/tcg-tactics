import { Position } from "../data/position";

export function inRange(currentPosition:Position,targetPosition:Position, range:number){
    return Math.abs(currentPosition.x-targetPosition.x) <= range &&
        Math.abs(currentPosition.x-targetPosition.x) <= range;
}

export function getTilesInRange(unitPosition:Position,maxPosition:Position, range:number):Position[]{
    let accum :Map<string,Position> = new Map();

    function inRangeTilesRecursive(currentPosition:Position,tilesLeft:number){
        if (tilesLeft===0)return;
        if (currentPosition.x <0 || currentPosition.y<0)return;
        if (currentPosition.x >maxPosition.x || currentPosition.y>maxPosition.y) return;

        accum.set(`${currentPosition.x}_${currentPosition.y}`,currentPosition);

        inRangeTilesRecursive({x:currentPosition.x-1,y:currentPosition.y},tilesLeft-1);
        inRangeTilesRecursive({x:currentPosition.x,y:currentPosition.y-1},tilesLeft-1);
        inRangeTilesRecursive({x:currentPosition.x+1,y:currentPosition.y},tilesLeft-1);
        inRangeTilesRecursive({x:currentPosition.x,y:currentPosition.y+1},tilesLeft-1);
    }

    inRangeTilesRecursive(unitPosition,range+1);
    const output = Array.from(accum.values());
    return output;
}

export function pathfind(){
    
}