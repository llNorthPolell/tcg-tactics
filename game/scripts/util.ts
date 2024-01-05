import { Position } from "../data/types/position";

export function inRange(currentPosition:Position,targetPosition:Position, range:number){
    return Math.abs(currentPosition.x - targetPosition.x) + Math.abs(currentPosition.y - targetPosition.y) <= range;
}

export function pathfind(){
    
}