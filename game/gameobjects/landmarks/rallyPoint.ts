import Player from "../player";
import CapturableLandmark from "./capturableLandmark";
import Landmark from "./landmark";

export default class RallyPoint extends CapturableLandmark{
    
    constructor(id:string,x:number,y:number, owner?:Player){
        super(id,x,y,owner);
    }
}