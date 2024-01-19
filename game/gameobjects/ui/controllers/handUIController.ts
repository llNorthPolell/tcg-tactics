import Card from "../../cards/card";
import CardGO from "../../cards/cardGO";
import CardManager from "../../player/cardManager";
import GamePlayer from "../../player/gamePlayer";
import HandUIObject from "../view/handUIObject";

export default class HandUIController{
    private discardMode : boolean;
    private selected?:Card;
    
    private readonly ui : HandUIObject;
    private readonly cards: CardManager;

    constructor(ui: HandUIObject, devicePlayer:GamePlayer){
        this.discardMode=false;
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


    
    setDiscardMode(discardMode:boolean){
        this.discardMode=discardMode;
    }

    getDiscardMode(){
        return this.discardMode;
    }


    update(){
        const hand = this.cards.getHand();
        this.ui.update(hand,this.discardMode);
    }

    hide(){
        this.ui.setVisible(false);
    }

    show(){
        this.ui.setVisible(true);
    }
}