import { Position } from "@/game/data/types/position";
import { TILESIZE } from "@/game/config";
import Unit from "./unit";

export default class PositionController{
    /**
     * Location of this unit (in tiles)
     */
    private position:Position;

    /**
     * Location to move this unit (temporary until confirm() is called)
     */
    private destination?:Position;

    /**
     * Reference to parent
     */
    private readonly unit:Unit;

    /**
     * 
     * @param unit Reference to parent
     * @param initPosition Location of the gameObject (in tiles)
     */
    constructor(unit:Unit,initPosition:Position){
        this.unit=unit;
        this.position=initPosition;

    }

    /**
     * Updates position in tiles
     */
    moveTo(destination:Position){
        this.destination = destination;
        const pixelLocation = {x:destination.x * TILESIZE.width, y:destination.y * TILESIZE.height};
        this.unit.getGameObject()!.setPosition(pixelLocation.x,pixelLocation.y);
    }

    confirm(){
        if (this.destination){
            this.position = this.destination;
            this.destination=undefined;
        }
        this.unit.setActive(false);
    }

    /**
     * 
     * @returns position in tiles
     */
    get(){
        return this.position;
    }



}