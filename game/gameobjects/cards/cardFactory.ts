import Effect from "@/game/skillEffects/effect";
import Card from "./card";
import { v4 as uuidv4 } from 'uuid';
import Unit from "../units/unit";
import CardContent from "../common/cardContent";
import { CARD_TYPE } from "@/game/enums/keys/cardType";
import { CardData } from "@/game/data/cardData";
import { UnitData } from "@/game/data/unitData";
import { EffectData } from "@/game/data/effectData";
import GamePlayer from "../player/gamePlayer";

export default class CardFactory{

    /**
     * Creates a card from the input data
     * @param cardData Data used to create the card. See game/data/unitData.ts and game/data/effectData.ts
     * @param owner Initial owner of this card 
     * @returns result card object from information provided
     */
    static createCard(cardData:CardData,owner:GamePlayer) : Card{
        let contents :CardContent;
        if ((cardData.cardType === CARD_TYPE.hero || cardData.cardType === CARD_TYPE.unit) && cardData.contents){
            const unitData = cardData.contents as UnitData;
            contents=new Unit(
                uuidv4().toString(),
                cardData.name,
                owner,
                cardData.id,
                unitData.unitClass,
                unitData.unitType, 
                unitData.stats) 
        }
        else {
            const effectData = cardData.contents as EffectData;
            contents = new Effect(effectData);
        }
        const card = new Card(cardData.id,cardData.name,cardData.cardType,cardData.cost,contents);
        return card;
    }

}