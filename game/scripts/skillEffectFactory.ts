import { Position } from "../data/types/position";
import SkillEffect from "./skillEffects/skillEffect";
import UnitStats from "@/game/data/unitData";

export default class SkillEffectFactory{
    private pool: Map<string, SkillEffect>

    constructor(){
        this.pool = new Map();
    }



    getSkillEffect(name:string, effectCode:string, target:UnitStats|Position) : SkillEffect | undefined{
        // if name exists in map
        // return existing skill effect

        return undefined;
    }
}