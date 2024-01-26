import { CANVAS_SIZE, CARD_SIZE } from "@/game/config";
import { EVENTS } from "@/game/enums/keys/events";
import { UI_COLORS } from "@/game/enums/keys/uiColors";
import { EventEmitter } from "@/game/scripts/events";
import Button from "./button";
import CardGO from "../../cards/cardGO";
import Card from "../../cards/card";
import GameObjectFactory from "../../gameObjectFactory";

const DISCARD_WINDOW_SIZE = {
    width: CANVAS_SIZE.width*0.4,
    height: CANVAS_SIZE.height*0.5
}

export default class DiscardWindow extends Phaser.GameObjects.Container{
    private heroCardContainer?:CardGO;
    private discardContainer?: CardGO;

    private okButton:Button;

    constructor(scene:Phaser.Scene){
        super(scene,CANVAS_SIZE.width*0.25,CANVAS_SIZE.height*0.2);

        const bg = scene.add.rectangle(
            0,
            0,
            DISCARD_WINDOW_SIZE.width,
            DISCARD_WINDOW_SIZE.height,
            UI_COLORS.background
        ).setOrigin(0);

        const description = scene.add.text(
            DISCARD_WINDOW_SIZE.width *0.1,
            DISCARD_WINDOW_SIZE.height*0.1,
            "Maximum hand size reached! Please discard a card to make room for this hero.",
            {
                wordWrap: { width: DISCARD_WINDOW_SIZE.width*0.9 }
            }
        ).setOrigin(0);
        
        const discardLabel = scene.add.text(
            DISCARD_WINDOW_SIZE.width * 0.1,
            DISCARD_WINDOW_SIZE.height * 0.25,
            "To Discard:"
        );

        const discardBg = scene.add.rectangle(
            DISCARD_WINDOW_SIZE.width * 0.1,
            DISCARD_WINDOW_SIZE.height * 0.35,
            CARD_SIZE.width,
            CARD_SIZE.height,
            0x000000
        ).setOrigin(0);

        const nextCard = scene.add.text(
            DISCARD_WINDOW_SIZE.width * 0.55,
            DISCARD_WINDOW_SIZE.height * 0.25,
            "Next Card:"
        );

        this.okButton = new Button(
            scene,
            "confirmDiscard",
            "OK",
            {x:DISCARD_WINDOW_SIZE.width * 0.35,y:DISCARD_WINDOW_SIZE.height * 0.85},
            DISCARD_WINDOW_SIZE.width*0.2,
            DISCARD_WINDOW_SIZE.height*0.1,
            UI_COLORS.action,
            ()=>{this.okButton?.bg.setFillStyle(UI_COLORS.actionLight)},
            ()=>{
                this.okButton?.bg.setFillStyle(UI_COLORS.action);
                
                if(!this.heroCardContainer) return;
                if(!this.discardContainer) return;
                EventEmitter.emit(EVENTS.cardEvent.CONFIRM_DISCARD,this.heroCardContainer?.getCard(),this.discardContainer.getCard());
                this.hide();
    
            });
        this.okButton.hide();

        this.add(bg);
        this.add(description);
        this.add(discardLabel);
        this.add(discardBg);
        this.add(nextCard);
        this.add(this.okButton);

        this.hide();
    }

    setCardToDiscard(card:Card){
        if(this.discardContainer)
            this.remove(this.discardContainer,true);

        const position = {x:DISCARD_WINDOW_SIZE.width * 0.1,
            y:DISCARD_WINDOW_SIZE.height * 0.35}
        this.discardContainer = GameObjectFactory.createCardGO(this.scene,card,position);
    
        this.add(this.discardContainer);
    }


    showOKButton(){
        this.okButton.show();
    }

    setHeroCard(heroCard:Card){
        const position = {x:DISCARD_WINDOW_SIZE.width * 0.55,
            y:DISCARD_WINDOW_SIZE.height * 0.35};
        this.heroCardContainer = new CardGO(this.scene,heroCard,position);
        this.add(this.heroCardContainer);
    }

    show(){
        this.setVisible(true);
    }

    hide(){
        this.setVisible(false);
    }

    reset(){
        if (this.heroCardContainer)
            this.remove(this.heroCardContainer, true);
        if (this.discardContainer)
            this.remove(this.discardContainer,true);
        this.okButton.hide();
    }
}