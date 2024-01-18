import { UnitData } from "@/game/data/types/unitData";
import Unit from "./unit";
import { v4 as uuidv4 } from 'uuid';
import EffectFactory from "@/game/skillEffects/effectFactory";
import { CardData } from "@/game/data/types/cardData";

export default class UnitFactory{

    static createUnit(cardData:CardData, unitData:UnitData):Unit{
        const unitEffects = (unitData.effects)?
            EffectFactory.createEffects(unitData.effects):[];
        const newUnit = new Unit(
            uuidv4().toString(),
            unitData.name,
            cardData.id,
            unitData.unitClass,
            unitData.unitType,
            unitData.stats,
            unitEffects);

        return newUnit;
    }

}