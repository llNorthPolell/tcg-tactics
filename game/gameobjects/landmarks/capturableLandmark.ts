import Player from "../player";
import LandmarkImpl from "./landmarkImpl";

export default abstract class CapturableLandmark extends LandmarkImpl{
    owner?: Player;

    constructor(id:string, x:number,y:number,owner? : Player){
        super(id,x,y);
        this.owner = owner;
    }
}