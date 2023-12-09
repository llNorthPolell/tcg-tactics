import { Position } from "../data/position";

export function inRange(currentPosition:Position,targetPosition:Position, range:number){
    return Math.abs(currentPosition.x-targetPosition.x) <= range &&
        Math.abs(currentPosition.x-targetPosition.x) <= range;
}

export function getWalkablePositions(unitPosition:Position,maxPosition:Position, movement:number):Position[]{
    let accum :Map<string,Position> = new Map();

    function walkablePositionsRecursive(currentPosition:Position,movesLeft:number){
        if (movesLeft===0)return;
        if (currentPosition.x <0 || currentPosition.y<0)return;
        if (currentPosition.x >maxPosition.x || currentPosition.y>maxPosition.y) return;

        accum.set(`${currentPosition.x}_${currentPosition.y}`,currentPosition);

        walkablePositionsRecursive({x:currentPosition.x-1,y:currentPosition.y},movesLeft-1);
        walkablePositionsRecursive({x:currentPosition.x,y:currentPosition.y-1},movesLeft-1);
        walkablePositionsRecursive({x:currentPosition.x+1,y:currentPosition.y},movesLeft-1);
        walkablePositionsRecursive({x:currentPosition.x,y:currentPosition.y+1},movesLeft-1);
    }

    walkablePositionsRecursive(unitPosition,movement+1);
    console.log(accum);
    const output = Array.from(accum.values());
    return output;
}

export function pathfind(){
    
}