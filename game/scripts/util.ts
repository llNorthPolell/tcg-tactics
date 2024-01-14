import { Position } from "../data/types/position";

export function inRange(currentPosition:Position,destination:Position, range:number){
    if (range === -1) return true;
    return Math.abs(currentPosition.x - destination.x) + Math.abs(currentPosition.y - destination.y) <= range;
}

export function pathfind(){
    
}