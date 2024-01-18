import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";
import { CARD_SIZE } from "@/game/config";
import Card from "../cards/card";
import GameObjectFactory from "../gameObjectFactory";
import CardGO from "../cards/cardGO";

export default class HandUIObject extends Phaser.GameObjects.Container{
    private discardMode:boolean;
    private selected?:Card;
    
    constructor(scene:Phaser.Scene){
        super(scene,0,0);
        this.discardMode=false;

        EventEmitter
        .on(
            EVENTS.uiEvent.UPDATE_HAND,
            (hand:Card[])=>{
                this.update(hand);
            }
        )
        .on(
            EVENTS.cardEvent.SELECT,
            (card:Card)=>{
                this.selectCard(card);
            }
        )
        .on(
            EVENTS.cardEvent.CANCEL,
            ()=>{
                this.cancel();
            }
        )
    }

    
    update(hand: Card[]){
        hand.forEach(
            (card:Card, index:number)=>{
            let cardGO = card.getGameObject();
            if (!cardGO) {
                cardGO = GameObjectFactory.createCardGO(this.scene,card,{x:index*CARD_SIZE.width*1.05,y:0});
                card.linkGameObject(cardGO);
            }
            const container = cardGO.getAsContainer();

            container.setInteractive(
                new Phaser.Geom.Rectangle(
                    0,
                    0,
                    CARD_SIZE.width,
                    CARD_SIZE.height
                )
                ,Phaser.Geom.Rectangle.Contains
            )
            .on(
                Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
                ()=>{
                    EventEmitter.emit((this.discardMode)?EVENTS.cardEvent.SELECT_DISCARD:EVENTS.cardEvent.SELECT,card);
                }
            );

            this.add(container);
            

        });
    }

    setDiscardMode(discardMode:boolean){
        this.discardMode=discardMode;
    }

    getDiscardMode(){
        return this.discardMode;
    }

    selectCard(card:Card){
        if (this.selected) 
            (this.selected.getGameObject() as CardGO).return();

        const cardGO = card.getGameObject();
        if (!cardGO) 
            throw new Error (`Failed to update card game object; no game object was found for ${card.name}`);

        this.selected = card;
        (cardGO as CardGO).pullOut();
    }

    cancel(){
        if (!this.selected) return;
        (this.selected.getGameObject() as CardGO).return();
        this.selected=undefined;        
    }

}