import Card from "../../cards/card";
import CardGO from "../../cards/cardGO";
import CardManager from "../../player/cardManager";
import GamePlayer from "../../player/gamePlayer";
import HandUIObject from "../view/handUIObject";

export default class HandUIController{
    private selected?:Card;
    
    private readonly ui : HandUIObject;
    private readonly cards: CardManager;

    constructor(ui: HandUIObject, devicePlayer:GamePlayer){
        this.ui=ui;
        this.cards=devicePlayer.cards;
    }

    select(card:Card){
        if (this.selected) 
            (this.selected.getGameObject() as CardGO).return();

        const cardGO = card.getGameObject();
        if (!cardGO) 
            throw new Error (`Failed to update card game object; no game object was found for ${card.name}`);

        this.selected = card;
        (cardGO as CardGO).pullOut();
        this.ui.showCancelButton();
    }

    cancel(){
        if (!this.selected) return;
        (this.selected.getGameObject() as CardGO).return();
        this.selected=undefined; 
        this.ui.hideCancelButton();       
    }

    drawCard(card:Card){
        const hand = this.cards.getHand();
        this.ui.insertCard(card,hand);
    }

    handlePlayCard(){
        if(!this.selected) return;
        this.ui.removeCard(this.cards.getHand(),this.selected);
        this.cancel();
    }

    setDiscardMode(discardMode:boolean){
        this.ui.setDiscardMode(discardMode);
    }

    getDiscardMode(){
        return this.ui.getDiscardMode();
    }

    hide(){
        this.ui.setVisible(false);
    }

    show(){
        this.ui.setVisible(true);
    }

    handleConfirmDiscard(heroCard:Card,discard:Card){
        this.ui.removeCard(this.cards.getHand(),discard);
        this.drawCard(heroCard);
    }
}