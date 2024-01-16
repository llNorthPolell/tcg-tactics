import Unit from "../unit";
import BaseCapturableLandmark from "./baseCapturableLandmark";

export default class ResourceNode extends BaseCapturableLandmark{
 
    constructor(id:string,x:number,y:number, tile: Phaser.Tilemaps.Tile){
        super(id,x,y,tile);
    }

    enter(unit: Unit): void {
       
    }
    
    leave(): void {

    }
}