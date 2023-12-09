import CapturableLandmark from "./capturableLandmark";
import BaseLandmark from "./baseLandmark";

export default class ResourceNode extends BaseLandmark implements CapturableLandmark{
    
    constructor(id:string,x:number,y:number, tile: Phaser.Tilemaps.Tile){
        super(id,x,y,tile);
    }
}