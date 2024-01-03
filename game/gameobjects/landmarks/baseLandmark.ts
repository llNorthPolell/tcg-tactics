import Unit from "../unit";
import Landmark from "./landmark";

export default abstract class BaseLandmark implements Landmark{
    readonly id:string;
    readonly x:number;
    readonly y:number;
    readonly tile: Phaser.Tilemaps.Tile;
    occupant?: Unit;
    readonly capturable: boolean;

    constructor(id:string, x:number,y:number,tile:Phaser.Tilemaps.Tile, capturable:boolean = false){
        this.id=id;
        this.x=x;
        this.y=y;
        this.tile = tile;
        this.capturable=capturable;
    }

}