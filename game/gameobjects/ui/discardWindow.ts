import { CANVAS_SIZE, CARD_SIZE } from "@/game/config";
import { ASSETS } from "@/game/enums/keys/assets";
import { EVENTS } from "@/game/enums/keys/events";
import { UI_COLORS } from "@/game/enums/keys/uiColors";
import { EventEmitter } from "@/game/scripts/events";
import { Card } from "../cards/card";
import { CardData } from "@/game/data/types/cardData";
import HeroCard from "../cards/heroCard";
import Button from "./button";
import SpellCard from "../cards/spellCard";
import SpellCardGO from "../cards/spellCardGO";
import UnitCardGO from "../cards/unitCardGO";
import UnitCard from "../cards/unitCard";
import CardGO from "../cards/cardGO";
import HeroCardGO from "../cards/heroCardGO";

const DISCARD_WINDOW_SIZE = {
    width: CANVAS_SIZE.width*0.4,
    height: CANVAS_SIZE.height*0.5
}

export default class DiscardWindow extends Phaser.GameObjects.Container{
    private heroCard?:HeroCard;
    private heroCardContainer?:HeroCardGO;
    private cardToDiscard?: Card<CardData>;
    private discardContainer?: CardGO<CardData>;

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

        /*const nextCardImg = scene.add.image(
            DISCARD_WINDOW_SIZE.width * 0.55,
            DISCARD_WINDOW_SIZE.height * 0.35,
            ASSETS.UNDEFINED
        )
        .setOrigin(0)
        .setDisplaySize(
            DISCARD_WINDOW_SIZE.width*0.3,
            DISCARD_WINDOW_SIZE.height*0.6,
        );*/



        const okButton = new Button(
            scene,
            "confirmDiscard",
            "OK",
            {x:DISCARD_WINDOW_SIZE.width * 0.35,y:DISCARD_WINDOW_SIZE.height * 0.85},
            DISCARD_WINDOW_SIZE.width*0.2,
            DISCARD_WINDOW_SIZE.height*0.1,
            UI_COLORS.action,
            ()=>{okButton?.bg.setFillStyle(UI_COLORS.actionLight)},
            ()=>{
                okButton?.bg.setFillStyle(UI_COLORS.action);
                if(!this.cardToDiscard) return;
                EventEmitter.emit(EVENTS.cardEvent.CONFIRM_DISCARD,this.heroCard,this.cardToDiscard);
            });
        okButton.hide();

        this.add(bg);
        this.add(description);
        this.add(discardLabel);
        this.add(discardBg);
        this.add(nextCard);
        this.add(okButton);


        EventEmitter
        .on(
            EVENTS.cardEvent.SELECT_DISCARD,
            (card:Card<CardData>)=>{
                if(!card) return;
                if (card instanceof HeroCard) return;
                this.update(card)

                if (this.cardToDiscard)
                okButton.show();
            }
        )
        .on(
            EVENTS.cardEvent.CONFIRM_DISCARD,
            ()=>{
                this.hide();
            }
        )
    }



    show(heroCard:HeroCard){
        this.heroCard = heroCard;
        heroCard.setPosition({x:DISCARD_WINDOW_SIZE.width * 0.55,
            y:DISCARD_WINDOW_SIZE.height * 0.35});
        this.heroCardContainer = new HeroCardGO(this.scene,heroCard);
        this.add(this.heroCardContainer);
        this.setVisible(true);
    }

    update(card:Card<CardData>){     
        if(this.discardContainer)
            this.remove(this.discardContainer,true);
        this.cardToDiscard = card;

        this.discardContainer = (card instanceof SpellCard)?
            new SpellCardGO(this.scene,card):
            new UnitCardGO(this.scene,card as UnitCard);

        this.discardContainer.setPosition(DISCARD_WINDOW_SIZE.width * 0.1,
            DISCARD_WINDOW_SIZE.height * 0.35)
        this.add(this.discardContainer);
    }

    hide(){
        if (this.heroCardContainer)
            this.remove(this.heroCardContainer, true);
        if (this.discardContainer)
            this.remove(this.discardContainer,true);
        this.setVisible(false);
    }
}