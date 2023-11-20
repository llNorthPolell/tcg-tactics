import Player from "../player";
import Unit from "../unit";
import CapturableLandmark from "./capturableLandmark";

export default class Stronghold implements CapturableLandmark{
    readonly id: string;
    readonly x:number;
    readonly y:number;
    private owner: Player;
    occupant?: Unit;

    constructor(id:string, x:number,y:number,owner : Player){
        this.id=id;
        this.owner = owner;
        this.x=x;
        this.y=y;
    }
    

    getOwner(): Player{
        return this.owner;
    }

    
}