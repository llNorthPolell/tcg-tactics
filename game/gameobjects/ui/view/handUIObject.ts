import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";
import { CARD_SIZE, HAND_UI_SIZE, HUD_BUTTON_SIZE } from "@/game/config";
import Card from "../../cards/card";
import GameObjectFactory from "../../gameObjectFactory";
import Button from "./button";
import { UI_COLORS } from "@/game/enums/keys/uiColors";

export default class HandUIObject extends Phaser.GameObjects.Container{
    private readonly cancelCardButton : Button;

    constructor(scene:Phaser.Scene){
        super(scene,0,0);

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
                //if(!turn.isDevicePlayerTurn) return;
                //cardDetails.hide();
                
                EventEmitter.emit(EVENTS.cardEvent.CANCEL);
            });
        this.add(this.cancelCardButton);
        this.cancelCardButton.hide();
    }

    update(hand: Card[], discardMode:boolean){
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
                    EventEmitter.emit((discardMode)?EVENTS.cardEvent.SELECT_DISCARD:EVENTS.cardEvent.SELECT,card);
                }
            );

            this.add(container);
            

        });
    }

    showCancelButton(){
        this.cancelCardButton.show();
    }

    hideCancelButton(){
        this.cancelCardButton.hide();
    }

}