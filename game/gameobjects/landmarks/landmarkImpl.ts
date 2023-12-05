import Player from "../player";
import Unit from "../unit";
import Landmark from "./landmark";

export default abstract class LandmarkImpl implements Landmark{
    readonly id:string;
    readonly x:number;
    readonly y:number;
    occupant?: Unit;

    constructor(id:string, x:number,y:number){
        this.id=id;
        this.x=x;
        this.y=y;
    }

}