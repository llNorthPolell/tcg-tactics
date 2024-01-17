import { Position } from "../data/types/position";
import Unit from "../gameobjects/units/unit";

export default interface EffectComponent{
    apply(target?:Unit|Position):void;
    remove():void;
}