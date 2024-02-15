import Unit from "@/game/gameobjects/units/unit";
import TargetFilter from "./targetFilter";

export default class IsClass implements TargetFilter{
    constructor(
        public readonly unitClass:string
    ){}

    /**
     * @param target The unit to check
     * @returns True if target is the specified unit class
     */
    check(target:Unit){
        return target.unitClass===this.unitClass;
    }
}