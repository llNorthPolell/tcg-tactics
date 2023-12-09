import BaseLandmark from "./baseLandmark";
import CapturableLandmark from "./capturableLandmark";

export default class PointOfInterest extends BaseLandmark implements CapturableLandmark{

    constructor(id:string,x:number,y:number, tile:Phaser.Tilemaps.Tile){
        super(id,x,y,tile);
    }


}