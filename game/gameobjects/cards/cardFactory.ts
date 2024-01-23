import Card from "./card";
import { CARD_TYPE } from "@/game/enums/keys/cardType";
import { CardData } from "@/game/data/types/cardData";
import { UnitData } from "@/game/data/types/unitData";
import { EffectData } from "@/game/data/types/effectData";
import EffectFactory from "@/game/skillEffects/effectFactory";
import UnitFactory from "../units/unitFactory";

export default class CardFactory{

    /**
     * Creates a card from the input data
     * @param cardData Data used to create the card. See game/data/unitData.ts and game/data/effectData.ts
     * @param owner Initial owner of this card 
     * @returns result card object from information provided
     */
    static createCard(cardData:CardData) : Card{
        let card;
        if ((cardData.cardType === CARD_TYPE.hero || cardData.cardType === CARD_TYPE.unit) && cardData.contents){
            const unitData = cardData.contents as UnitData;
            const unit =  UnitFactory.createUnit(cardData,unitData);
            card = new Card(cardData.id,cardData.name,cardData.cardType,cardData.cost,undefined,unit);
        }
        else {
            const effectData = cardData.contents as EffectData[];
            const effects = EffectFactory.createEffects(effectData);
            card = new Card(cardData.id,cardData.name,cardData.cardType,cardData.cost,effects,undefined,effects[0].targetType);
        }
        return card;
    }

}