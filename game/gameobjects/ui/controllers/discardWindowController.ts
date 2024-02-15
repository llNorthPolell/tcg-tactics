import { EventEmitter } from "@/game/scripts/events";
import Card from "../../cards/card";
import DiscardWindow from "../view/discardWindow";
import { EVENTS } from "@/game/enums/keys/events";

export default class DiscardWindowController{
    private heroCard?:Card;
    private cardToDiscard?: Card;
    
    constructor(
        private readonly ui: DiscardWindow
    ){}

    show(heroCard:Card){
        this.ui.setHeroCard(heroCard);
        this.ui.show();
    }

    hide(){
        this.ui.hide();
        this.reset();
    }

    setCardToDiscard(card:Card){
        this.cardToDiscard=card;
        this.ui.setCardToDiscard(card);
        this.ui.showOKButton();
    }

    reset(){
        this.cardToDiscard=undefined;
        this.heroCard=undefined;
        this.ui.reset();
    }
}