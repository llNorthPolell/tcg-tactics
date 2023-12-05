import { CANVAS_SIZE, HAND_UI_SIZE } from "../config";
import { EVENTS } from "../enums/keys/events";
import { GAME_STATE } from "../enums/keys/gameState";
import { SCENES } from "../enums/keys/scenes";
import { UI_COLORS } from "../enums/keys/uiColors";
import Player from "../gameobjects/player";
import Button from "../gameobjects/ui/button";
import ResourceDisplay from "../gameobjects/ui/resourceDisplay";
import CardManager from "../scripts/cardManager";
import { EventEmitter } from "../scripts/events";


export default class HUD extends Phaser.Scene{
    private rightPanel? :Phaser.GameObjects.Container;
    private bottomPanel? : Phaser.GameObjects.Container;
    private handContainer?:Phaser.GameObjects.Container;
    private resourceDisplay? : ResourceDisplay;

    private player?: Player;

    private cardManager? : CardManager;

    constructor(){
        super({
            key: SCENES.HUD,
            active:true
        });
    }

    preload(){

    }


    renderHand(){
        this.handContainer = this.add.container(0,0);
        const bg = this.add.rectangle(
            0,
            0,
            HAND_UI_SIZE.width, 
            HAND_UI_SIZE.height,
            0x1C1C1C
        ).setOrigin(0);

        this.handContainer.add(bg);

        this.cardManager?.getHand().forEach(card=>{
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
        this.renderHand();

        const playCardButton = new Button(
            this,
            "playCardBtn",
            "Play Card",
            {x:HAND_UI_SIZE.width * 0.8,y:HAND_UI_SIZE.height*0.15},
            200,
            50,
            0x000077,
            ()=>{playCardButton.bg.setFillStyle(UI_COLORS.action)},
            ()=>{
                playCardButton.bg.setFillStyle(UI_COLORS.actionDark);
                EventEmitter.emit(EVENTS.cardEvent.PLAY);
            });
        playCardButton.hide();

        const deselectButton = new Button(
            this,
            "deselectBtn",
            "Deselect",
            {x:HAND_UI_SIZE.width * 0.8,y:HAND_UI_SIZE.height*0.55},
            200,
            50,
            0x770000,
            ()=>{deselectButton?.bg.setFillStyle(UI_COLORS.cancel)},
            ()=>{
                deselectButton?.bg.setFillStyle(UI_COLORS.cancelDark);
                EventEmitter.emit(EVENTS.cardEvent.DESELECT);
            });
        deselectButton.hide();

        this.handContainer?.add(playCardButton);
        this.handContainer?.add(deselectButton);

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
                playCardButton.show();
                deselectButton.show();
            }
        )
        .on(
            EVENTS.cardEvent.DESELECT,
            ()=>{
                playCardButton.hide();
                deselectButton.hide();
            }
        )
    }
    update(){

    }
}