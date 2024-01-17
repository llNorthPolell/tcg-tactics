import { Position } from "../data/types/position";
import Unit from "../gameobjects/units/unit";
import EffectComponent from "./effectComponent";

export default abstract class BaseEffectComponent implements EffectComponent{
    abstract apply(target?: Unit | Position | undefined): void;
    
    remove(): void {
        throw new Error("Method not implemented.");
    }

}