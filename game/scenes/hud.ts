import { CANVAS_SIZE, HAND_UI_SIZE } from "../config";
import { CardData } from "../data/cardData";
import { ASSETS } from "../enums/keys/assets";
import { EVENTS } from "../enums/keys/events";
import { GAME_STATE } from "../enums/keys/gameState";
import { SCENES } from "../enums/keys/scenes";
import { UI_COLORS } from "../enums/keys/uiColors";
import { Card } from "../gameobjects/cards/card";
import GamePlayer from "../gameobjects/gamePlayer";
import Button from "../gameobjects/ui/button";
import ResourceDisplay from "../gameobjects/ui/resourceDisplay";
import CardManager from "../scripts/cardManager";
import { EventEmitter } from "../scripts/events";


export default class HUD extends Phaser.Scene{
    private rightPanel? :Phaser.GameObjects.Container;
    private bottomPanel? : Phaser.GameObjects.Container;
    private handContainer?:Phaser.GameObjects.Container;
    private resourceDisplay? : ResourceDisplay;

    private player?: GamePlayer;

    private cardManager? : CardManager;

    constructor(){
        super({
            key: SCENES.HUD
        });
    }

    preload(){}


    private renderHand(hand: Card<CardData>[]){
        this.handContainer = this.add.container(0,0);
        const bg = this.add.rectangle(
            0,
            0,
            HAND_UI_SIZE.width, 
            HAND_UI_SIZE.height,
            0x1C1C1C
        ).setOrigin(0);

        this.handContainer.add(bg);

        hand.forEach(card=>{
            const cardContainer = card.render(this);
            this.handContainer?.add(cardContainer);
        });

        this.bottomPanel?.add(this.handContainer);
    }

    create(){   
        this.player = this.game.registry.get(GAME_STATE.player);
        const deck = this.game.registry.get(GAME_STATE.deck);

        this.bottomPanel = this.add.container(0,CANVAS_SIZE.height*0.8);
        this.rightPanel = this.add.container(CANVAS_SIZE.width*0.8,0);

        this.cardManager = new CardManager(this.player!,deck);
        
        const bg = this.add.rectangle(
            0,
            0,
            HAND_UI_SIZE.width, 
            HAND_UI_SIZE.height,
            UI_COLORS.background
        ).setOrigin(0);

        this.bottomPanel?.add(bg);
        this.renderHand(this.cardManager.getHand());

        const cancelCardButton = new Button(
            this,
            "cancelCardButton",
            "Cancel",
            {x:HAND_UI_SIZE.width * 0.8,y:CANVAS_SIZE.height*0.9},
            200,
            50,
            0x770000,
            ()=>{cancelCardButton?.bg.setFillStyle(UI_COLORS.cancel)},
            ()=>{
                cancelCardButton?.bg.setFillStyle(UI_COLORS.cancelDark);
                EventEmitter.emit(EVENTS.cardEvent.CANCEL);
            });
        
        cancelCardButton.hide();

        this.resourceDisplay = new ResourceDisplay(
            this, 
            "resourceDisplay",
            {x:0,y:CANVAS_SIZE.height*0.35}
        );

        this.rightPanel.add(this.resourceDisplay);

        EventEmitter
        .on(
            EVENTS.cardEvent.SELECT,
            ()=>{
                cancelCardButton.show();
            }
        )
        .on(
            EVENTS.cardEvent.CANCEL,
            ()=>{
                cancelCardButton.hide();
            }
        )
        .on(
            EVENTS.uiEvent.UPDATE_HAND,
            (hand:Card<CardData>[])=>{
                this.renderHand(hand);
            }
        )
    }
    update(){

    }
}