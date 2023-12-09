import { Position } from "../data/position";

export function inRange(currentPosition:Position,targetPosition:Position, range:number){
    return Math.abs(currentPosition.x-targetPosition.x) <= range &&
        Math.abs(currentPosition.x-targetPosition.x) <= range;
}


export function pathfind(){
    
}