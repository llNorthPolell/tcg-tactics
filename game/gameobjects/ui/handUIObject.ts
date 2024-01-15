import { CardData } from "@/game/data/cardData";
import { Card } from "../cards/card";
import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";
import { CARD_SIZE } from "@/game/config";

export default class HandUIObject extends Phaser.GameObjects.Container{
    private discardMode:boolean;

    constructor(scene:Phaser.Scene){
        super(scene,0,0);
        this.discardMode=false;
    }

    
    render(hand: Card<CardData>[]){
        hand.forEach(card=>{
            if (card.getGameObject()) return;
            const cardContainer = card.render(this.scene);

            cardContainer.setInteractive(
                new Phaser.Geom.Rectangle(
                    0,
                    0,
                    CARD_SIZE.width,
                    CARD_SIZE.height
                )
                ,Phaser.Geom.Rectangle.Contains
            ).on(
                Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
                ()=>{
                    EventEmitter.emit((this.discardMode)?EVENTS.cardEvent.SELECT_DISCARD:EVENTS.cardEvent.SELECT,card);
                }
            );

            this.add(cardContainer);
            

        });
    }

    setDiscardMode(discardMode:boolean){
        this.discardMode=discardMode;
    }

    getDiscardMode(){
        return this.discardMode;
    }
}