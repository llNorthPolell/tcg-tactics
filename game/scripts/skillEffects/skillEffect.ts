import UnitStats from "@/game/data/unitStats";

export default interface SkillEffect{
    readonly target:UnitStats;
    readonly duration:number;
    readonly isRemovable:boolean;

    isActive() :boolean;

    getCurrTime():number;

    apply() : void;

    remove() : void;
}