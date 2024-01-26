import { CARD_TYPE } from "@/game/enums/keys/cardType";
import Card from "../../cards/card";
import CardDetailsDisplay from "../view/cardDetailsDisplay";

export default class CardDetailsDisplayController{
    private ui:CardDetailsDisplay;

    constructor(ui:CardDetailsDisplay){
        this.ui=ui;
    }

    show(card:Card){
        this.ui.setCardName(card.name);
        this.ui.setCardType(card.cardType);
        
        switch(card.cardType){
            case CARD_TYPE.spell:
                if (card.description)
                    this.ui.setSpellEffects(card.description)
                break;
            default:
                break;
        }

        this.ui.show();
    }

    hide(){
        this.ui.hide();
        this.ui.reset();
    }
}