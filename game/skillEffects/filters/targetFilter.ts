import Unit from "@/game/gameobjects/units/unit";

export default interface TargetFilter{
    
    check(target:Unit):boolean;

}