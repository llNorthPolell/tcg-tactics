import { Position } from "@/game/data/position";
import UnitStats from "@/game/data/unitData";

export default interface SkillEffect{
    readonly name: string;
    target?:UnitStats|Position;
    readonly duration:number;
    readonly isRemovable:boolean;

    isActive() :boolean;

    getCurrTime():number;

    apply() : void;

    remove() : void;

    forceRemove(): void;
}