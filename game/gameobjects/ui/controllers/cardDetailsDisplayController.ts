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

        this.ui.show();
    }

    hide(){
        this.ui.hide();
        this.ui.reset();
    }
}