import { EffectData } from "./effectData";
import { UnitStats } from "./unitStats";

export type UnitData = {
    name:string,
    unitType:string,
    unitClass:string,
    stats:UnitStats,
    effects?:EffectData[]
}