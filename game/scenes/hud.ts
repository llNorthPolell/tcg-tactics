import { CANVAS_SIZE, HAND_UI_SIZE } from "../config";
import { CardData } from "../data/cardData";
import { EVENTS } from "../enums/keys/events";
import { GAME_STATE } from "../enums/keys/gameState";
import { SCENES } from "../enums/keys/scenes";
import { UI_COLORS } from "../enums/keys/uiColors";
import { Card } from "../gameobjects/cards/card";
import GamePlayer from "../gameobjects/gamePlayer";
import Button from "../gameobjects/ui/button";
import HandUIObject from "../gameobjects/ui/handUIObject";
import ResourceDisplay from "../gameobjects/ui/resourceDisplay";
import UnitStatDisplay from "../gameobjects/ui/unitStatDisplay";
import Unit from "../gameobjects/unit";
import CardManager from "../scripts/cardManager";
import { EventEmitter } from "../scripts/events";

const HUD_BUTTON_SIZE = {
    width:200,
    height:50
}

export default class HUD extends Phaser.Scene{
    private rightPanel? :Phaser.GameObjects.Container;
    private bottomPanel? : Phaser.GameObjects.Container;
    private resourceDisplay? : ResourceDisplay;

    private player?: GamePlayer;

    private cardManager? : CardManager;

    constructor(){
        super({
            key: SCENES.HUD
        });
    }

    preload(){}

    create(){
        const player = this.game.registry.get(GAME_STATE.player);
        this.player = player;
        const deck = this.game.registry.get(GAME_STATE.deck);
        
        this.bottomPanel = this.add.container(0,CANVAS_SIZE.height*0.8);
        this.rightPanel = this.add.container(CANVAS_SIZE.width*0.8,0);

        this.cardManager = new CardManager(player,deck);
        
        // bottom panel
        const bg = this.add.rectangle(
            0,
            0,
            HAND_UI_SIZE.width, 
            HAND_UI_SIZE.height,
            UI_COLORS.background
        ).setOrigin(0);
        this.bottomPanel.add(bg);
        
        //      hand 
        const handUIObject = new HandUIObject(this);
        this.add.existing(handUIObject);
        this.bottomPanel.add(handUIObject);

        const cancelCardButton = new Button(
            this,
            "cancelCardButton",
            "Cancel",
            {x:HAND_UI_SIZE.width * 0.8,y:HAND_UI_SIZE.height*0.4},
            HUD_BUTTON_SIZE.width,
            HUD_BUTTON_SIZE.height,
            UI_COLORS.cancel,
            ()=>{cancelCardButton?.bg.setFillStyle(UI_COLORS.cancelLight)},
            ()=>{
                cancelCardButton?.bg.setFillStyle(UI_COLORS.cancel);
                EventEmitter.emit(EVENTS.cardEvent.CANCEL);
            });
        handUIObject.add(cancelCardButton);
        cancelCardButton.hide();

        const endTurnButton = new Button(
            this,
            "endTurnButton",
            "End Turn",
            {x:HAND_UI_SIZE.width * 0.8,y:HAND_UI_SIZE.height*0.1},
            HUD_BUTTON_SIZE.width,
            HUD_BUTTON_SIZE.height,
            UI_COLORS.action,
            ()=>{endTurnButton?.bg.setFillStyle(UI_COLORS.actionLight)},
            ()=>{
                endTurnButton?.bg.setFillStyle(UI_COLORS.action);
                EventEmitter.emit(EVENTS.gameEvent.END_TURN);
            });
        handUIObject.add(endTurnButton);

        //      unit display 
        const unitStatDisplay = new UnitStatDisplay(this);
        this.add.existing(unitStatDisplay);
        this.bottomPanel.add(unitStatDisplay);

        const cancelUnitSelectionButton = new Button(
            this,
            "cancelUnitButton",
            "Cancel",
            {x:HAND_UI_SIZE.width * 0.8,y:HAND_UI_SIZE.height*0.4},
            HUD_BUTTON_SIZE.width,
            HUD_BUTTON_SIZE.height,
            UI_COLORS.cancel,
            ()=>{cancelCardButton?.bg.setFillStyle(UI_COLORS.cancelLight)},
            ()=>{
                cancelCardButton?.bg.setFillStyle(UI_COLORS.cancel);
                EventEmitter.emit(EVENTS.unitEvent.CANCEL);
            });
        unitStatDisplay.add(cancelUnitSelectionButton);


        unitStatDisplay.hide();

        
        // right panel
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
                endTurnButton.hide();
            }
        )
        .on(
            EVENTS.cardEvent.CANCEL,
            ()=>{
                cancelCardButton.hide();
                endTurnButton.show();
            }
        )
        .on(
            EVENTS.uiEvent.UPDATE_HAND,
            (hand:Card<CardData>[])=>{
                handUIObject.render(hand);
            }
        )
        .on(
            EVENTS.unitEvent.SELECT,
            (unit:Unit)=>{
                handUIObject.setVisible(false);
                unitStatDisplay.show(unit);
            }
        )
        .on(
            EVENTS.unitEvent.CANCEL,
            ()=>{
                handUIObject.setVisible(true);
                unitStatDisplay.hide();
            }
        );

        // TODO: This is a temporary place to draw cards. Should trigger an event somewhere to initialize drawing cards and choosing redraws when game starts.
        this.cardManager.drawCard();
        this.cardManager.drawCard();
        this.cardManager.drawCard();
    }
    
    update(){

    }
}