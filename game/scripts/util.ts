import { Position } from "../data/position";

export function inRange(currentPosition:Position,targetPosition:Position, range:number){
    // x^2 + y^2 = r^2, where r is radius 
    // something is in range if sum of x^2 and y^2 is less than radius
    return Math.round(Math.sqrt(Math.pow((targetPosition.x-currentPosition.x),2) + Math.pow((targetPosition.y-currentPosition.y),2)))<=range;
}

export function pathfind(){
    
}