import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";
import { CARD_SIZE, HAND_UI_SIZE, HUD_BUTTON_SIZE } from "@/game/config";
import Card from "../../cards/card";
import GameObjectFactory from "../../gameObjectFactory";
import Button from "./button";
import { UI_COLORS } from "@/game/enums/keys/uiColors";
import CardGO from "../../cards/cardGO";

export default class HandUIObject extends Phaser.GameObjects.Container{
    private discardMode:boolean;
    private readonly cancelCardButton : Button;
    private readonly cardContainer: Phaser.GameObjects.Container;

    constructor(scene:Phaser.Scene){
        super(scene,0,0);
        this.discardMode=false;

        this.cardContainer = scene.add.container(0,0);

        this.cancelCardButton = new Button(
            scene,
            "cancelCardButton",
            "Cancel",
            {x:HAND_UI_SIZE.width * 0.8,y:HAND_UI_SIZE.height*0.5},
            HUD_BUTTON_SIZE.width,
            HUD_BUTTON_SIZE.height,
            UI_COLORS.cancel,
            ()=>{this.cancelCardButton?.bg.setFillStyle(UI_COLORS.cancelLight)},
            ()=>{
                this.cancelCardButton?.bg.setFillStyle(UI_COLORS.cancel);
                EventEmitter.emit(EVENTS.cardEvent.CANCEL);
            });
        this.add(this.cardContainer);
        this.add(this.cancelCardButton);
        this.cancelCardButton.hide();
    }

    insertCard(card:Card, hand:Card[]){
        const cardGO = GameObjectFactory.createCardGO(this.scene,card,{x:(hand.length-1)*CARD_SIZE.width *1.05, y:0});
        card.linkGameObject(cardGO);
        const container = cardGO as Phaser.GameObjects.Container;
        container.setInteractive(
            new Phaser.Geom.Rectangle(
                0,
                0,
                CARD_SIZE.width,
                CARD_SIZE.height
            )
            , Phaser.Geom.Rectangle.Contains
        )
        .on(
            Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
            () => {
                EventEmitter.emit((this.discardMode)?EVENTS.cardEvent.SELECT_DISCARD:
                    EVENTS.cardEvent.SELECT,card);
            }
        );
        this.cardContainer.add(cardGO);
    }

    removeCard(hand:Card[],card:Card){
        const cardGO = card.getGameObject();
        if (!cardGO)
            throw new Error(`${card.name} does not have a game object defined...`);
        this.cardContainer.remove(cardGO as CardGO);
        this.repositionHand(hand);
        cardGO.setVisible(false);
        cardGO.setPosition(-100,-100);
    }


    private repositionHand(hand:Card[]){
        hand.forEach(
            (card:Card, index:number)=>{
                const cardGO = card.getGameObject() as CardGO;
                if(!cardGO) return;
                cardGO.setPosition(index * CARD_SIZE.width * 1.05, 0);
            }
        )
    }

    showCancelButton(){
        this.cancelCardButton.show();
    }

    hideCancelButton(){
        this.cancelCardButton.hide();
    }

    setDiscardMode(discardMode:boolean){
        this.discardMode=discardMode;
    }

    getDiscardMode(){
        return this.discardMode;
    }
}