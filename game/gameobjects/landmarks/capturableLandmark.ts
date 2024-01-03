import GamePlayer from "../gamePlayer";
import Landmark from "./landmark";

export const MAX_CAPTURE_TICK= 3;
export default interface CapturableLandmark extends Landmark{
    
    updateCaptureTick():void;

    resetCaptureTick():void;

    getCaptureTicks():number;

    capture(owner:GamePlayer):void;

    getOwner():GamePlayer|undefined;
}