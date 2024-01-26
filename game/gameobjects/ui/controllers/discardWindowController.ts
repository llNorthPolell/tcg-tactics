import { EventEmitter } from "@/game/scripts/events";
import Card from "../../cards/card";
import DiscardWindow from "../view/discardWindow";
import { EVENTS } from "@/game/enums/keys/events";

export default class DiscardWindowController{
    private readonly ui: DiscardWindow;
    private heroCard?:Card;
    private cardToDiscard?: Card;
    
    constructor(ui:DiscardWindow){
        this.ui=ui;
    }

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