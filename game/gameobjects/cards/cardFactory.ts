import Card from "./card";
import Unit from "../units/unit";
import CardContent from "../common/cardContent";
import { CARD_TYPE } from "@/game/enums/keys/cardType";
import { CardData } from "@/game/data/types/cardData";
import { UnitData } from "@/game/data/types/unitData";
import { EffectData } from "@/game/data/types/effectData";
import GamePlayer from "../player/gamePlayer";
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
        let contents :CardContent;
        if ((cardData.cardType === CARD_TYPE.hero || cardData.cardType === CARD_TYPE.unit) && cardData.contents){
            const unitData = cardData.contents as UnitData;
            contents = UnitFactory.createUnit(cardData,unitData);
        }
        else {
            const effectData = cardData.contents as EffectData[];
            contents = EffectFactory.createEffects(effectData);
        }
        const card = new Card(cardData.id,cardData.name,cardData.cardType,cardData.cost,contents);
        return card;
    }

}