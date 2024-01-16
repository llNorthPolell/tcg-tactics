import GamePlayer from "../gamePlayer";
import Unit from "../unit";
import BaseLandmark from "./baseLandmark";
import CapturableLandmark, { MAX_CAPTURE_TICK } from "./capturableLandmark";

export default abstract class BaseCapturableLandmark extends BaseLandmark implements CapturableLandmark{
    protected captureTick:number;
    protected owner? : GamePlayer;

    constructor(id:string, x:number,y:number,tile:Phaser.Tilemaps.Tile){
        super(id,x,y,tile,true);
        this.captureTick=MAX_CAPTURE_TICK;
    }

    updateCaptureTick(): void {
        this.captureTick--;
    }

    resetCaptureTick(): void {
        this.captureTick=MAX_CAPTURE_TICK;
    }

    getCaptureTicks(): number {
        return this.captureTick;
    }

    capture(owner:GamePlayer):void{
        this.owner = owner;
    }

    getOwner():GamePlayer|undefined{
        return this.owner;
    }
    
    enter(unit: Unit): void {
        this.occupant=unit;
    }
    leave(): void {
        this.occupant=undefined;
        this.resetCaptureTick();
    }
}