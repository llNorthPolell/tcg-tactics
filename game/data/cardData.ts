import { EffectData } from "./effectData";
import Player from "./player";
import { UnitData } from "./unitData";

export type CardData = {
    id: string;
    name: string;
    cardType: string,
    cost:number,
    contents: UnitData | EffectData
    owner:Player
}