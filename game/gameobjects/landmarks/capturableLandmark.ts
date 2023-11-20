import Player from "../player";
import Landmark from "./landmark";

export default interface CapturableLandmark extends Landmark{
    getOwner:()=>Player;
}