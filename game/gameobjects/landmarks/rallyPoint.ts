import BaseLandmark from "./baseLandmark";

export default class RallyPoint extends BaseLandmark{
    
    constructor(id:string,x:number,y:number, tile:Phaser.Tilemaps.Tile){
        super(id,x,y,tile);
    }
}